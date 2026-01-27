// Contacts API Route

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

/**
 * GET - Get all contacts for current user
 * POST - Create a new contact
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'all'
    const searchQuery = searchParams.get('search') || ''

    // Build where clause
    const where: any = {
      userId: user.id,
    }

    if (filter !== 'all') {
      where.status = filter
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { phone: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { company: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }

    const contacts = await db.contact.findMany({
      where,
      include: {
        tags: true,
      },
      orderBy: {
        lastContact: 'desc',
      },
    })

    return NextResponse.json({ contacts }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

/**
 * POST - Create a new contact
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, email, company, status } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    // Check if contact already exists
    const existing = await db.contact.findFirst({
      where: {
        userId: user.id,
        phone: phone,
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Contact already exists' }, { status: 400 })
    }

    const contact = await db.contact.create({
      data: {
        userId: user.id,
        name,
        phone,
        email: email || null,
        company: company || null,
        status: status || 'lead',
      },
      include: {
        tags: true,
      },
    })

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
