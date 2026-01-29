import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// This endpoint just checks if user has 2FA enabled - no password verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email only
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        requires2FA: false,
      })
    }

    return NextResponse.json({
      requires2FA: user.twoFactorEnabled,
      userId: user.twoFactorEnabled ? user.id : undefined,
    })
  } catch (error: any) {
    console.error('Check 2FA error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check 2FA status' },
      { status: 500 }
    )
  }
}
