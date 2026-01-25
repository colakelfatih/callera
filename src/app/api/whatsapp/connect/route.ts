// WhatsApp Business Account Connection API
// Exchanges Facebook login code for access token and saves WABA/Phone IDs

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST - Exchange Facebook login code for access token and save WhatsApp connection
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code, wabaId, phoneNumberId, phoneNumber } = body

    if (!code && !wabaId) {
      return NextResponse.json(
        { error: 'Code or WABA ID is required' },
        { status: 400 }
      )
    }

    let accessToken: string | null = null
    let finalWabaId: string | null = null
    let finalPhoneNumberId: string | null = null
    let finalPhoneNumber: string | null = phoneNumber || null

    // If code is provided, exchange it for access token
    if (code) {
      const appId = process.env.FACEBOOK_APP_ID
      const appSecret = process.env.FACEBOOK_APP_SECRET
      const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/connect`

      if (!appId || !appSecret) {
        return NextResponse.json(
          { error: 'Facebook App ID and Secret must be configured' },
          { status: 500 }
        )
      }

      // Exchange code for short-lived access token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v24.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${code}`,
        {
          method: 'GET',
        }
      )

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok || !tokenData.access_token) {
        console.error('Token exchange failed:', tokenData)
        return NextResponse.json(
          { error: 'Failed to exchange code for access token', details: tokenData },
          { status: 400 }
        )
      }

      accessToken = tokenData.access_token

      // Get long-lived token (optional, but recommended)
      const longLivedResponse = await fetch(
        `https://graph.facebook.com/v24.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${accessToken}`,
        {
          method: 'GET',
        }
      )

      const longLivedData = await longLivedResponse.json()
      if (longLivedResponse.ok && longLivedData.access_token) {
        accessToken = longLivedData.access_token
      }

      // Get WABA ID from token (if not provided)
      if (!wabaId) {
        const wabaResponse = await fetch(
          `https://graph.facebook.com/v24.0/me/businesses?access_token=${accessToken}`,
          {
            method: 'GET',
          }
        )

        const wabaData = await wabaResponse.json()
        if (wabaResponse.ok && wabaData.data && wabaData.data.length > 0) {
          finalWabaId = wabaData.data[0].id
        }
      } else {
        finalWabaId = wabaId
      }

      // Get Phone Number ID (if not provided)
      if (!phoneNumberId && finalWabaId) {
        const phoneResponse = await fetch(
          `https://graph.facebook.com/v24.0/${finalWabaId}/phone_numbers?access_token=${accessToken}`,
          {
            method: 'GET',
          }
        )

        const phoneData = await phoneResponse.json()
        if (phoneResponse.ok && phoneData.data && phoneData.data.length > 0) {
          finalPhoneNumberId = phoneData.data[0].id
          finalPhoneNumber = phoneData.data[0].display_phone_number || null
        }
      } else {
        finalPhoneNumberId = phoneNumberId
      }
    } else {
      // Direct connection with provided IDs
      finalWabaId = wabaId
      finalPhoneNumberId = phoneNumberId

      // Access token should be provided separately or retrieved from existing connection
      return NextResponse.json(
        { error: 'Access token is required when providing WABA ID directly' },
        { status: 400 }
      )
    }

    if (!finalWabaId || !finalPhoneNumberId || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required information: WABA ID, Phone Number ID, or Access Token' },
        { status: 400 }
      )
    }

    // Save or update WhatsApp connection
    const connection = await db.whatsAppConnection.upsert({
      where: {
        userId_wabaId: {
          userId: user.id,
          wabaId: finalWabaId,
        } as any,
      },
      create: {
        userId: user.id,
        wabaId: finalWabaId,
        phoneNumberId: finalPhoneNumberId,
        phoneNumber: finalPhoneNumber,
        accessToken: accessToken,
        tokenExpiresAt: null, // Long-lived tokens don't expire, but you should refresh periodically
      },
      update: {
        phoneNumberId: finalPhoneNumberId,
        phoneNumber: finalPhoneNumber,
        accessToken: accessToken,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        connection: {
          id: connection.id,
          wabaId: connection.wabaId,
          phoneNumberId: connection.phoneNumberId,
          phoneNumber: connection.phoneNumber,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('WhatsApp connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect WhatsApp Business account', details: error.message },
      { status: 500 }
    )
  }
}
