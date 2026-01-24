import { Worker, QueueEvents } from 'bullmq'
import { getMessageQueue } from '../lib/queue/message-queue'
import { db } from '../lib/db'
import type { MessageJob } from '../types/message'
import { createWiroGpt5MiniResponse } from '../lib/clients/wiro-chat'
import { sendWhatsAppTextMessage } from '../lib/clients/whatsapp-client'
import { publishNewMessage } from '../lib/redis/pubsub'

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

    const msg = await db.message.findUnique({ where: { id: messageId } })
    if (!msg) {
      console.warn('worker.message_not_found', { messageId })
      return
    }

    if (msg.status === 'completed') {
      console.log('worker.already_completed', { messageId })
      return
    }

    await db.message.update({
      where: { id: messageId },
      data: { status: 'processing' },
    })

    const ai = await createWiroGpt5MiniResponse({
      prompt: messageText,
      // Use senderId as user_id so Wiro can persist chat history per user (as documented).
      user_id: senderId,
      // Keep all WhatsApp interactions in the same session unless you decide to separate sessions.
      session_id: channel,
      systemInstructions: 'Sen bir müşteri destek temsilcisisin. Türkçe yanıt ver. Kısa ve net ol.',
      reasoning: 'medium',
      verbosity: 'medium',
    })

    const aiText = (ai.text || '').trim()
    if (!aiText) {
      throw new Error('Wiro returned empty text')
    }

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
    } else {
      // TODO: add other channel send implementations
      console.log('worker.skip_send_unsupported_channel', { channel })
    }

    await db.message.update({
      where: { id: messageId },
      data: { status: 'completed', aiResponse: aiText },
    })
  },
  { connection: (queue as any).opts.connection, concurrency }
)

worker.on('failed', (job, err) => {
  console.error('worker.failed', { jobId: job?.id, err: err?.message, attemptsMade: job?.attemptsMade })
  if (job?.data?.messageId) {
    db.message
      .update({
        where: { id: job.data.messageId },
        data: { status: 'failed' },
      })
      .catch(() => {})
  }
})

worker.on('completed', (job) => {
  console.log('worker.done', { jobId: job.id })
})

console.log('message-worker started', { concurrency })

