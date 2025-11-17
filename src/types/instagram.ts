// Instagram API Types

export interface InstagramUser {
  id: string
  username: string
  account_type: 'BUSINESS' | 'CREATOR' | 'PERSONAL'
}

export interface InstagramConnection {
  id: string
  userId: string
  instagramUserId: string
  instagramUsername: string
  accessToken: string
  tokenExpiresAt?: Date
  pageId?: string
  createdAt: Date
  updatedAt: Date
}

export interface InstagramMessage {
  id: string
  messageId: string
  connectionId: string
  senderId: string
  senderUsername?: string
  messageText: string
  isFromBusiness: boolean
  timestamp: Date
  conversationId?: string
}

export interface InstagramWebhookEntry {
  id: string
  time: number
  messaging?: Array<{
    sender: { id: string }
    recipient: { id: string }
    timestamp: number
    message?: {
      mid: string
      text: string
      is_echo?: boolean
    }
  }>
}

export interface InstagramWebhookPayload {
  object: string
  entry: InstagramWebhookEntry[]
}

export interface SendMessageRequest {
  instagramUserId: string
  message: string
  connectionId: string
}

export interface AIResponseRequest {
  message: string
  context?: {
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
    contactInfo?: {
      name?: string
      previousMessages?: number
    }
  }
}

export interface AIResponse {
  response: string
  confidence?: number
  model?: string
}

