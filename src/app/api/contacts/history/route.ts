// Contact History API Route

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

/**
 * GET - Get contact history by phone number
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Find contact by phone
    const contact = await db.contact.findFirst({
      where: {
        userId: user.id,
        phone: phone,
      },
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        calls: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!contact) {
      return NextResponse.json({ history: [] })
    }

    // Get messages from this contact
    const messages = await db.message.findMany({
      where: {
        senderId: phone,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    // Combine all history items
    const history: any[] = []

    // Add contact creation
    history.push({
      type: 'system',
      title: 'Sisteme Eklendi',
      description: `${contact.name} sisteme eklendi`,
      timestamp: contact.createdAt,
      createdAt: contact.createdAt,
    })

    // Add messages
    messages.forEach((msg) => {
      history.push({
        type: 'message',
        title: msg.isFromBusiness ? 'Gönderilen Mesaj' : 'Gelen Mesaj',
        description: msg.messageText,
        timestamp: msg.timestamp || msg.createdAt,
        createdAt: msg.createdAt,
        channel: msg.channel,
      })
    })

    // Add conversations
    contact.conversations.forEach((conv) => {
      history.push({
        type: 'conversation',
        title: `${conv.channel} Konuşması`,
        description: conv.content,
        timestamp: conv.timestamp,
        createdAt: conv.createdAt,
      })
    })

    // Add calls
    contact.calls.forEach((call) => {
      history.push({
        type: 'call',
        title: `${call.type === 'inbound' ? 'Gelen' : 'Giden'} Arama`,
        description: call.status === 'completed' ? `${call.duration || 0} saniye` : call.status,
        timestamp: call.timestamp,
        createdAt: call.createdAt,
      })
    })

    // Add last contact update
    if (contact.lastContact && contact.lastContact.getTime() !== contact.createdAt.getTime()) {
      history.push({
        type: 'system',
        title: 'Son İletişim',
        description: `Son iletişim güncellendi`,
        timestamp: contact.lastContact,
        createdAt: contact.lastContact,
      })
    }

    // Sort by timestamp (newest first)
    history.sort((a, b) => {
      const timeA = new Date(a.timestamp || a.createdAt).getTime()
      const timeB = new Date(b.timestamp || b.createdAt).getTime()
      return timeB - timeA
    })

    return NextResponse.json({
      contact: {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        company: contact.company,
        status: contact.status,
        createdAt: contact.createdAt,
        lastContact: contact.lastContact,
      },
      history: history.slice(0, 50), // Limit to 50 items
    })
  } catch (error: any) {
    console.error('Error fetching contact history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact history', details: error.message },
      { status: 500 }
    )
  }
}
