// Message Search API using Typesense

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { searchMessages } from '@/lib/typesense/messages'

export const dynamic = 'force-dynamic'

/**
 * GET - Search messages using Typesense
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const channel = searchParams.get('channel') || undefined
    const senderId = searchParams.get('senderId') || undefined
    const limit = Number(searchParams.get('limit') || '20')
    const page = Number(searchParams.get('page') || '1')

    if (!query.trim()) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const results = await searchMessages({
      query: query.trim(),
      channel,
      senderId,
      limit,
      page,
    })

    return NextResponse.json(results, { status: 200 })
  } catch (error: any) {
    console.error('Message search error:', error)
    return NextResponse.json(
      { error: 'Failed to search messages', details: error.message },
      { status: 500 }
    )
  }
}
