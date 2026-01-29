// Instagram OAuth Callback Route

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { InstagramClient } from '@/lib/instagram/client'

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/instagram/callback`

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const DEFAULT_LOCALE = 'tr'

function getRedirectUrl(path: string, params?: Record<string, string>) {
  const url = new URL(`${BASE_URL}/${DEFAULT_LOCALE}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') // User ID
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error }))
    }

    if (!code) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'no_code' }))
    }

    if (!state) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'no_state' }))
    }

    if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'config_error' }))
    }

    // Exchange authorization code for short-lived access token
    // Instagram API requires form-urlencoded data
    const formData = new URLSearchParams()
    formData.append('client_id', INSTAGRAM_APP_ID)
    formData.append('client_secret', INSTAGRAM_APP_SECRET)
    formData.append('grant_type', 'authorization_code')
    formData.append('redirect_uri', REDIRECT_URI)
    formData.append('code', code)

    const tokenResponse = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token, user_id } = tokenResponse.data

    if (!access_token || !user_id) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'invalid_token_response' }))
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
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'user_info_failed' }))
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

    // Redirect to settings page with success
    return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
      tab: 'integrations', 
      success: 'true', 
      username: userInfo.username 
    }))
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Instagram callback error:', error)
    return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'callback_failed' }))
  }
}

