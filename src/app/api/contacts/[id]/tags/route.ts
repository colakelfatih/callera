// Contact Tags API Route

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

/**
 * GET - Get all tags for a contact
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify contact belongs to user
    const contact = await db.contact.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const tags = await db.contactTag.findMany({
      where: { contactId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ tags }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

/**
 * POST - Add a tag to a contact
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { tag, color } = body

    if (!tag || typeof tag !== 'string') {
      return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
    }

    // Verify contact belongs to user
    const contact = await db.contact.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Check if tag already exists
    const existingTag = await db.contactTag.findUnique({
      where: {
        contactId_tag: {
          contactId: id,
          tag: tag.trim(),
        },
      },
    })

    if (existingTag) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 400 })
    }

    // Create tag
    const newTag = await db.contactTag.create({
      data: {
        contactId: id,
        tag: tag.trim(),
        color: color || '#6366f1',
      },
    })

    return NextResponse.json({ tag: newTag }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

/**
 * DELETE - Remove a tag from a contact
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

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const tagId = searchParams.get('tagId')

    if (!tagId) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    // Verify contact belongs to user
    const contact = await db.contact.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Delete tag
    await db.contactTag.delete({
      where: { id: tagId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
