// User Sessions API - List and Revoke All Sessions

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { parseUserAgent } from '@/lib/session/device-parser'
import { headers } from 'next/headers'

export interface SessionResponse {
  id: string
  deviceName: string
  browser: string
  os: string
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  ipAddress: string | null
  location: string | null
  lastActiveAt: string
  createdAt: string
  isCurrent: boolean
}

/**
 * GET /api/user/sessions
 * List all active sessions for the current user
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

    // Get current session token from cookie
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie') || ''
    const currentToken = extractSessionToken(cookieHeader)

    // Fetch all active sessions for user
    const sessions = await db.session.findMany({
      where: {
        userId: session.user.id,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastActiveAt: 'desc',
      },
    })

    // Parse and format sessions
    const formattedSessions: SessionResponse[] = sessions.map((s) => {
      const deviceInfo = parseUserAgent(s.userAgent)
      return {
        id: s.id,
        deviceName: s.deviceName || deviceInfo.deviceName,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        deviceType: deviceInfo.deviceType,
        ipAddress: s.ipAddress,
        location: s.location,
        lastActiveAt: s.lastActiveAt.toISOString(),
        createdAt: s.createdAt.toISOString(),
        isCurrent: s.token === currentToken,
      }
    })

    return NextResponse.json({
      sessions: formattedSessions,
      totalCount: formattedSessions.length,
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/sessions
 * Revoke all sessions except the current one
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

    // Get current session token from cookie
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie') || ''
    const currentToken = extractSessionToken(cookieHeader)

    if (!currentToken) {
      return NextResponse.json(
        { error: 'Could not identify current session' },
        { status: 400 }
      )
    }

    // Delete all sessions except current
    const result = await db.session.deleteMany({
      where: {
        userId: session.user.id,
        token: {
          not: currentToken,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `${result.count} oturum kapatıldı`,
      revokedCount: result.count,
    })
  } catch (error) {
    console.error('Error revoking sessions:', error)
    return NextResponse.json(
      { error: 'Failed to revoke sessions' },
      { status: 500 }
    )
  }
}

/**
 * Extract session token from cookie header
 */
function extractSessionToken(cookieHeader: string): string | null {
  // BetterAuth uses 'better-auth.session_token' cookie
  const cookies = cookieHeader.split(';').map(c => c.trim())
  
  for (const cookie of cookies) {
    if (cookie.startsWith('better-auth.session_token=')) {
      return cookie.substring('better-auth.session_token='.length)
    }
  }
  
  return null
}
