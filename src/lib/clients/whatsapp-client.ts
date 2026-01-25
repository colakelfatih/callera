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

/**
 * Get user profile information (name) from WhatsApp
 * Uses the Contacts API to retrieve user profile by phone number
 * Note: This only works if the user has messaged you before
 */
type WhatsAppGetProfileParams = {
  phoneNumberId: string
  accessToken: string
  phoneNumber: string // User's WhatsApp phone number (with country code, no +, e.g. "905374872375")
}

export type WhatsAppUserProfile = {
  name?: string
  profile_picture_url?: string
}

export async function getWhatsAppUserProfile(
  params: WhatsAppGetProfileParams
): Promise<WhatsAppUserProfile | null> {
  try {
    // WhatsApp Contacts API endpoint
    // Note: This endpoint may require the user to have messaged you first
    const url = `https://graph.facebook.com/v22.0/${params.phoneNumberId}/contacts/${params.phoneNumber}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await res.json().catch(() => null)
    if (!res.ok) {
      // If 404 or other error, profile might not be available
      // This is normal - profile info may only be available after user messages you
      console.warn(
        `WhatsApp get profile failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`
      )
      return null
    }

    return {
      name: json?.name || json?.profile?.name,
      profile_picture_url: json?.profile_picture_url || json?.profile?.picture_url,
    }
  } catch (error) {
    console.error('Error getting WhatsApp user profile:', error)
    return null
  }
}

/**
 * Get business catalogs from WhatsApp Business Account
 * Requires: WhatsApp Business Account ID (WABA ID) and connected catalog
 */
type WhatsAppGetCatalogsParams = {
  wabaId: string // WhatsApp Business Account ID
  accessToken: string
}

export type WhatsAppCatalogProduct = {
  id: string
  name: string
  description?: string
  image_url?: string
  price?: string
  currency?: string
  availability?: string
  url?: string
}

export type WhatsAppCatalog = {
  id: string
  name: string
  products?: WhatsAppCatalogProduct[]
}

export async function getWhatsAppCatalogs(
  params: WhatsAppGetCatalogsParams
): Promise<WhatsAppCatalog[] | null> {
  try {
    // Get catalogs from Graph API
    const url = `https://graph.facebook.com/v22.0/${params.wabaId}/owned_product_catalogs?fields=id,name`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await res.json().catch(() => null)
    if (!res.ok) {
      console.warn(
        `WhatsApp get catalogs failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`
      )
      return null
    }

    const catalogs = json?.data || []
    return catalogs.map((catalog: any) => ({
      id: catalog.id,
      name: catalog.name || catalog.id,
      products: [], // Products loaded separately
    }))
  } catch (error) {
    console.error('Error getting WhatsApp catalogs:', error)
    return null
  }
}

/**
 * Get products from a specific catalog
 */
type WhatsAppGetCatalogProductsParams = {
  catalogId: string
  accessToken: string
  limit?: number
}

export async function getWhatsAppCatalogProducts(
  params: WhatsAppGetCatalogProductsParams
): Promise<WhatsAppCatalogProduct[] | null> {
  try {
    const limit = params.limit || 50
    const url = `https://graph.facebook.com/v22.0/${params.catalogId}/products?fields=id,name,description,image_url,price,currency,availability,url&limit=${limit}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await res.json().catch(() => null)
    if (!res.ok) {
      console.warn(
        `WhatsApp get catalog products failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`
      )
      return null
    }

    const products = json?.data || []
    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image_url: p.image_url,
      price: p.price,
      currency: p.currency,
      availability: p.availability,
      url: p.url,
    }))
  } catch (error) {
    console.error('Error getting WhatsApp catalog products:', error)
    return null
  }
}

