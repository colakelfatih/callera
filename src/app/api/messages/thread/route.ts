import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sp = request.nextUrl.searchParams
    const channel = sp.get('channel')
    const senderId = sp.get('senderId')
    const connectionId = sp.get('connectionId') // may be '' or null-like
    const cursor = sp.get('cursor') // message.id
    const limit = Math.min(Number(sp.get('limit') ?? 50), 200)

    if (!channel || !senderId) {
      return NextResponse.json({ error: 'Missing channel or senderId' }, { status: 400 })
    }

    const where: any = {
      channel,
      senderId,
      connectionId: connectionId ? connectionId : null,
    }

    const rows = await db.message.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
    })

    const nextCursor = rows.length === limit ? rows[rows.length - 1]?.id ?? null : null

    return NextResponse.json({
      messages: rows,
      nextCursor,
      hasMore: nextCursor !== null,
    })
  } catch (error: any) {
    console.error('messages.thread.error', error)
    return NextResponse.json({ error: 'Failed to fetch thread messages' }, { status: 500 })
  }
}

