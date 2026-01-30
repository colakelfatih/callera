// Facebook OAuth Authorization Route
// Used to get Page Access Token for subscribing app to Facebook Page webhooks

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'

// Use INSTAGRAM_APP_ID because it's the same Meta app for both Instagram and Facebook
const FACEBOOK_APP_ID = process.env.INSTAGRAM_APP_ID
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'https://crm.remaxarsa.tr'}/api/facebook/callback`

// Facebook OAuth Scopes for Page messaging
const FACEBOOK_SCOPES = [
  'pages_show_list',
  'pages_messaging',
  'pages_read_engagement',
  'pages_manage_metadata',
  'instagram_basic',
  'instagram_manage_messages',
].join(',')

export async function GET(request: NextRequest) {
  try {
    if (!FACEBOOK_APP_ID) {
      return NextResponse.json(
        { error: 'Facebook App ID not configured' },
        { status: 500 }
      )
    }

    // Get user from session
    const user = await getCurrentUser()
    const searchParams = request.nextUrl.searchParams
    const userId = user?.id || searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Facebook OAuth URL
    const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth')
    authUrl.searchParams.set('client_id', FACEBOOK_APP_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('scope', FACEBOOK_SCOPES)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('state', userId)

    return NextResponse.redirect(authUrl.toString())
  } catch (error: any) {
    console.error('Facebook auth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Facebook auth' },
      { status: 500 }
    )
  }
}
