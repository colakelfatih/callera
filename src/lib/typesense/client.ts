// Typesense Client for Message Search

import Typesense, { Client } from 'typesense'

let client: Client | null = null

export function getTypesenseClient(): Client {
  if (client) {
    return client
  }

  const apiKey = process.env.TYPESENSE_API_KEY
  const nodes = process.env.TYPESENSE_NODES || 'http://localhost:8108'
  const connectionTimeoutSeconds = Number(process.env.TYPESENSE_CONNECTION_TIMEOUT_SECONDS || 2)

  if (!apiKey) {
    throw new Error('TYPESENSE_API_KEY is not set')
  }

  // Parse nodes - can be comma-separated or single URL
  const nodeConfigs = nodes.split(',').map((node) => {
    const url = new URL(node.trim())
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 8108,
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
    }
  })

  client = new Typesense.Client({
    nodes: nodeConfigs,
    apiKey,
    connectionTimeoutSeconds,
  })

  return client
}

// Message document schema for Typesense
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'

export const messageSchema: CollectionCreateSchema = {
  name: 'messages',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'channel', type: 'string', facet: true },
    { name: 'channelMessageId', type: 'string' },
    { name: 'connectionId', type: 'string', optional: true },
    { name: 'senderId', type: 'string', facet: true },
    { name: 'senderName', type: 'string', optional: true },
    { name: 'messageText', type: 'string' }, // Main searchable field
    { name: 'messageType', type: 'string', facet: true },
    { name: 'isFromBusiness', type: 'bool', facet: true },
    { name: 'status', type: 'string', facet: true },
    { name: 'aiResponse', type: 'string', optional: true },
    { name: 'timestamp', type: 'int64', optional: true }, // Unix timestamp
    { name: 'createdAt', type: 'int64' }, // Unix timestamp
    { name: 'updatedAt', type: 'int64' }, // Unix timestamp
  ],
  default_sorting_field: 'createdAt',
}

/**
 * Initialize Typesense collection (create if doesn't exist)
 */
export async function initializeTypesenseCollection() {
  try {
    const typesense = getTypesenseClient()

    // Check if collection exists
    try {
      await typesense.collections('messages').retrieve()
      console.log('Typesense collection "messages" already exists')
    } catch (error: any) {
      // Collection doesn't exist, create it
      if (error.httpStatus === 404) {
        await typesense.collections().create(messageSchema)
        console.log('Typesense collection "messages" created successfully')
      } else {
        throw error
      }
    }
  } catch (error) {
    console.error('Failed to initialize Typesense collection:', error)
    throw error
  }
}
