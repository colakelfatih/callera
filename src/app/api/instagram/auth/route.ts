// Instagram OAuth Authorization Route

import { NextRequest, NextResponse } from 'next/server'

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/instagram/callback`

export async function GET(request: NextRequest) {
  try {
    if (!INSTAGRAM_APP_ID) {
      return NextResponse.json(
        { error: 'Instagram App ID not configured' },
        { status: 500 }
      )
    }

    // Get user ID from query params (in real app, get from session)
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || 'default-user-id'

    // Instagram OAuth URL
    const authUrl = new URL('https://api.instagram.com/oauth/authorize')
    authUrl.searchParams.set('client_id', INSTAGRAM_APP_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('scope', 'instagram_basic,instagram_manage_messages,pages_messaging,pages_read_engagement')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('state', userId) // Store user ID in state for callback

    return NextResponse.redirect(authUrl.toString())
  } catch (error: any) {
    console.error('Instagram auth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Instagram auth' },
      { status: 500 }
    )
  }
}

