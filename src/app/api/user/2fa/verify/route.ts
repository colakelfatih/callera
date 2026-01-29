import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { verifySync } from 'otplib'

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    // Get user's 2FA secret
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA setup not initiated. Please set up 2FA first.' },
        { status: 400 }
      )
    }

    // Verify the TOTP code - verifySync returns { valid: boolean, ... }
    const result = verifySync({
      token: code.trim(),
      secret: user.twoFactorSecret,
    })

    console.log('2FA Verify - Code:', code.trim(), 'Secret:', user.twoFactorSecret, 'Result:', result)

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Enable 2FA
    await db.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: '2FA has been enabled successfully',
    })
  } catch (error: any) {
    console.error('2FA verify error:', error)
    return NextResponse.json(
      { error: error.message || '2FA verification failed' },
      { status: 500 }
    )
  }
}
