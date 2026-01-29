// Instagram Business OAuth Authorization Route

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/instagram/callback`

// Instagram Business API Scopes
const INSTAGRAM_BUSINESS_SCOPES = [
  'instagram_business_basic',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
  'instagram_business_content_publish',
  'instagram_business_manage_insights',
].join(',')

export async function GET(request: NextRequest) {
  try {
    if (!INSTAGRAM_APP_ID) {
      return NextResponse.json(
        { error: 'Instagram App ID not configured' },
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

    // Instagram Business OAuth URL
    const authUrl = new URL('https://www.instagram.com/oauth/authorize')
    authUrl.searchParams.set('client_id', INSTAGRAM_APP_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('scope', INSTAGRAM_BUSINESS_SCOPES)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('force_reauth', 'true') // Force re-authentication
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

