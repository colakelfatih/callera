import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { sendWhatsAppTextMessage } from '@/lib/clients/whatsapp-client'
import { InstagramClient } from '@/lib/instagram/client'
import { publishNewMessage } from '@/lib/redis/pubsub'
import { indexMessage } from '@/lib/typesense/messages'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const channel = body?.channel as string | undefined
    const senderId = body?.senderId as string | undefined
    const connectionId = (body?.connectionId as string | null | undefined) ?? null
    const text = (body?.text as string | undefined)?.trim()

    if (!channel || !senderId || !text) {
      return NextResponse.json({ error: 'Missing channel, senderId, or text' }, { status: 400 })
    }

    if (channel !== 'whatsapp' && channel !== 'instagram') {
      return NextResponse.json({ error: 'Channel not supported. Supported: whatsapp, instagram' }, { status: 400 })
    }

    let outbound

    if (channel === 'whatsapp') {
      // WhatsApp message sending
      const phoneNumberId = connectionId || process.env.WHATSAPP_PHONE_NUMBER_ID
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
      if (!phoneNumberId) return NextResponse.json({ error: 'Missing WhatsApp phoneNumberId' }, { status: 400 })
      if (!accessToken) return NextResponse.json({ error: 'Missing WHATSAPP_ACCESS_TOKEN' }, { status: 500 })

      const sendResult = await sendWhatsAppTextMessage({
        phoneNumberId,
        accessToken,
        to: senderId,
        text,
      })

      const outboundChannelMessageId = sendResult?.messages?.[0]?.id ?? `out-${Date.now()}`

      outbound = await db.message.create({
        data: {
          channel: 'whatsapp',
          channelMessageId: outboundChannelMessageId,
          connectionId: phoneNumberId,
          senderId,
          senderName: null,
          messageText: text,
          messageType: 'text',
          rawPayload: sendResult ?? undefined,
          isFromBusiness: true,
          timestamp: new Date(),
          status: 'completed',
        },
      })
    } else if (channel === 'instagram') {
      // Instagram message sending
      // Find the Instagram connection to get access token and page ID
      const instagramConnection = await db.instagramConnection.findFirst({
        where: connectionId 
          ? { id: connectionId, userId: user.id }
          : { userId: user.id },
        select: {
          id: true,
          accessToken: true,
          pageId: true,
          instagramUserId: true,
        },
      })

      if (!instagramConnection) {
        return NextResponse.json({ error: 'No Instagram connection found. Please connect your Instagram account first.' }, { status: 400 })
      }

      if (!instagramConnection.accessToken) {
        return NextResponse.json({ error: 'Instagram access token not found. Please reconnect your Instagram account.' }, { status: 400 })
      }

      if (!instagramConnection.pageId) {
        return NextResponse.json({ error: 'Instagram page ID not found. Please reconnect your Instagram account.' }, { status: 400 })
      }

      // Send message via Instagram API
      const client = new InstagramClient(instagramConnection.accessToken)
      const sendResult = await client.sendMessage(
        instagramConnection.pageId,
        senderId,
        text
      )

      const outboundChannelMessageId = sendResult?.message_id ?? `out-ig-${Date.now()}`

      outbound = await db.message.create({
        data: {
          channel: 'instagram',
          channelMessageId: outboundChannelMessageId,
          connectionId: instagramConnection.id,
          senderId,
          senderName: null,
          messageText: text,
          messageType: 'text',
          rawPayload: sendResult ?? undefined,
          isFromBusiness: true,
          timestamp: new Date(),
          status: 'completed',
        },
      })

      console.log('✅ Instagram message sent:', {
        messageId: outbound.id,
        senderId,
        connectionId: instagramConnection.id,
      })
    }

    if (!outbound) {
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    // Index message in Typesense
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

    return NextResponse.json({ message: outbound }, { status: 200 })
  } catch (error: any) {
    console.error('messages.send.error', error)
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 })
  }
}

