import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's 2FA status
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      enabled: user.twoFactorEnabled,
    })
  } catch (error: any) {
    console.error('2FA status error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get 2FA status' },
      { status: 500 }
    )
  }
}
