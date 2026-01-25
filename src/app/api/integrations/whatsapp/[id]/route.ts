// WhatsApp Connection by ID API

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

/**
 * DELETE - Delete a WhatsApp connection by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: connectionId } = await params

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
