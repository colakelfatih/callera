// Contact (Müşteri) Helper Functions

import { db } from '@/lib/db'
import type { Contact } from '@prisma/client'

/**
 * Find or create a müşteri (contact) from WhatsApp message data
 * 
 * @param params - WhatsApp message parameters
 * @returns Contact if created/updated, null if WhatsAppConnection not found
 */
export async function findOrCreateContactFromWhatsApp(params: {
  phoneNumber: string
  phoneNumberId: string
  name?: string | null
  timestamp?: Date
}): Promise<Contact | null> {
  try {
    const { phoneNumber, phoneNumberId, name, timestamp } = params

    // Validate phone number
    if (!phoneNumber || !phoneNumber.trim()) {
      console.warn('findOrCreateContactFromWhatsApp: Missing phone number')
      return null
    }

    // 1. Find WhatsAppConnection by phoneNumberId to get userId
    console.log('🔍 Searching for WhatsAppConnection:', {
      phoneNumberId,
      phoneNumber,
    })

    const connection = await db.whatsAppConnection.findFirst({
      where: {
        phoneNumberId: phoneNumberId,
      },
      select: {
        userId: true,
        id: true,
        phoneNumberId: true,
      },
    })

    if (!connection) {
      // Try to find by any phoneNumberId (in case of format mismatch)
      const allConnections = await db.whatsAppConnection.findMany({
        select: {
          id: true,
          phoneNumberId: true,
          userId: true,
        },
        take: 5, // Just for debugging
      })
      
      console.error('❌ WhatsAppConnection not found for phoneNumberId:', {
        searchedPhoneNumberId: phoneNumberId,
        phoneNumber,
        availableConnections: allConnections.map(c => ({
          id: c.id,
          phoneNumberId: c.phoneNumberId,
        })),
      })
      return null
    }

    console.log('✅ Found WhatsAppConnection:', {
      connectionId: connection.id,
      phoneNumberId: connection.phoneNumberId,
      userId: connection.userId,
    })

    const userId = connection.userId

    // 2. Prepare contact data
    const contactName = name?.trim() || phoneNumber // Default to phone number if no name
    const lastContactDate = timestamp || new Date()

    // 3. Upsert Contact by userId + phone
    const contact = await db.contact.upsert({
      where: {
        userId_phone: {
          userId,
          phone: phoneNumber,
        },
      },
      create: {
        userId,
        name: contactName,
        phone: phoneNumber,
        status: 'lead', // New müşteriler start as 'lead' (Gelen Müşteriler)
        lastContact: lastContactDate,
      },
      update: {
        // Update name only if provided and different
        ...(name && name.trim() && name.trim() !== contactName
          ? { name: name.trim() }
          : {}),
        // Always update lastContact to latest message time
        lastContact: lastContactDate,
        updatedAt: new Date(),
      },
    })

    return contact
  } catch (error: any) {
    console.error('findOrCreateContactFromWhatsApp error:', {
      error: error?.message ?? error,
      phoneNumber: params.phoneNumber,
      phoneNumberId: params.phoneNumberId,
    })
    throw error
  }
}

/**
 * Find or create a müşteri (contact) from Instagram message data
 * 
 * @param params - Instagram message parameters
 * @returns Contact if created/updated, null if InstagramConnection not found
 */
export async function findOrCreateContactFromInstagram(params: {
  instagramUserId: string
  recipientId: string  // Page ID or Instagram Business Account ID that received the message
  username?: string | null
  name?: string | null
  timestamp?: Date
}): Promise<Contact | null> {
  try {
    const { instagramUserId, recipientId, username, name, timestamp } = params

    // Validate Instagram user ID
    if (!instagramUserId || !instagramUserId.trim()) {
      console.warn('findOrCreateContactFromInstagram: Missing Instagram user ID')
      return null
    }

    // 1. Find InstagramConnection by recipientId (pageId or instagramUserId) to get userId
    console.log('🔍 Searching for InstagramConnection:', {
      recipientId,
      instagramUserId,
    })

    const connection = await db.instagramConnection.findFirst({
      where: {
        OR: [
          { pageId: recipientId },
          { instagramUserId: recipientId },
        ],
      },
      select: {
        userId: true,
        id: true,
        pageId: true,
        instagramUserId: true,
      },
    })

    if (!connection) {
      // Try to find any connection for debugging
      const allConnections = await db.instagramConnection.findMany({
        select: {
          id: true,
          pageId: true,
          instagramUserId: true,
          userId: true,
        },
        take: 5, // Just for debugging
      })
      
      console.error('❌ InstagramConnection not found for recipientId:', {
        searchedRecipientId: recipientId,
        instagramUserId,
        availableConnections: allConnections.map(c => ({
          id: c.id,
          pageId: c.pageId,
          instagramUserId: c.instagramUserId,
        })),
      })
      return null
    }

    console.log('✅ Found InstagramConnection:', {
      connectionId: connection.id,
      pageId: connection.pageId,
      instagramUserId: connection.instagramUserId,
      userId: connection.userId,
    })

    const userId = connection.userId

    // 2. Prepare contact data
    // For Instagram, we use username or Instagram user ID as identifier
    // Phone field will store Instagram user ID prefixed with 'ig:'
    const contactPhone = `ig:${instagramUserId}`
    const contactName = name?.trim() || username?.trim() || instagramUserId
    const lastContactDate = timestamp || new Date()

    // 3. Upsert Contact by userId + phone (using ig: prefix)
    const contact = await db.contact.upsert({
      where: {
        userId_phone: {
          userId,
          phone: contactPhone,
        },
      },
      create: {
        userId,
        name: contactName,
        phone: contactPhone,
        status: 'lead', // New müşteriler start as 'lead' (Gelen Müşteriler)
        lastContact: lastContactDate,
      },
      update: {
        // Update name only if we have a better name (username or actual name)
        ...((name?.trim() || username?.trim()) && (name?.trim() || username?.trim()) !== instagramUserId
          ? { name: name?.trim() || username?.trim() }
          : {}),
        // Always update lastContact to latest message time
        lastContact: lastContactDate,
        updatedAt: new Date(),
      },
    })

    return contact
  } catch (error: any) {
    console.error('findOrCreateContactFromInstagram error:', {
      error: error?.message ?? error,
      instagramUserId: params.instagramUserId,
      recipientId: params.recipientId,
    })
    throw error
  }
}
