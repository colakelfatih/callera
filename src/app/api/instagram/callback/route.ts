// Instagram OAuth Callback Route

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { InstagramClient } from '@/lib/instagram/client'

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/instagram/callback`

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') // User ID
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?error=${error}`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?error=no_code`
      )
    }

    if (!state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?error=no_state`
      )
    }

    if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?error=config_error`
      )
    }

    // Exchange authorization code for short-lived access token
    const tokenResponse = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      {
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }
    )

    const { access_token, user_id } = tokenResponse.data

    if (!access_token || !user_id) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?error=invalid_token_response`
      )
    }

    // Exchange short-lived token for long-lived token
    const client = new InstagramClient(access_token)
    const longLivedToken = await client.exchangeToken(
      access_token,
      INSTAGRAM_APP_SECRET
    )

    // Get user info
    const userClient = new InstagramClient(longLivedToken)
    const userInfo = await userClient.getUserInfo()

    if (!userInfo?.username) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?error=user_info_failed`
      )
    }

    // Save to database using Prisma
    const { db } = await import('@/lib/db')
    await db.instagramConnection.upsert({
      where: {
        userId_instagramUserId: {
          userId: state,
          instagramUserId: user_id,
        },
      },
      create: {
        userId: state,
        instagramUserId: user_id,
        instagramUsername: userInfo.username,
        accessToken: longLivedToken,
        tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      update: {
        instagramUsername: userInfo.username,
        accessToken: longLivedToken,
        tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    })

    // Redirect to integrations page with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?success=true&username=${userInfo.username}`
    )
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Instagram callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tr/dashboard/integrations?error=callback_failed`
    )
  }
}

