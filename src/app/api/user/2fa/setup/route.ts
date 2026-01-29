import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { generateSecret, generateURI } from 'otplib'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if 2FA is already enabled
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 }
      )
    }

    // Generate a new secret
    const secret = generateSecret()
    
    // Create the OTP Auth URL for the authenticator app
    const otpAuthUrl = generateURI({
      issuer: 'Callera',
      label: user.email,
      secret: secret,
      algorithm: 'sha1',
      digits: 6,
      period: 30,
    })

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    // Store the secret temporarily (not enabled yet)
    await db.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret,
        // Don't enable 2FA yet - user needs to verify first
      },
    })

    return NextResponse.json({
      secret,
      qrCode: qrCodeDataUrl,
      otpAuthUrl,
    })
  } catch (error: any) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: error.message || '2FA setup failed' },
      { status: 500 }
    )
  }
}
