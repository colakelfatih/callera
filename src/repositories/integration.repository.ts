// Integration Repository
// Handles checking connected platforms across all integration types

import { db } from '@/lib/db'

export interface ConnectedPlatforms {
  whatsapp: Array<{
    id: string
    phoneNumber: string | null
    businessName: string | null
  }>
  instagram: Array<{
    id: string
    instagramUsername: string
  }>
  // Future: facebook, telegram
}

export interface IntegrationStatus {
  hasWhatsApp: boolean
  hasInstagram: boolean
  hasFacebook: boolean
  hasTelegram: boolean
  hasAny: boolean
  totalConnections: number
}

export const IntegrationRepository = {
  /**
   * Get all connected platforms for a user
   */
  async getConnectedPlatforms(userId: string): Promise<ConnectedPlatforms> {
    const [whatsappConnections, instagramConnections] = await Promise.all([
      db.whatsAppConnection.findMany({
        where: { userId },
        select: {
          id: true,
          phoneNumber: true,
          businessName: true,
        },
      }),
      db.instagramConnection.findMany({
        where: { userId },
        select: {
          id: true,
          instagramUsername: true,
        },
      }),
    ])

    return {
      whatsapp: whatsappConnections,
      instagram: instagramConnections,
    }
  },

  /**
   * Check integration status for a user
   */
  async getStatus(userId: string): Promise<IntegrationStatus> {
    const [whatsappCount, instagramCount] = await Promise.all([
      db.whatsAppConnection.count({ where: { userId } }),
      db.instagramConnection.count({ where: { userId } }),
      // Future: facebookCount, telegramCount
    ])

    const totalConnections = whatsappCount + instagramCount

    return {
      hasWhatsApp: whatsappCount > 0,
      hasInstagram: instagramCount > 0,
      hasFacebook: false, // Not implemented yet
      hasTelegram: false, // Not implemented yet
      hasAny: totalConnections > 0,
      totalConnections,
    }
  },

  /**
   * Check if user has any connected integration
   */
  async hasAnyConnection(userId: string): Promise<boolean> {
    const status = await this.getStatus(userId)
    return status.hasAny
  },

  /**
   * Get the first available connection for sending test messages
   */
  async getFirstConnection(userId: string): Promise<{
    type: 'whatsapp' | 'instagram' | null
    connectionId: string | null
    phoneNumberId?: string
    accessToken?: string
  }> {
    // Try WhatsApp first
    const whatsapp = await db.whatsAppConnection.findFirst({
      where: { userId },
      select: {
        id: true,
        phoneNumberId: true,
        accessToken: true,
      },
    })

    if (whatsapp) {
      return {
        type: 'whatsapp',
        connectionId: whatsapp.id,
        phoneNumberId: whatsapp.phoneNumberId,
        accessToken: whatsapp.accessToken,
      }
    }

    // Try Instagram
    const instagram = await db.instagramConnection.findFirst({
      where: { userId },
      select: {
        id: true,
        accessToken: true,
      },
    })

    if (instagram) {
      return {
        type: 'instagram',
        connectionId: instagram.id,
        accessToken: instagram.accessToken,
      }
    }

    return { type: null, connectionId: null }
  },
}
