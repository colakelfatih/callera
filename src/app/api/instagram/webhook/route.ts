// Instagram Messaging Webhook Handler

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { dedupeMessage } from '@/lib/redis/dedupe'
import { getMessageQueue } from '@/lib/queue/message-queue'
import { publishNewMessage } from '@/lib/redis/pubsub'
import { indexMessage } from '@/lib/typesense/messages'
import { findOrCreateContactFromInstagram } from '@/lib/contacts/contact-helpers'
import type { InstagramWebhookPayload } from '@/types/instagram'

const WEBHOOK_VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_APP_SECRET

/**
 * Verify webhook signature (for security)
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!APP_SECRET) {
    console.warn('⚠️ Instagram APP_SECRET not configured, skipping signature verification')
    return true // Skip verification if no secret configured
  }

  try {
    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', APP_SECRET)
      .update(payload)
      .digest('hex')}`

    // Use timing-safe comparison
    if (signature.length !== expectedSignature.length) {
      return false
    }

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

/**
 * GET - Webhook verification (required by Meta)
 * Meta expects: if mode=subscribe and verify_token matches -> respond with hub.challenge as plain text
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Debug logging
  console.log('Instagram webhook verification request:', {
    mode,
    receivedToken: token || 'NOT PROVIDED',
    challenge,
    expectedTokenSet: !!WEBHOOK_VERIFY_TOKEN,
    tokensMatch: token === WEBHOOK_VERIFY_TOKEN,
  })

  // Check if verify token is configured
  if (!WEBHOOK_VERIFY_TOKEN) {
    console.error('INSTAGRAM_WEBHOOK_VERIFY_TOKEN environment variable is not set')
    return new NextResponse('Server configuration error', { status: 500 })
  }

  // Meta webhook verification
  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Instagram webhook verified successfully')
    return new NextResponse(challenge ?? '', {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    })
  }

  // Log failed verification attempt
  console.warn('Instagram webhook verification failed:', {
    mode,
    tokenMatch: token === WEBHOOK_VERIFY_TOKEN,
    hasToken: !!token,
    hasExpectedToken: !!WEBHOOK_VERIFY_TOKEN,
  })

  return new NextResponse('Forbidden', { status: 403 })
}

/**
 * POST - Handle incoming webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    const signature = request.headers.get('x-hub-signature-256') || ''

    // Log full webhook payload for debugging
    console.log('📨 instagram.webhook.received', { 
      bytes: bodyText.length,
      hasSignature: !!signature,
      payload: bodyText.substring(0, 500), // First 500 chars for debugging
    })

    // Verify signature
    if (!verifySignature(bodyText, signature)) {
      console.error('❌ Invalid Instagram webhook signature', { signature })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Parse JSON payload
    let payload: any
    try {
      payload = JSON.parse(bodyText)
    } catch (parseError) {
      console.error('❌ Failed to parse webhook payload:', parseError)
      return new NextResponse('OK', { status: 200 })
    }

    console.log('📋 Instagram webhook payload parsed:', {
      object: payload.object,
      entryCount: payload.entry?.length || 0,
    })

    // Instagram Business API webhook structure:
    // {
    //   "object": "instagram",
    //   "entry": [{
    //     "id": "<INSTAGRAM_BUSINESS_ACCOUNT_ID>",
    //     "time": 1234567890,
    //     "messaging": [{
    //       "sender": { "id": "<IGSID>" },  // Instagram-scoped User ID
    //       "recipient": { "id": "<INSTAGRAM_BUSINESS_ACCOUNT_ID>" },
    //       "timestamp": 1234567890,
    //       "message": {
    //         "mid": "<MESSAGE_ID>",
    //         "text": "Hello!",
    //         "is_echo": false
    //       }
    //     }]
    //   }]
    // }

    // Process each entry - accept both "instagram" and "page" object types
    if ((payload.object === 'instagram' || payload.object === 'page') && payload.entry) {
      for (const entry of payload.entry) {
        // Debug: Log full entry structure
        console.log('📬 instagram.webhook.entry', {
          entryId: entry.id,
          time: entry.time,
          hasMessaging: !!entry.messaging,
          messagingCount: entry.messaging?.length || 0,
          hasChanges: !!entry.changes,
          changesCount: entry.changes?.length || 0,
          entryKeys: Object.keys(entry),
        })

        // Handle messaging array (Instagram Direct Messages)
        if (entry.messaging && Array.isArray(entry.messaging)) {
          console.log(`🔄 Processing ${entry.messaging.length} Instagram event(s)`)
          for (const event of entry.messaging) {
            // Determine event type
            const eventType = event.message ? 'message' 
              : event.read ? 'read_receipt'
              : event.delivery ? 'delivery'
              : event.reaction ? 'reaction'
              : event.postback ? 'postback'
              : 'unknown'

            console.log('📝 Messaging event:', {
              eventType,
              timestamp: event.timestamp,
              hasSender: !!event.sender,
              senderId: event.sender?.id,
              hasRecipient: !!event.recipient,
              recipientId: event.recipient?.id,
              hasMessage: !!event.message,
              messageId: event.message?.mid,
              isEcho: event.message?.is_echo,
              messageText: event.message?.text?.substring(0, 50),
              // For read receipts
              readMid: event.read?.mid,
              // For reactions
              reactionEmoji: event.reaction?.emoji,
            })

            // Handle different event types
            if (event.message && !event.message.is_echo) {
              // New incoming message
              await handleIncomingMessage(event, entry.id, payload)
            } else if (event.message?.is_echo) {
              // Message sent by us (echo)
              console.log('⏭️ Skipping echo message (sent by page):', event.message.mid)
            } else if (event.read) {
              // Read receipt - user has read our message
              console.log('👀 Read receipt received:', {
                mid: event.read.mid,
                timestamp: event.timestamp,
              })
            } else if (event.delivery) {
              // Delivery confirmation
              console.log('✅ Delivery confirmation:', {
                mids: event.delivery.mids,
                timestamp: event.timestamp,
              })
            } else if (event.reaction) {
              // Reaction to a message
              console.log('😀 Reaction received:', {
                mid: event.reaction.mid,
                emoji: event.reaction.emoji,
                action: event.reaction.action,
              })
            } else if (event.postback) {
              // Button click postback
              console.log('🔘 Postback received:', {
                payload: event.postback.payload,
                title: event.postback.title,
              })
            } else {
              console.log('❓ Unknown event type:', Object.keys(event))
            }
          }
        }

        // Handle changes array (alternative webhook format)
        if (entry.changes && Array.isArray(entry.changes)) {
          console.log(`🔄 Processing ${entry.changes.length} Instagram change(s)`)
          for (const change of entry.changes) {
            console.log('📝 Change event:', {
              field: change.field,
              valueKeys: change.value ? Object.keys(change.value) : [],
            })

            // Handle message changes
            if (change.field === 'messages' && change.value) {
              const value = change.value
              if (value.messaging && Array.isArray(value.messaging)) {
                for (const event of value.messaging) {
                  if (event.message && !event.message.is_echo) {
                    await handleIncomingMessage(event, entry.id, payload)
                  }
                }
              }
            }
          }
        }
      }
    } else {
      console.warn('⚠️ Unexpected Instagram webhook payload structure:', {
        object: payload.object,
        hasEntry: !!payload.entry,
        payloadKeys: Object.keys(payload),
      })
    }

    // Always ACK quickly (Meta requires quick response)
    return new NextResponse('OK', { status: 200 })
  } catch (error: any) {
    console.error('❌ Instagram webhook error:', error?.message || error, error?.stack)
    // Still return OK to prevent Meta from retrying
    return new NextResponse('OK', { status: 200 })
  }
}

/**
 * Handle incoming Instagram message
 */
