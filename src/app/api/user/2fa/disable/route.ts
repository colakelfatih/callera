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
        { error: 'Verification code is required to disable 2FA' },
        { status: 400 }
      )
    }

    // Get user's 2FA info
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

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      )
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA secret not found' },
        { status: 400 }
      )
    }

    // Verify the TOTP code before disabling - verifySync returns { valid: boolean, ... }
    const result = verifySync({
      token: code.trim(),
      secret: user.twoFactorSecret,
    })

    console.log('2FA Disable - Code:', code.trim(), 'Secret:', user.twoFactorSecret, 'Result:', result)

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Disable 2FA and remove secret
    await db.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: '2FA has been disabled successfully',
    })
  } catch (error: any) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}
