// Worker file - console logging is essential for debugging background jobs
import { Worker, QueueEvents } from 'bullmq'
import { getMessageQueue } from '../lib/queue/message-queue'
import { db } from '../lib/db'
import type { MessageJob } from '../types/message'
import { createWiroGpt5MiniResponse } from '../lib/clients/wiro-chat'
import { sendWhatsAppTextMessage, sendWhatsAppTypingIndicator } from '../lib/clients/whatsapp-client'
import { InstagramClient } from '../lib/instagram/client'
import { publishNewMessage } from '../lib/redis/pubsub'
import { indexMessage } from '../lib/typesense/messages'

const concurrency = Number(process.env.QUEUE_CONCURRENCY ?? 10)

// Reuse the same connection options BullMQ uses internally (avoids ioredis type/version conflicts)
const queue = getMessageQueue()
const queueEvents = new QueueEvents('message-processing', {
  // BullMQ exposes the connection options on the queue instance
  connection: (queue as any).opts.connection,
})
queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error('queue.failed', { jobId, failedReason })
})
queueEvents.on('completed', ({ jobId }) => {
  console.log('queue.completed', { jobId })
})

const worker = new Worker<MessageJob>(
  'message-processing',
  async (job) => {
    const { messageId, channel, senderId, messageText, connectionId } = job.data

    console.log('🔄 Worker processing job:', { jobId: job.id, messageId, channel, senderId, messageText: messageText?.substring(0, 50) })

    const msg = await db.message.findUnique({ where: { id: messageId } })
    if (!msg) {
      console.warn('⚠️ worker.message_not_found', { messageId })
      return
    }

    // Only respond to messages from customers, not from business
    if (msg.isFromBusiness) {
      console.log('⏭️ Skipping business message (not responding to our own messages)', { messageId, isFromBusiness: msg.isFromBusiness })
      await db.message.update({
        where: { id: messageId },
        data: { status: 'completed' },
      })
      return
    }

    if (msg.status === 'completed') {
      console.log('✅ worker.already_completed', { messageId })
      return
    }

    await db.message.update({
      where: { id: messageId },
      data: { status: 'processing' },
    })

    // Send typing indicator to show "yazıyor..." in WhatsApp
    if (channel === 'whatsapp' && msg.channelMessageId) {
      const phoneNumberId = connectionId || process.env.WHATSAPP_PHONE_NUMBER_ID
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
      if (phoneNumberId && accessToken) {
        try {
          await sendWhatsAppTypingIndicator({
            phoneNumberId,
            accessToken,
            to: senderId,
            messageId: msg.channelMessageId, // WhatsApp message ID from webhook
          })
          console.log('⌨️ Typing indicator sent (yazıyor...)', { messageId, senderId, channelMessageId: msg.channelMessageId })
        } catch (typingError) {
          // Non-critical, continue processing
          console.warn('Failed to send typing indicator:', typingError)
        }
      }
    }

    console.log('🤖 Calling Wiro GPT-5-Mini API...', { messageId, prompt: messageText?.substring(0, 100) })
    
    try {
      const ai = await createWiroGpt5MiniResponse({
        prompt: messageText,
        // Use senderId as user_id so Wiro can persist chat history per user (as documented).
        user_id: senderId,
        // Keep all WhatsApp interactions in the same session unless you decide to separate sessions.
        session_id: channel,
        systemInstructions: 'Sen Remax arsanın “Emlak Asistanı”sın. Görevin: gelen mesajları hızlıca anlamlandırmak, doğru soruları sorarak müşteriyi niteliklendirmek, uygun ilanları önermek, randevu/arama planlamak, ve her etkileşimde CRM notu üretmek.\\n\\n1) Çekirdek hedefler (öncelik sırası)\\n\\t1.\\tİhtiyacı netleştir (satın alma mı kiralama mı, hedef bölge, bütçe, zaman).\\n\\t2.\\tEleme kriterlerini çıkar (olmazsa olmazlar vs. nice-to-have).\\n\\t3.\\tUygun seçenek sun (net, kısa, karşılaştırmalı).\\n\\t4.\\tBir sonraki adımı kapat (arama/randevu/evrak/teklif).\\n\\t5.\\tCRM notunu standart formatta üret.\\n\\n2) Davranış kuralları\\n\\t•\\tKısa, net, yöneten ol. Gevezelik yok.\\n\\t•\\tAynı anda en fazla 2–4 soru sor. Çok soru = müşteri kaçar.\\n\\t•\\tMüşteri belirsizse: varsayım yapma, “şunlardan hangisi?” diye seçenek ver.\\n\\t•\\tFiyat/ölçü/konum gibi bilgilerde belirsiz konuşma. Net rakam/arıklık iste.\\n\\t•\\tAsla yalan söyleme, olmayan ilanı varmış gibi yazma.\\n\\t•\\t“Ben lisanslı danışmanım” gibi iddialar kullanma. “Danışman ekibimiz” / “Portföy ekibimiz” de.\\n\\n3) Dil ve üslup\\n\\t•\\tVarsayılan dil Türkçe. Müşteri İngilizce yazarsa İngilizce devam et.\\n\\t•\\tTon: profesyonel + sıcak + sonuç odaklı.\\n\\t•\\tEmojiyi abartma (maks 1–2).\\n\\n4) Toplanacak minimum bilgiler (Lead intake)\\n\\nMüşteri satın alma/kiralama/yatırım türüne göre aşağıdaki alanları doldurmaya çalış:\\n\\t•\\tİşlem: Satın alma / Kiralama / Yatırım\\n\\t•\\tİl/ilçe/mahalle (veya 2–3 alternatif)\\n\\t•\\tBütçe: üst limit (kira ise aidat dahil mi?)\\n\\t•\\tOda sayısı, m² aralığı\\n\\t•\\tBina yaşı / site / otopark / eşya durumu (kiralıkta kritik)\\n\\t•\\tKat tercihi, asansör\\n\\t•\\tUlaşım/okul/işe yakınlık önceliği\\n\\t•\\tTaşınma tarihi / aciliyet\\n\\t•\\tNakit/ kredi durumu (satın almada)\\n\\t•\\tİletişim tercihi: mesaj mı telefon/WhatsApp araması mı\\n\\nKırmızı bayraklar: “Bütçe yok”, “bölge yok”, “hemen bugün” + “pazarlıkla çok düşer” gibi. Bu durumlarda hızlı netleştir.\\n\\n5) Eşleştirme mantığı (öneri üretimi)\\n\\nİlan önerirken:\\n\\t•\\tÖnce tam uyan 1–2 seçenek, sonra yakın alternatif 1 seçenek ver.\\n\\t•\\tHer ilan için mini özet formatı:\\n\\t•\\tBölge | Tip | 2+1 | m² | Kat | Bina yaşı | Fiyat\\n\\t•\\t2–3 madde “neden uygun”\\n\\t•\\t“Görmek ister misiniz? Şu saatler uygunsa randevu ayarlayabilirim.”\\n\\nEğer elinde ilan verisi yoksa:\\n\\t•\\t“Portföyde tarıyorum” de ve netleştirici soruyu sor.\\n\\t•\\tMüşteriye seçenek sun: “X mi Y mi?” “A bölgesi mi B bölgesi mi?”\\n\\n6) Randevu kapama (zorunlu CTA)\\n\\nHer konuşmanın sonunda mutlaka bir sonraki adım iste:\\n\\t•\\t“Bugün 18:00–20:00 arası mı, yoksa yarın 12:00–14:00 arası mı uygun?”\\n\\t•\\t“2 ilan seçelim, ikisini arka arkaya gezdireyim.”\\n\\n7) İtiraz yönetimi (kısa kalıplar)\\n\\t•\\t“Pahalı” → “Haklısınız. Üst limitinizi netleştirelim: X mi, Y mi? Buna göre ya metrekareyi ya bölgeyi optimize edelim.”\\n\\t•\\t“Daha ucuzu var mı?” → “Var ama genelde (bina yaşı/konum/kat) kırpılıyor. Hangisinden ödün verebiliriz?”\\n\\t•\\t“Kararsızım” → “Kararı hızlandırmak için 3 kriter söyleyin: bölge, bütçe, taşınma tarihi. Geri kalanını ben filtrelerim.”\\n\\n8) Gizlilik ve güvenlik\\n\\t•\\tKimlik/IBAN/kart bilgisi isteme.\\n\\t•\\tSadece gerekli iletişim bilgisi: isim + telefon (randevu için).\\n\\t•\\tAyrımcılık, nefret, hukuksuz talep (sahte evrak, komisyon saklama vb.) → reddet, güvenli alternatif sun.\\n"',
        reasoning: 'medium',
        verbosity: 'medium',
      })
      console.log('✅ Wiro API response received', { messageId, textLength: ai.text?.length })
      
      // Log raw AI response to debug formatting issues
      console.log('📝 AI Raw Response:', {
        messageId,
        rawText: ai.text,
        rawTextLength: ai.text?.length,
        hasNewlines: ai.text?.includes('\n'),
        hasCarriageReturns: ai.text?.includes('\r'),
        first100Chars: ai.text?.substring(0, 100),
      })

      let aiText = (ai.text || '').trim()
      if (!aiText) {
        throw new Error('Wiro returned empty text')
      }

      // Format message for WhatsApp readability
      // 1. Normalize line breaks (keep \n, convert \r\n and \r to \n)
      aiText = aiText.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      
      // 2. Ensure proper spacing around list items and sections
      // Add newline before numbered/bulleted lists if not present
      aiText = aiText.replace(/([.!?])\s*(\d+\))/g, '$1\n\n$2')
      aiText = aiText.replace(/([.!?])\s*([•\-\*])/g, '$1\n\n$2')
      
      // 3. Add spacing before "CRM notu:" or similar section headers
      aiText = aiText.replace(/([.!?])\s*(CRM notu|CRM Notu|CRM NOTU|Not:|Notlar:)/g, '$1\n\n$2')
      
      // 4. Ensure list items have proper line breaks
      // Numbered items (1), 2), etc.)
      aiText = aiText.replace(/(\d+\))\s+/g, '$1 ')
      
      // 5. Add spacing after colons in structured content
      aiText = aiText.replace(/:\s*([A-Z])/g, ':\n$1')
      
      // 6. Remove excessive blank lines (more than 2 consecutive)
      aiText = aiText.replace(/\n{3,}/g, '\n\n')
      
      // 7. Trim each line but preserve intentional line breaks
      aiText = aiText
        .split('\n')
        .map((line, index, array) => {
          // Don't trim lines that are part of lists or structured content
          if (line.match(/^\s*(\d+\)|[-•\*]|CRM|Talep|Durum|Next step)/i)) {
            return line.trim()
          }
          // Don't trim empty lines (they're intentional spacing)
          if (line.trim() === '') {
            return ''
          }
          return line.trim()
        })
        .join('\n')
        .trim()

      // Log formatted text before sending
      console.log('📤 AI Text Formatted for WhatsApp:', {
        messageId,
        formattedText: aiText,
        formattedTextLength: aiText.length,
        hasNewlines: aiText.includes('\n'),
        preview: aiText.substring(0, 300),
      })

      if (channel === 'whatsapp') {
      const phoneNumberId = connectionId || process.env.WHATSAPP_PHONE_NUMBER_ID
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
      if (!phoneNumberId) throw new Error('Missing WhatsApp phoneNumberId (connectionId/WHATSAPP_PHONE_NUMBER_ID)')
      if (!accessToken) throw new Error('WHATSAPP_ACCESS_TOKEN is not set')

      const sendResult = await sendWhatsAppTextMessage({
        phoneNumberId,
        accessToken,
        to: senderId,
        text: aiText,
      })

      const outboundChannelMessageId =
        sendResult?.messages?.[0]?.id ?? `out-${messageId}-${Date.now()}`

      // Save outbound message as its own row (so UI can render sent messages on the right)
      const outbound = await db.message.create({
        data: {
          channel: 'whatsapp',
          channelMessageId: outboundChannelMessageId,
          connectionId: phoneNumberId,
          senderId, // keep same senderId for thread grouping
          senderName: msg.senderName ?? null,
          messageText: aiText,
          messageType: 'text',
          rawPayload: sendResult ?? undefined,
          isFromBusiness: true,
          timestamp: new Date(),
          status: 'completed',
        },
      })

      // Index outbound message in Typesense
      indexMessage(outbound).catch((err) => {
        console.warn('typesense.index_failed', { messageId: outbound.id, err: String(err?.message ?? err) })
      })

      publishNewMessage({
        id: outbound.id,
        channel: outbound.channel,
        channelMessageId: outbound.channelMessageId,
        connectionId: outbound.connectionId ?? null,
        isFromBusiness: true,
        senderId: outbound.senderId,
        senderName: outbound.senderName ?? null,
        messageText: outbound.messageText,
        messageType: outbound.messageType,
        status: outbound.status,
        aiResponse: outbound.aiResponse ?? null,
        timestamp: outbound.timestamp ? outbound.timestamp.toISOString() : null,
        createdAt: outbound.createdAt.toISOString(),
      }).catch(() => {})
    } else if (channel === 'instagram') {
      // Send AI response via Instagram
      try {
        // Find the Instagram connection to get access token and page ID
        const instagramConnection = await db.instagramConnection.findFirst({
          where: connectionId ? { id: connectionId } : undefined,
          select: {
            id: true,
            accessToken: true,
            pageId: true,
            instagramUserId: true,
          },
        })

        if (!instagramConnection) {
          console.warn('⚠️ No InstagramConnection found for sending response', { connectionId, senderId })
          // Continue - message is processed but response not sent
        } else if (!instagramConnection.accessToken || !instagramConnection.pageId) {
          console.warn('⚠️ Instagram connection missing accessToken or pageId', {
            connectionId: instagramConnection.id,
            hasAccessToken: !!instagramConnection.accessToken,
            hasPageId: !!instagramConnection.pageId,
          })
        } else {
          // Send message via Instagram API
          const client = new InstagramClient(instagramConnection.accessToken)
          const sendResult = await client.sendMessage(
            instagramConnection.pageId,
            senderId,
            aiText
          )

          console.log('✅ Instagram AI response sent:', {
            messageId,
            senderId,
            pageId: instagramConnection.pageId,
            resultMessageId: sendResult?.message_id,
          })

          const outboundChannelMessageId =
            sendResult?.message_id ?? `out-instagram-${messageId}-${Date.now()}`

          // Save outbound message as its own row (so UI can render sent messages on the right)
          const outbound = await db.message.create({
            data: {
              channel: 'instagram',
              channelMessageId: outboundChannelMessageId,
              connectionId: instagramConnection.id,
              senderId, // keep same senderId for thread grouping
              senderName: msg.senderName ?? null,
              messageText: aiText,
              messageType: 'text',
              rawPayload: sendResult ?? undefined,
              isFromBusiness: true,
              timestamp: new Date(),
              status: 'completed',
            },
          })

          // Index outbound message in Typesense
          indexMessage(outbound).catch((err) => {
            console.warn('typesense.index_failed', { messageId: outbound.id, err: String(err?.message ?? err) })
          })

          publishNewMessage({
            id: outbound.id,
            channel: outbound.channel,
            channelMessageId: outbound.channelMessageId,
            connectionId: outbound.connectionId ?? null,
            isFromBusiness: true,
            senderId: outbound.senderId,
            senderName: outbound.senderName ?? null,
            messageText: outbound.messageText,
            messageType: outbound.messageType,
            status: outbound.status,
            aiResponse: outbound.aiResponse ?? null,
            timestamp: outbound.timestamp ? outbound.timestamp.toISOString() : null,
            createdAt: outbound.createdAt.toISOString(),
          }).catch(() => {})
        }
      } catch (instagramError: any) {
        console.error('❌ Failed to send Instagram AI response:', {
          error: instagramError?.message ?? instagramError,
          stack: instagramError?.stack,
          messageId,
          senderId,
        })
        // Non-critical - message is still processed, just response not sent
      }
    } else {
      // Unsupported channel
      console.log('worker.skip_send_unsupported_channel', { channel })
    }

      const updatedMessage = await db.message.update({
        where: { id: messageId },
        data: { status: 'completed', aiResponse: aiText },
      })

      // Update message in Typesense index
      indexMessage(updatedMessage).catch((err) => {
        console.warn('typesense.update_failed', { messageId, err: String(err?.message ?? err) })
      })
      
      console.log('✅ Job completed successfully', { messageId, jobId: job.id })
    } catch (error: any) {
      console.error('❌ Error processing job:', { 
        jobId: job.id, 
        messageId, 
        error: error?.message ?? error,
        stack: error?.stack 
      })
      throw error // Re-throw to let BullMQ handle retries
    }
  },
  { connection: (queue as any).opts.connection, concurrency }
)

worker.on('failed', (job, err) => {
  console.error('❌ worker.failed', { 
    jobId: job?.id, 
    messageId: job?.data?.messageId,
    err: err?.message, 
    attemptsMade: job?.attemptsMade,
    stack: err?.stack 
  })
  if (job?.data?.messageId) {
    db.message
      .update({
        where: { id: job.data.messageId },
        data: { status: 'failed' },
      })
      .catch((dbErr) => {
        console.error('Failed to update message status to failed:', dbErr)
      })
  }
})

worker.on('completed', (job) => {
  console.log('✅ worker.completed', { jobId: job.id, messageId: job.data?.messageId })
})

worker.on('active', (job) => {
  console.log('🔄 worker.active', { jobId: job.id, messageId: job.data?.messageId })
})

console.log('message-worker started', { concurrency })

