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
