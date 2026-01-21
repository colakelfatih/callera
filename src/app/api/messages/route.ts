import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const channel = searchParams.get('channel') // 'all', 'whatsapp', 'instagram', etc.
    const limit = Number(searchParams.get('limit') || '50')
    const offset = Number(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      isFromBusiness: false, // Only incoming messages
    }

    if (channel && channel !== 'all') {
      where.channel = channel
    }

    // Fetch messages
    const [messages, total] = await Promise.all([
      db.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.message.count({ where }),
    ])

    return NextResponse.json({
      messages,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
