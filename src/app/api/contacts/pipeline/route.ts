// Contacts Pipeline API Route

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

/**
 * GET - Get contacts grouped by status for Kanban board
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contacts = await db.contact.findMany({
      where: {
        userId: user.id,
      },
      include: {
        tags: {
          select: {
            id: true,
            tag: true,
            color: true,
            createdAt: true,
            contactId: true,
          },
        },
      },
      orderBy: {
        lastContact: 'desc',
      },
    })

    // Group contacts by status
    const statusGroups: Record<string, typeof contacts> = {
      'lead': [],
      'prospect': [],
      'customer': [],
      'closed': [],
    }

    contacts.forEach((contact) => {
      const status = contact.status || 'lead'
      if (statusGroups[status]) {
        statusGroups[status].push(contact)
      } else {
        statusGroups['lead'].push(contact)
      }
    })

    // Map to pipeline format
    const pipelineData = [
      {
        id: 'lead-in',
        title: 'Gelen Müşteriler',
        count: statusGroups['lead'].length,
        contacts: statusGroups['lead'],
      },
      {
        id: 'contact-made',
        title: 'İletişim Kuruldu',
        count: statusGroups['prospect'].length,
        contacts: statusGroups['prospect'],
      },
      {
        id: 'meeting-scheduled',
        title: 'Toplantı Planlandı',
        count: 0,
        contacts: [],
      },
      {
        id: 'proposal',
        title: 'Teklif',
        count: 0,
        contacts: [],
      },
      {
        id: 'won',
        title: 'Kazanıldı',
        count: statusGroups['closed'].length,
        contacts: statusGroups['closed'],
      },
    ]

    return NextResponse.json({ pipeline: pipelineData }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching pipeline contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch pipeline contacts' }, { status: 500 })
  }
}
