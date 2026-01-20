// WhatsApp Business Cloud API Webhook Handler

import { NextRequest, NextResponse } from 'next/server'

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

        // Log webhook payload (good for debugging)
        console.log('WhatsApp webhook POST received:', bodyText)

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

                        // Process incoming messages
                        if (value.messages) {
                            for (const message of value.messages) {
                                await handleIncomingMessage(message, value.metadata)
                            }
                        }

                        // Process status updates
                        if (value.statuses) {
                            for (const status of value.statuses) {
                                await handleStatusUpdate(status)
                            }
                        }
                    }
                }
            }
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
async function handleIncomingMessage(message: any, metadata: any) {
    try {
        const messageId = message.id
        const from = message.from // Phone number (e.g., "905374872375")
        const messageText = message.text?.body || message.type
        const timestamp = message.timestamp

        console.log('Received WhatsApp message:', {
            messageId,
            from,
            messageText,
            timestamp,
            type: message.type,
            phoneNumberId: metadata?.phone_number_id,
        })

        // TODO: Save message to database
        // You'll need to create a WhatsAppMessage model similar to InstagramMessage
        // For now, just log it

        // TODO: Generate AI response and send reply
        // Similar to Instagram webhook implementation

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
