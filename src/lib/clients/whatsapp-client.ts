type WhatsAppSendTextParams = {
  phoneNumberId: string
  accessToken: string
  to: string
  text: string
}

type WhatsAppTypingParams = {
  phoneNumberId: string
  accessToken: string
  to: string
  messageId: string // WhatsApp message ID from the webhook
}

export async function sendWhatsAppTextMessage(params: WhatsAppSendTextParams) {
  const url = `https://graph.facebook.com/v22.0/${params.phoneNumberId}/messages`

  // Log message being sent to WhatsApp for debugging
  console.log('📱 Sending to WhatsApp:', {
    to: params.to,
    textLength: params.text.length,
    textPreview: params.text.substring(0, 200),
    hasNewlines: params.text.includes('\n'),
    hasCarriageReturns: params.text.includes('\r'),
    rawText: params.text, // Full text to see formatting
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'text',
      text: {
        body: params.text,
      },
    }),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(
      `WhatsApp send failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`
    )
  }

  return json
}

/**
 * Send typing indicator to show "yazıyor..." in WhatsApp
 * The indicator automatically dismisses after 25 seconds or when you send a message
 * @param params - Typing indicator parameters
 */
export async function sendWhatsAppTypingIndicator(params: WhatsAppTypingParams) {
  const url = `https://graph.facebook.com/v22.0/${params.phoneNumberId}/messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read', // Required: marks message as read and shows typing indicator
      message_id: params.messageId,
      typing_indicator: {
        type: 'text',
      },
    }),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    // Don't throw error for typing indicator - it's not critical
    console.warn(
      `WhatsApp typing indicator failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`
    )
    return null
  }

  return json
}

