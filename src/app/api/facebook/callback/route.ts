// Facebook OAuth Callback Route
// Gets Page Access Token and subscribes app to Facebook Page webhooks

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const FACEBOOK_APP_ID = process.env.INSTAGRAM_APP_ID
const FACEBOOK_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/facebook/callback`

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
    const errorDescription = searchParams.get('error_description')

    if (error) {
      console.error('Facebook OAuth error:', { error, errorDescription })
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
        tab: 'integrations', 
        error: errorDescription || error 
      }))
    }

    if (!code || !state) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
        tab: 'integrations', 
        error: 'missing_code_or_state' 
      }))
    }

    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
        tab: 'integrations', 
        error: 'config_error' 
      }))
    }

    // Step 1: Exchange code for user access token
    console.log('Exchanging Facebook code for token...')
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/oauth/access_token`,
      {
        params: {
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    )

    const userAccessToken = tokenResponse.data.access_token

    if (!userAccessToken) {
      console.error('Failed to get Facebook user access token')
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
        tab: 'integrations', 
        error: 'token_failed' 
      }))
    }

    console.log('Facebook user access token obtained')

    // Step 2: Get user's Facebook Pages
    console.log('Getting Facebook Pages...')
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/me/accounts`,
      {
        params: {
          access_token: userAccessToken,
          fields: 'id,name,access_token,instagram_business_account{id,username}',
        },
      }
    )

    const pages = pagesResponse.data?.data || []
    console.log(`Found ${pages.length} Facebook Pages`)

    if (pages.length === 0) {
      return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
        tab: 'integrations', 
        error: 'no_pages_found' 
      }))
    }

    // Step 3: Subscribe app to each page with an Instagram Business Account
    const { db } = await import('@/lib/db')
    let subscribedCount = 0
    let updatedConnections = 0

    for (const page of pages) {
      const pageId = page.id
      const pageName = page.name
      const pageAccessToken = page.access_token
      const instagramAccount = page.instagram_business_account

      console.log(`Processing page: ${pageName} (${pageId})`, {
        hasInstagram: !!instagramAccount,
        instagramId: instagramAccount?.id,
        instagramUsername: instagramAccount?.username,
      })

      if (!instagramAccount) {
        console.log(`Skipping page ${pageName} - no Instagram account linked`)
        continue
      }

      // Subscribe app to page webhooks
      try {
        const subscribeResponse = await axios.post(
          `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/subscribed_apps`,
          null,
          {
            params: {
              access_token: pageAccessToken,
              subscribed_fields: 'messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads',
            },
          }
        )

        console.log(`✅ Subscribed app to page ${pageName}:`, subscribeResponse.data)
        subscribedCount++
      } catch (subError: any) {
        console.error(`❌ Failed to subscribe to page ${pageName}:`, subError.response?.data || subError.message)
      }

      // Update InstagramConnection with pageId
      try {
        const updated = await db.instagramConnection.updateMany({
          where: {
            userId: state,
            instagramUserId: instagramAccount.id,
          },
          data: {
            pageId: pageId,
            updatedAt: new Date(),
          },
        })

        if (updated.count > 0) {
          console.log(`✅ Updated InstagramConnection with pageId for ${instagramAccount.username}`)
          updatedConnections++
        }
      } catch (dbError: any) {
        console.error('Failed to update InstagramConnection:', dbError.message)
      }
    }

    console.log(`Facebook auth complete: ${subscribedCount} pages subscribed, ${updatedConnections} connections updated`)

    // Redirect with success
    return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
      tab: 'integrations', 
      success: 'facebook_connected',
      pages: String(subscribedCount),
    }))

  } catch (error: any) {
    console.error('Facebook callback error:', error.response?.data || error.message || error)
    const errorMessage = error.response?.data?.error?.message || 'callback_failed'
    return NextResponse.redirect(getRedirectUrl('/dashboard/settings', { 
      tab: 'integrations', 
      error: errorMessage 
    }))
  }
}
