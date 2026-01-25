// Typesense Collection Management Scripts

import { getTypesenseClient, messageSchema, initializeTypesenseCollection } from '../lib/typesense/client'
import { bulkIndexMessages } from '../lib/typesense/messages'
import { db } from '../lib/db'

const command = process.argv[2]

async function createCollection() {
  try {
    console.log('🔄 Creating Typesense collection...')
    await initializeTypesenseCollection()
    console.log('✅ Collection created successfully!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Failed to create collection:', error.message)
    process.exit(1)
  }
}

async function deleteCollection() {
  try {
    console.log('🔄 Deleting Typesense collection...')
    const typesense = getTypesenseClient()
    await typesense.collections('messages').delete()
    console.log('✅ Collection deleted successfully!')
    process.exit(0)
  } catch (error: any) {
    if (error.httpStatus === 404) {
      console.log('ℹ️  Collection does not exist')
      process.exit(0)
    } else {
      console.error('❌ Failed to delete collection:', error.message)
      process.exit(1)
    }
  }
}

async function reindexCollection() {
  try {
    console.log('🔄 Reindexing all messages...')
    
    // First, ensure collection exists
    await initializeTypesenseCollection()
    
    // Get all messages
    const messages = await db.message.findMany({
      orderBy: { createdAt: 'desc' },
    })

    console.log(`📦 Found ${messages.length} messages to index`)

    if (messages.length === 0) {
      console.log('ℹ️  No messages to index')
      process.exit(0)
    }

    // Bulk index in batches of 1000
    const batchSize = 1000
    let totalIndexed = 0
    let totalFailed = 0

    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize)
      console.log(`📤 Indexing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(messages.length / batchSize)} (${batch.length} messages)...`)
      
      const results = await bulkIndexMessages(batch)
      totalIndexed += results.success
      totalFailed += results.failed

      if (results.errors.length > 0) {
        console.warn(`⚠️  Batch errors: ${results.errors.slice(0, 5).join(', ')}${results.errors.length > 5 ? '...' : ''}`)
      }
    }

    console.log(`✅ Reindexing complete!`)
    console.log(`   - Successfully indexed: ${totalIndexed}`)
    console.log(`   - Failed: ${totalFailed}`)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Failed to reindex collection:', error.message)
    process.exit(1)
  }
}

async function showCollectionInfo() {
  try {
    const typesense = getTypesenseClient()
    const collection = await typesense.collections('messages').retrieve()
    console.log('📊 Collection Info:')
    console.log(JSON.stringify(collection, null, 2))
    process.exit(0)
  } catch (error: any) {
    if (error.httpStatus === 404) {
      console.log('ℹ️  Collection does not exist')
      process.exit(0)
    } else {
      console.error('❌ Failed to get collection info:', error.message)
      process.exit(1)
    }
  }
}

// Main
async function main() {
  switch (command) {
    case 'create':
      await createCollection()
      break
    case 'delete':
      await deleteCollection()
      break
    case 'reindex':
      await reindexCollection()
      break
    case 'info':
      await showCollectionInfo()
      break
    default:
      console.log('Usage: npm run typesense:collection <command>')
      console.log('')
      console.log('Commands:')
      console.log('  create   - Create the messages collection')
      console.log('  delete   - Delete the messages collection')
      console.log('  reindex  - Reindex all messages from database')
      console.log('  info     - Show collection information')
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})
