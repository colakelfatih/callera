// WhatsApp Business Cloud API Webhook Handler

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dedupeMessage } from '@/lib/redis/dedupe'
import { getMessageQueue } from '@/lib/queue/message-queue'
import { publishNewMessage } from '@/lib/redis/pubsub'

const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

/**
 * GET - Webhook verification (required by Meta/WhatsApp)
 * Meta expects: if mode=subscribe and verify_token matches -> respond with hub.challenge as plain text
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // Debug logging (remove in production)
    console.log('WhatsApp webhook verification request:', {
        mode,
        receivedToken: token || 'NOT PROVIDED',
        challenge,
        expectedTokenSet: !!WEBHOOK_VERIFY_TOKEN,
        tokensMatch: token === WEBHOOK_VERIFY_TOKEN,
    })

    // Check if verify token is configured
    if (!WEBHOOK_VERIFY_TOKEN) {
        console.error('WHATSAPP_WEBHOOK_VERIFY_TOKEN environment variable is not set')
        return new NextResponse('Server configuration error', { status: 500 })
    }

    // Meta webhook verification
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        console.log('WhatsApp webhook verified successfully')
        return new NextResponse(challenge ?? '', {
            status: 200,
            headers: { 'content-type': 'text/plain' },
        })
    }

    // Log failed verification attempt
    console.warn('WhatsApp webhook verification failed:', {
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

        // Log webhook payload (keep short in prod)
        console.log('whatsapp.webhook.received', { bytes: bodyText.length })

        // Parse JSON payload
        const payload = JSON.parse(bodyText)

        // Process webhook events
        // WhatsApp Business Cloud API webhook structure:
        // {
        //   "object": "whatsapp_business_account",
        //   "entry": [{
        //     "id": "...",
        //     "changes": [{
        //       "value": {
        //         "messaging_product": "whatsapp",
        //         "metadata": {...},
        //         "messages": [...],      // Incoming messages
        //         "statuses": [...]       // Message status updates
        //       }
        //     }]
        //   }]
        // }

        if (payload.object === 'whatsapp_business_account' && payload.entry) {
            for (const entry of payload.entry) {
                if (entry.changes) {
                    for (const change of entry.changes) {
                        const value = change.value

                        // Debug: Log what fields are present
                        console.log('whatsapp.webhook.structure', {
                            hasMessages: !!value.messages,
                            hasStatuses: !!value.statuses,
                            messagesCount: value.messages?.length || 0,
                            statusesCount: value.statuses?.length || 0,
                            field: change.field,
                            metadata: value.metadata,
                        })

                        // Process incoming messages
                        if (value.messages && Array.isArray(value.messages)) {
                            console.log(`Processing ${value.messages.length} incoming message(s)`)
                            for (const message of value.messages) {
                                await handleIncomingMessage(message, value.metadata, payload)
                            }
                        }

                        // Process status updates
                        if (value.statuses && Array.isArray(value.statuses)) {
                            console.log(`Processing ${value.statuses.length} status update(s)`)
                            for (const status of value.statuses) {
                                await handleStatusUpdate(status)
                            }
                        }
                    }
                }
            }
        } else {
            console.warn('Unexpected webhook payload structure:', {
                object: payload.object,
                hasEntry: !!payload.entry,
            })
        }

        // Always ACK quickly (WhatsApp requires quick response)
        return new NextResponse('OK', { status: 200 })
    } catch (error: any) {
        console.error('WhatsApp webhook error:', error)
        // Still return OK to prevent WhatsApp from retrying
        return new NextResponse('OK', { status: 200 })
    }
}

/**
 * Handle incoming WhatsApp message
 */
async function handleIncomingMessage(message: any, metadata: any, rawPayload: any) {
    try {
        const channelMessageId = message.id
        const from = message.from // Phone number (e.g., "905374872375")
        const timestamp = message.timestamp
        const type = message.type

        // Extract message text based on type
        let messageText = ''
        if (type === 'text') {
            messageText = message.text?.body || ''
        } else if (type === 'image') {
            messageText = `[Image] ${message.image?.caption || ''}`
        } else if (type === 'audio') {
            messageText = '[Audio]'
        } else if (type === 'video') {
            messageText = `[Video] ${message.video?.caption || ''}`
        } else if (type === 'document') {
            messageText = `[Document] ${message.document?.filename || ''}`
        } else {
            messageText = `[${type}]`
        }

        console.log('📨 Received WhatsApp message:', {
            channelMessageId,
            from,
            messageText,
            timestamp,
            type,
            phoneNumberId: metadata?.phone_number_id,
            displayPhoneNumber: metadata?.display_phone_number,
            fullMessage: JSON.stringify(message, null, 2), // Full message for debugging
        })

        // 1) Deduplication (Redis SETNX)
        const dedupe = await dedupeMessage({
            channel: 'whatsapp',
            channelMessageId,
            ttlSeconds: 60 * 60,
        })

        if (!dedupe.isNew) {
            console.log('Duplicate message skipped', { channelMessageId, key: dedupe.key })
            return
        }

        // 2) DB insert (upsert by channel+channelMessageId)
        const saved = await db.message.upsert({
            where: {
                channel_channelMessageId: {
                    channel: 'whatsapp',
                    channelMessageId,
                },
            },
            create: {
                channel: 'whatsapp',
                channelMessageId,
                connectionId: metadata?.phone_number_id,
                senderId: from,
                messageText,
                messageType:
                    type === 'text'
                        ? 'text'
                        : type === 'image'
                          ? 'image'
                          : type === 'audio'
                            ? 'audio'
                            : type === 'video'
                              ? 'video'
                              : type === 'document'
                                ? 'document'
                                : 'other',
                rawPayload,
                isFromBusiness: false,
                timestamp: timestamp ? new Date(Number(timestamp) * 1000) : null,
                status: 'pending',
            },
            update: {},
        })

        // 3) Queue add(job)
        const messageQueue = getMessageQueue()
        try {
            const job = await messageQueue.add(
                'process-message',
                {
                    messageId: saved.id,
                    channel: 'whatsapp',
                    channelMessageId,
                    senderId: from,
                    messageText,
                    connectionId: metadata?.phone_number_id ?? null,
                },
                {
                    // BullMQ doesn't allow ':' in jobId, use '-' instead
                    jobId: `whatsapp-${channelMessageId}`, // idempotent at queue level too
                }
            )
            console.log('✅ Job added to queue:', { jobId: job.id, messageId: saved.id })
        } catch (queueError: any) {
            console.error('❌ Failed to add job to queue:', {
                error: queueError?.message ?? queueError,
                messageId: saved.id,
                channelMessageId,
            })
            // Still continue - message is saved, can be processed manually later
        }

        // 4) Realtime publish (best-effort)
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
        console.error('Error handling incoming WhatsApp message:', error)
    }
}

/**
 * Handle WhatsApp message status update
 */
async function handleStatusUpdate(status: any) {
    try {
        console.log('WhatsApp message status update:', {
            id: status.id,
            status: status.status,
            recipientId: status.recipient_id,
            timestamp: status.timestamp,
            pricing: status.pricing,
        })

        // TODO: Update message status in database
        // You can track message delivery status here

    } catch (error: any) {
        console.error('Error handling WhatsApp status update:', error)
    }
}
