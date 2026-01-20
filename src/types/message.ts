export type MessageChannel = 'whatsapp' | 'instagram' | 'facebook_dm'
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'
export type MessageProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface MessageJob {
  messageId: string
  channel: MessageChannel
  channelMessageId: string
  senderId: string
  messageText: string
  connectionId: string | null
}

