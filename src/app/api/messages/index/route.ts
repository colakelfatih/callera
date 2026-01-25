// Initialize Typesense Collection and Bulk Index Messages

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { bulkIndexMessages } from '@/lib/typesense/messages'
import { initializeTypesenseCollection } from '@/lib/typesense/client'

export const dynamic = 'force-dynamic'

/**
 * POST - Initialize Typesense collection and optionally bulk index existing messages
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const bulkIndex = body.bulkIndex === true

    // Initialize collection
    await initializeTypesenseCollection()

    let indexedCount = 0
    if (bulkIndex) {
      // Get all messages (you might want to add pagination for large datasets)
      const messages = await db.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10000, // Limit to prevent memory issues
      })

      const results = await bulkIndexMessages(messages)
      indexedCount = results.success
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Typesense collection initialized',
        indexedCount: bulkIndex ? indexedCount : undefined,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Typesense initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize Typesense', details: error.message },
      { status: 500 }
    )
  }
}
