type WhatsAppSendTextParams = {
  phoneNumberId: string
  accessToken: string
  to: string
  text: string
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

