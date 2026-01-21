import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { sendWhatsAppTextMessage } from '@/lib/clients/whatsapp-client'
import { publishNewMessage } from '@/lib/redis/pubsub'

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

    if (channel !== 'whatsapp') {
      return NextResponse.json({ error: 'Channel not supported yet' }, { status: 400 })
    }

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

    const outbound = await db.message.create({
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
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

