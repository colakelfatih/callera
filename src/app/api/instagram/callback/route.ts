// Instagram Business OAuth Callback Route

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/instagram/callback`

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const DEFAULT_LOCALE = 'tr'
const GRAPH_API_VERSION = 'v21.0'

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
    const errorReason = searchParams.get('error_reason')
    const errorDescription = searchParams.get('error_description')

    if (error) {
      console.error('Instagram OAuth error:', { error, errorReason, errorDescription })
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: errorDescription || error }))
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

    // Step 1: Exchange authorization code for short-lived access token
    // Instagram Business API uses Graph API endpoint
    const tokenUrl = `https://graph.instagram.com/oauth/access_token`
    const tokenParams = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code,
    })

    console.log('Exchanging code for token...')
    const tokenResponse = await axios.post(tokenUrl, tokenParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const { access_token: shortLivedToken, user_id: instagramUserId } = tokenResponse.data

    if (!shortLivedToken || !instagramUserId) {
      console.error('Invalid token response:', tokenResponse.data)
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'invalid_token_response' }))
    }

    console.log('Short-lived token obtained for user:', instagramUserId)

    // Step 2: Exchange short-lived token for long-lived token (60 days)
    const longLivedUrl = `https://graph.instagram.com/access_token`
    const longLivedResponse = await axios.get(longLivedUrl, {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: INSTAGRAM_APP_SECRET,
        access_token: shortLivedToken,
      },
    })

    const { access_token: longLivedToken, expires_in } = longLivedResponse.data

    if (!longLivedToken) {
      console.error('Failed to get long-lived token:', longLivedResponse.data)
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: 'long_lived_token_failed' }))
    }

    console.log('Long-lived token obtained, expires in:', expires_in, 'seconds')

    // Step 3: Get Instagram user info
    const userInfoUrl = `https://graph.instagram.com/${GRAPH_API_VERSION}/me`
    const userInfoResponse = await axios.get(userInfoUrl, {
      params: {
        fields: 'id,username,account_type,name',
        access_token: longLivedToken,
      },
    })

    const userInfo = userInfoResponse.data
    const username = userInfo.username || userInfo.name || instagramUserId

    console.log('Instagram user info:', { id: userInfo.id, username, accountType: userInfo.account_type })

    // Step 4: Save to database
    const { db } = await import('@/lib/db')
    
    await db.instagramConnection.upsert({
      where: {
        userId_instagramUserId: {
          userId: state,
          instagramUserId: String(instagramUserId),
        },
      },
      create: {
        userId: state,
        instagramUserId: String(instagramUserId),
        instagramUsername: username,
        accessToken: longLivedToken,
        tokenExpiresAt: new Date(Date.now() + (expires_in || 5184000) * 1000), // Default 60 days
      },
      update: {
        instagramUsername: username,
        accessToken: longLivedToken,
        tokenExpiresAt: new Date(Date.now() + (expires_in || 5184000) * 1000),
        updatedAt: new Date(),
      },
    })

    console.log('Instagram connection saved for user:', state, 'instagram:', username)

    // Redirect to settings page with success
    return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
      tab: 'integrations', 
      success: 'true', 
      username,
    }))
  } catch (error: any) {
    console.error('Instagram callback error:', error.response?.data || error.message || error)
    const errorMessage = error.response?.data?.error?.message || 'callback_failed'
    return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { tab: 'integrations', error: errorMessage }))
  }
}

