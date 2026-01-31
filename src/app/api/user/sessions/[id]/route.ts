// Individual Session API - Revoke specific session

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { headers } from 'next/headers'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * DELETE /api/user/sessions/[id]
 * Revoke a specific session by ID
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    const { id: sessionId } = await params
    
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

    // Find the session to delete
    const targetSession = await db.session.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    })

    if (!targetSession) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 404 }
      )
    }

    // Check if trying to delete current session
    if (targetSession.token === currentToken) {
      return NextResponse.json(
        { error: 'Mevcut oturumunuzu buradan kapatamazsınız. Çıkış yaparak kapatabilirsiniz.' },
        { status: 400 }
      )
    }

    // Delete the session
    await db.session.delete({
      where: {
        id: sessionId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Oturum başarıyla kapatıldı',
    })
  } catch (error) {
    console.error('Error revoking session:', error)
    return NextResponse.json(
      { error: 'Failed to revoke session' },
      { status: 500 }
    )
  }
}

/**
 * Extract session token from cookie header
 */
function extractSessionToken(cookieHeader: string): string | null {
  const cookies = cookieHeader.split(';').map(c => c.trim())
  
  for (const cookie of cookies) {
    if (cookie.startsWith('better-auth.session_token=')) {
      return cookie.substring('better-auth.session_token='.length)
    }
  }
  
  return null
}
