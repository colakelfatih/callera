// Typesense Message Indexing Functions

import { getTypesenseClient } from './client'
import type { Message } from '@prisma/client'

/**
 * Index a message in Typesense
 */
export async function indexMessage(message: Message) {
  try {
    const typesense = getTypesenseClient()

    const document = {
      id: message.id,
      channel: message.channel,
      channelMessageId: message.channelMessageId,
      connectionId: message.connectionId || null,
      senderId: message.senderId,
      senderName: message.senderName || null,
      messageText: message.messageText,
      messageType: message.messageType,
      isFromBusiness: message.isFromBusiness,
      status: message.status,
      aiResponse: message.aiResponse || null,
      timestamp: message.timestamp ? Math.floor(message.timestamp.getTime() / 1000) : null,
      createdAt: Math.floor(message.createdAt.getTime() / 1000),
      updatedAt: Math.floor(message.updatedAt.getTime() / 1000),
    }

    await typesense.collections('messages').documents().upsert(document)
    console.log('✅ Message indexed in Typesense:', message.id)
  } catch (error: any) {
    // If collection doesn't exist, log warning but don't throw
    if (error.httpStatus === 404) {
      console.warn('⚠️  Typesense collection "messages" does not exist. Run: npm run typesense:create')
    } else {
      console.error('Failed to index message in Typesense:', error)
    }
    // Don't throw - indexing failures shouldn't break message processing
  }
}

/**
 * Remove a message from Typesense index
 */
export async function removeMessageFromIndex(messageId: string) {
  try {
    const typesense = getTypesenseClient()
    await typesense.collections('messages').documents(messageId).delete()
    console.log('✅ Message removed from Typesense index:', messageId)
  } catch (error: any) {
    // 404 is OK - document might not exist
    if (error.httpStatus !== 404) {
      console.error('Failed to remove message from Typesense index:', error)
    }
  }
}

/**
 * Search messages in Typesense
 */
export async function searchMessages(params: {
  query: string
  userId?: string
  channel?: string
  senderId?: string
  limit?: number
  page?: number
}) {
  try {
    const typesense = getTypesenseClient()

    const searchParameters: any = {
      q: params.query,
      query_by: 'messageText,senderName',
      per_page: params.limit || 20,
      page: params.page || 1,
      sort_by: '_text_match:desc,createdAt:desc',
    }

    // Add filters
    const filters: string[] = []
    if (params.channel) {
      filters.push(`channel:${params.channel}`)
    }
    if (params.senderId) {
      filters.push(`senderId:${params.senderId}`)
    }
    if (filters.length > 0) {
      searchParameters.filter_by = filters.join(' && ')
    }

    const searchResults = await typesense.collections('messages').documents().search(searchParameters)

    return {
      hits: searchResults.hits?.map((hit: any) => ({
        id: hit.document.id,
        channel: hit.document.channel,
        senderId: hit.document.senderId,
        senderName: hit.document.senderName,
        messageText: hit.document.messageText,
        timestamp: hit.document.timestamp ? new Date(hit.document.timestamp * 1000) : null,
        createdAt: new Date(hit.document.createdAt * 1000),
        highlights: hit.highlights,
        textMatch: hit.text_match,
      })) || [],
      found: searchResults.found || 0,
      page: searchResults.page || 1,
      totalPages: Math.ceil((searchResults.found || 0) / (params.limit || 20)),
    }
  } catch (error) {
    console.error('Typesense search error:', error)
    throw error
  }
}

/**
 * Bulk index messages (for initial indexing)
 */
export async function bulkIndexMessages(messages: Message[]) {
  try {
    const typesense = getTypesenseClient()

    const documents = messages.map((message) => ({
      id: message.id,
      channel: message.channel,
      channelMessageId: message.channelMessageId,
      connectionId: message.connectionId || null,
      senderId: message.senderId,
      senderName: message.senderName || null,
      messageText: message.messageText,
      messageType: message.messageType,
      isFromBusiness: message.isFromBusiness,
      status: message.status,
      aiResponse: message.aiResponse || null,
      timestamp: message.timestamp ? Math.floor(message.timestamp.getTime() / 1000) : null,
      createdAt: Math.floor(message.createdAt.getTime() / 1000),
      updatedAt: Math.floor(message.updatedAt.getTime() / 1000),
    }))

    // Typesense supports bulk import
    const importResults = await typesense.collections('messages').documents().import(documents, { action: 'upsert' })

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Parse import results - Typesense returns an array of ImportResponse objects
    if (Array.isArray(importResults)) {
      for (const result of importResults) {
        if (result.success) {
          results.success++
        } else {
          results.failed++
          const errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error) || 'Unknown error'
          results.errors.push(errorMsg)
        }
      }
    }

    console.log(`✅ Bulk indexed ${results.success} messages, ${results.failed} failed`)
    return results
  } catch (error) {
    console.error('Failed to bulk index messages:', error)
    throw error
  }
}
