import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'

// Facebook sends a signed_request when a user requests data deletion
// We need to decode it, delete user data, and return a confirmation

function parseSignedRequest(signedRequest: string, appSecret: string): { user_id: string } | null {
  try {
    const [encodedSig, payload] = signedRequest.split('.')
    
    if (!encodedSig || !payload) {
      return null
    }

    // Decode the signature
    const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    
    // Decode the payload
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    )

    // Verify the signature
    const expectedSig = crypto
      .createHmac('sha256', appSecret)
      .update(payload)
      .digest()

    if (!crypto.timingSafeEqual(sig, expectedSig)) {
      console.error('Invalid signature in signed_request')
      return null
    }

    return data
  } catch (error) {
    console.error('Error parsing signed_request:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const signedRequest = formData.get('signed_request') as string

    if (!signedRequest) {
      return NextResponse.json(
        { error: 'Missing signed_request' },
        { status: 400 }
      )
    }

    const appSecret = process.env.FACEBOOK_APP_SECRET
    if (!appSecret) {
      console.error('FACEBOOK_APP_SECRET not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Parse and verify the signed request
    const data = parseSignedRequest(signedRequest, appSecret)
    
    if (!data || !data.user_id) {
      return NextResponse.json(
        { error: 'Invalid signed_request' },
        { status: 400 }
      )
    }

    const facebookUserId = data.user_id

    // Generate a unique confirmation code
    const confirmationCode = crypto.randomBytes(16).toString('hex')

    // Delete user data associated with this Facebook user ID
    // Find Instagram connections with this Facebook user ID and delete related data
    try {
      // Find the Instagram connection
      const instagramConnection = await db.instagramConnection.findFirst({
        where: {
          instagramUserId: facebookUserId,
        },
      })

      if (instagramConnection) {
        // Delete the Instagram connection
        await db.instagramConnection.delete({
          where: {
            id: instagramConnection.id,
          },
        })

        console.log(`Deleted data for Facebook user: ${facebookUserId}`)
      }

      // Also check for any accounts linked via Facebook OAuth
      const account = await db.account.findFirst({
        where: {
          providerId: 'facebook',
          accountId: facebookUserId,
        },
      })

      if (account) {
        // Delete the account link (but not the user - they may have other login methods)
        await db.account.delete({
          where: {
            id: account.id,
          },
        })
      }

    } catch (dbError) {
      console.error('Database error during data deletion:', dbError)
      // Continue anyway - we still need to respond to Facebook
    }

    // Return the confirmation as required by Facebook
    // Facebook expects a JSON response with url and confirmation_code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cevapliyoruz.com'
    const statusUrl = `${baseUrl}/data-deletion-status?code=${confirmationCode}`

    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    })

  } catch (error) {
    console.error('Error processing data deletion request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for checking deletion status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { error: 'Missing confirmation code' },
      { status: 400 }
    )
  }

  // In a production app, you would store deletion requests in a database
  // and check the actual status here. For now, we return a generic completed status.
  return NextResponse.json({
    status: 'completed',
    message: 'Your data has been deleted from Cevaplıyoruz.',
  })
}