async function handleIncomingMessage(event: any, entryId: string, rawPayload: any) {
  try {
    const senderId = event.sender.id  // Instagram-scoped user ID (IGSID)
    const recipientId = event.recipient?.id || entryId  // Page ID
    const messageText = event.message.text || ''
    const messageId = event.message.mid
    const timestamp = event.timestamp

    // Handle attachments (images, videos, etc.)
    let finalMessageText = messageText
    let messageType: 'text' | 'image' | 'audio' | 'video' | 'other' = 'text'
    
    if (event.message.attachments && Array.isArray(event.message.attachments)) {
      for (const attachment of event.message.attachments) {
        if (attachment.type === 'image') {
          finalMessageText = finalMessageText || `[Image] ${attachment.payload?.url || ''}`
          messageType = 'image'
        } else if (attachment.type === 'video') {
          finalMessageText = finalMessageText || `[Video] ${attachment.payload?.url || ''}`
          messageType = 'video'
        } else if (attachment.type === 'audio') {
          finalMessageText = finalMessageText || '[Audio]'
          messageType = 'audio'
        } else if (attachment.type === 'story_mention') {
          finalMessageText = finalMessageText || '[Story Mention]'
        } else if (attachment.type === 'share') {
          // Post/Reel share
          finalMessageText = finalMessageText || `[Shared Post] ${attachment.payload?.url || ''}`
        } else {
          finalMessageText = finalMessageText || `[${attachment.type}]`
          messageType = 'other'
        }
      }
    }

    console.log('📨 Received Instagram message:', {
      messageId,
      senderId,
      recipientId,
      messageText: finalMessageText,
      messageType,
      timestamp,
      hasAttachments: !!event.message.attachments,
    })

    // 1) Deduplication (Redis SETNX)
    const dedupe = await dedupeMessage({
      channel: 'instagram',
      channelMessageId: messageId,
      ttlSeconds: 60 * 60,
    })

    if (!dedupe.isNew) {
      console.log('Duplicate Instagram message skipped', { messageId, key: dedupe.key })
      return
    }

    // 2) Get InstagramConnection for this recipient
    const connection = await db.instagramConnection.findFirst({
      where: {
        OR: [
          { pageId: recipientId },
          { instagramUserId: recipientId },
        ],
      },
      select: {
        id: true,
        userId: true,
        pageId: true,
        accessToken: true,
      },
    })

    if (!connection) {
      console.warn('⚠️ No InstagramConnection found for recipient:', recipientId)
    }

    // 3) DB insert (upsert by channel+channelMessageId) to unified Message table
    const saved = await db.message.upsert({
      where: {
        channel_channelMessageId: {
          channel: 'instagram',
          channelMessageId: messageId,
        },
      },
      create: {
        channel: 'instagram',
        channelMessageId: messageId,
        connectionId: connection?.id || recipientId, // Store connection ID or recipient ID
        senderId,
        senderName: null, // Instagram doesn't always provide name in webhook
        messageText: finalMessageText,
        messageType,
        rawPayload,
        isFromBusiness: false,
        timestamp: timestamp ? new Date(Number(timestamp)) : null,
        status: 'pending',
      },
      update: {},
    })

    console.log('✅ Instagram message saved to DB:', { id: saved.id, messageId })

    // 4) Queue add(job) for AI processing
    const messageQueue = getMessageQueue()
    try {
      const job = await messageQueue.add(
        'process-message',
        {
          messageId: saved.id,
          channel: 'instagram',
          channelMessageId: messageId,
          senderId,
          messageText: finalMessageText,
          connectionId: connection?.id ?? null,
        },
        {
          jobId: `instagram-${messageId}`, // idempotent at queue level
        }
      )
      console.log('✅ Instagram job added to queue:', { jobId: job.id, messageId: saved.id })
    } catch (queueError: any) {
      console.error('❌ Failed to add Instagram job to queue:', {
        error: queueError?.message ?? queueError,
        messageId: saved.id,
      })
    }

    // 6) Create/update müşteri (contact) from Instagram message
    console.log('🔍 Checking Instagram müşteri creation conditions:', {
      hasRecipientId: !!recipientId,
      recipientId,
      hasSenderId: !!senderId,
      senderId,
    })

    if (recipientId && senderId) {
      try {
        const contact = await findOrCreateContactFromInstagram({
          instagramUserId: senderId,
          recipientId,
          username: null, // Could be fetched via Instagram API if needed
          name: null,
          timestamp: timestamp ? new Date(Number(timestamp)) : new Date(),
        })

        if (contact) {
          console.log('✅ Instagram müşteri created/updated:', {
            contactId: contact.id,
            phone: contact.phone,
            name: contact.name,
            status: contact.status,
          })
        } else {
          console.warn('⚠️ Instagram müşteri creation returned null (InstagramConnection not found?)', {
            senderId,
            recipientId,
          })
        }
      } catch (err: any) {
        console.error('❌ Failed to create/update Instagram müşteri:', {
          error: err?.message ?? err,
          stack: err?.stack,
          senderId,
          recipientId,
        })
      }
    }

    // 7) Index in Typesense (best-effort, non-blocking)
    indexMessage(saved).catch((err) => {
      console.warn('typesense.index_failed', { messageId: saved.id, err: String(err?.message ?? err) })
    })

    // 8) Realtime publish (best-effort)
    publishNewMessage({
      id: saved.id,
      channel: saved.channel,
      channelMessageId: saved.channelMessageId,
      connectionId: saved.connectionId ?? null,
      isFromBusiness: saved.isFromBusiness,
      senderId: saved.senderId,
      senderName: saved.senderName ?? null,
      messageText: saved.messageText,
      messageType: saved.messageType,
      status: saved.status,
      aiResponse: saved.aiResponse ?? null,
      timestamp: saved.timestamp ? saved.timestamp.toISOString() : null,
      createdAt: saved.createdAt.toISOString(),
    }).catch((err) => {
      console.warn('realtime.publish_failed', { messageId: saved.id, err: String(err?.message ?? err) })
    })

  } catch (error: any) {
    console.error('Error handling incoming Instagram message:', error)
  }
}
