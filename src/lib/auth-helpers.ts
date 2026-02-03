// Auth Helper Functions

import { auth } from './auth'
import { headers } from 'next/headers'
import { db } from './db'
import { parseUserAgent } from './session/device-parser'

/**
 * Get current session on server side
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Get current user on server side
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

/**
 * Update session activity timestamp and device info
 * Call this on important API routes to track session activity
 */
export async function updateSessionActivity() {
  try {
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie') || ''
    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || null

    // Extract session token
    const cookies = cookieHeader.split(';').map(c => c.trim())
    let sessionToken: string | null = null
    
    for (const cookie of cookies) {
      if (cookie.startsWith('better-auth.session_token=')) {
        sessionToken = cookie.substring('better-auth.session_token='.length)
        break
      }
    }

    if (!sessionToken) return

    // Parse device info
    const deviceInfo = parseUserAgent(userAgent)

    // Update session with last activity
    await db.session.updateMany({
      where: {
        token: sessionToken,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        lastActiveAt: new Date(),
        deviceName: deviceInfo.deviceName,
        ipAddress: ipAddress,
        userAgent: userAgent,
      },
    })
  } catch (error) {
    // Silent fail - don't break the request if session update fails
    console.error('Error updating session activity:', error)
  }
}

/**
 * Clean up expired and inactive sessions for a user
 * Deletes sessions that have been inactive for more than the specified hours
 */
export async function cleanupInactiveSessions(userId: string, inactiveHours: number = 168) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - inactiveHours)

    const result = await db.session.deleteMany({
      where: {
        userId,
        OR: [
          { expiresAt: { lt: new Date() } },
          { lastActiveAt: { lt: cutoffDate } },
        ],
      },
    })

    return result.count
  } catch (error) {
    console.error('Error cleaning up inactive sessions:', error)
    return 0
  }
}
