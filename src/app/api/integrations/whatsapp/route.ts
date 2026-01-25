// WhatsApp Connections API

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

/**
 * GET - Get all WhatsApp connections for current user
 */
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connections = await db.whatsAppConnection.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        wabaId: true,
        phoneNumberId: true,
        phoneNumber: true,
        businessName: true,
        createdAt: true,
        updatedAt: true,
        tokenExpiresAt: true,
      },
    })

    return NextResponse.json(connections, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching WhatsApp connections:', error)
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
  }
}

/**
 * DELETE - Delete a WhatsApp connection
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const searchParams = request.nextUrl.searchParams
    const connectionId = body.id || searchParams.get('id')

    if (!connectionId) {
      return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 })
    }

    // Verify connection belongs to user
    const connection = await db.whatsAppConnection.findFirst({
      where: {
        id: connectionId,
        userId: user.id,
      },
    })

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
    }

    await db.whatsAppConnection.delete({
      where: {
        id: connectionId,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting WhatsApp connection:', error)
    return NextResponse.json({ error: 'Failed to delete connection' }, { status: 500 })
  }
}
