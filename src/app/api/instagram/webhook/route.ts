// Instagram Webhook Handler

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { generateAIResponse } from '@/lib/ai/response-generator'
import { InstagramClient } from '@/lib/instagram/client'
import type { InstagramWebhookPayload } from '@/types/instagram'
import { db } from '@/lib/db'

const WEBHOOK_VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'your_verify_token'
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET

/**
 * Verify webhook signature (for security)
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!APP_SECRET) return true // Skip verification if no secret configured

  const expectedSignature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  )
}

/**
 * GET - Webhook verification (required by Meta)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/**
 * POST - Handle webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256') || ''

    // Verify signature
    if (!verifySignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const payload: InstagramWebhookPayload = JSON.parse(body)

    // Process each entry
    for (const entry of payload.entry) {
      if (entry.messaging) {
        for (const event of entry.messaging) {
          // Only process incoming messages (not sent by us)
          if (event.message && !event.message.is_echo) {
            await handleIncomingMessage(event)
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle incoming Instagram message
 */
async function handleIncomingMessage(event: any) {
  try {
    const senderId = event.sender.id
    const messageText = event.message.text
    const messageId = event.message.mid

    console.log('Received Instagram message:', {
      senderId,
      messageText,
      messageId,
    })

    // Get connection from database
    // recipientId is the page ID that received the message
    const recipientId = event.recipient?.id
    
    const connection = await db.instagramConnection.findFirst({
      where: {
        OR: [
          { pageId: recipientId },
          { instagramUserId: recipientId },
        ],
      },
    })

    if (!connection) {
      console.error('No connection found for recipient:', recipientId)
      return
    }

    // Generate AI response
    const aiResponse = await generateAIResponse({
      message: messageText,
      context: {
        contactInfo: {
          name: senderId,
        },
      },
    })

    // Save message to database
    const savedMessage = await db.instagramMessage.upsert({
      where: {
        instagramMessageId: messageId,
      },
      create: {
        connectionId: connection.id,
        instagramMessageId: messageId,
        senderId,
        senderUsername: undefined, // Could be fetched from Instagram API
        messageText,
        isFromBusiness: false,
      },
      update: {},
    })

    // Send response via Instagram API
    const client = new InstagramClient(connection.accessToken)
    const pageId = connection.pageId || process.env.INSTAGRAM_PAGE_ID || ''
    
    if (pageId) {
      await client.sendMessage(pageId, senderId, aiResponse.response)
      console.log('Sent AI response to Instagram user:', senderId)
    }

    // Save AI response to database
    await db.aIResponse.create({
      data: {
        instagramMessageId: savedMessage.id,
        originalMessage: messageText,
        aiResponse: aiResponse.response,
        modelUsed: aiResponse.model,
        confidence: aiResponse.confidence,
      },
    })
  } catch (error: any) {
    console.error('Error handling incoming message:', error)
  }
}

