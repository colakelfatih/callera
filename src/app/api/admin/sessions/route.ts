// Admin Sessions API - View and manage all user sessions

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { parseUserAgent } from '@/lib/session/device-parser'

/**
 * GET /api/admin/sessions
 * List all active sessions (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get query params for pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId')
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      expiresAt: {
        gt: new Date(),
      },
    }

    if (userId) {
      whereClause.userId = userId
    }

    // Fetch sessions with user info
    const [sessions, totalCount] = await Promise.all([
      db.session.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
        },
        orderBy: {
          lastActiveAt: 'desc',
        },
        skip,
        take: limit,
      }),
      db.session.count({ where: whereClause }),
    ])

    // Format sessions
    const formattedSessions = sessions.map((s) => {
      const deviceInfo = parseUserAgent(s.userAgent)
      return {
        id: s.id,
        userId: s.userId,
        user: s.user,
        deviceName: s.deviceName || deviceInfo.deviceName,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        deviceType: deviceInfo.deviceType,
        ipAddress: s.ipAddress,
        location: s.location,
        lastActiveAt: s.lastActiveAt.toISOString(),
        createdAt: s.createdAt.toISOString(),
        expiresAt: s.expiresAt.toISOString(),
      }
    })

    return NextResponse.json({
      sessions: formattedSessions,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    })
  } catch (error) {
    console.error('Error fetching admin sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/sessions
 * Revoke sessions for a specific user (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const admin = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (admin?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sessionId, userId, revokeAll } = body

    if (revokeAll && userId) {
      // Revoke all sessions for a specific user
      const result = await db.session.deleteMany({
        where: {
          userId,
        },
      })

      return NextResponse.json({
        success: true,
        message: `${result.count} oturum kapatıldı`,
        revokedCount: result.count,
      })
    }

    if (sessionId) {
      // Revoke a specific session
      const targetSession = await db.session.findUnique({
        where: { id: sessionId },
      })

      if (!targetSession) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }

      await db.session.delete({
        where: { id: sessionId },
      })

      return NextResponse.json({
        success: true,
        message: 'Oturum başarıyla kapatıldı',
      })
    }

    return NextResponse.json(
      { error: 'Missing sessionId or userId with revokeAll' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error revoking admin sessions:', error)
    return NextResponse.json(
      { error: 'Failed to revoke sessions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/sessions
 * Cleanup all inactive sessions system-wide (admin only)
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

    // Check if user is admin
    const admin = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (admin?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const inactiveHours = body.inactiveHours || 168 // Default 7 days

    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - inactiveHours)

    // Delete all expired and inactive sessions
    const result = await db.session.deleteMany({
      where: {
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
