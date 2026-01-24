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
  action: 'typing' | 'read'
}

export async function sendWhatsAppTextMessage(params: WhatsAppSendTextParams) {
  const url = `https://graph.facebook.com/v22.0/${params.phoneNumberId}/messages`

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
      to: params.to,
      typing: {
        action: params.action, // 'typing' to show typing indicator, 'read' to mark as read
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

