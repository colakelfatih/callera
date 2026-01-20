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

  if (mode === 'subscribe' && token && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified')
    return new NextResponse(challenge ?? '', {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    })
  }

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

    // Process webhook events here
    // WhatsApp Business Cloud API webhook structure:
    // {
    //   "object": "whatsapp_business_account",
    //   "entry": [{
    //     "id": "...",
    //     "changes": [{
    //       "value": {
    //         "messaging_product": "whatsapp",
    //         "metadata": {...},
    //         "messages": [...]
    //       }
    //     }]
    //   }]
    // }

    // TODO: Process incoming messages
    // You can add message handling logic here similar to Instagram webhook

    // Always ACK quickly (WhatsApp requires quick response)
    return new NextResponse('OK', { status: 200 })
  } catch (error: any) {
    console.error('WhatsApp webhook error:', error)
    // Still return OK to prevent WhatsApp from retrying
    return new NextResponse('OK', { status: 200 })
  }
}
