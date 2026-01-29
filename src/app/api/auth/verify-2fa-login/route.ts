import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySync } from 'otplib'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, code } = body

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID and verification code are required' },
        { status: 400 }
      )
    }

    // Get user's 2FA info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA is not enabled for this user' },
        { status: 400 }
      )
    }

    // Verify the TOTP code - verifySync returns { valid: boolean, ... }
    const result = verifySync({
      token: code.trim(),
      secret: user.twoFactorSecret,
    })

    console.log('2FA Login Verify - Code:', code.trim(), 'Result:', result)

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // 2FA verified - return success
    // The client will then complete the login
    return NextResponse.json({
      success: true,
      verified: true,
      message: '2FA verification successful',
    })
  } catch (error: any) {
    console.error('2FA login verify error:', error)
    return NextResponse.json(
      { error: error.message || '2FA verification failed' },
      { status: 500 }
    )
  }
}
