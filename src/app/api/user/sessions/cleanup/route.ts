// Session Cleanup API - Remove expired and inactive sessions

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'

/**
 * POST /api/user/sessions/cleanup
 * Clean up expired and inactive sessions for the current user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get inactive hours from request body (default: 7 days = 168 hours)
    const body = await request.json().catch(() => ({}))
    const inactiveHours = body.inactiveHours || 168

    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - inactiveHours)

    // Delete expired and inactive sessions
    const result = await db.session.deleteMany({
      where: {
        userId: session.user.id,
        OR: [
          { expiresAt: { lt: new Date() } },
          { lastActiveAt: { lt: cutoffDate } },
        ],
      },
    })

    return NextResponse.json({
      success: true,
      message: `${result.count} eski oturum temizlendi`,
      cleanedCount: result.count,
    })
  } catch (error) {
    console.error('Error cleaning up sessions:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup sessions' },
      { status: 500 }
    )
  }
}
