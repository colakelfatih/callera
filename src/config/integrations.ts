// Integration Configuration
// Extensible config for messaging platforms

import { MessageCircle, Instagram, Facebook, Send, type LucideIcon } from 'lucide-react'

export interface IntegrationConfig {
  id: string
  name: string
  description: string
  icon: LucideIcon
  enabled: boolean
  color: string
  connectionType: 'oauth' | 'embedded' | 'token'
}

export const INTEGRATIONS: Record<string, IntegrationConfig> = {
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'WhatsApp Business API ile müşterilerinize ulaşın',
    icon: MessageCircle,
    enabled: true,
    color: '#25D366',
    connectionType: 'embedded',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Instagram DM üzerinden mesajlaşın',
    icon: Instagram,
    enabled: true,
    color: '#E4405F',
    connectionType: 'oauth',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook Messenger',
    description: 'Facebook Messenger ile iletişim kurun',
    icon: Facebook,
    enabled: false, // Coming soon
    color: '#1877F2',
    connectionType: 'oauth',
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    description: 'Telegram bot ile mesajlaşın',
    icon: Send,
    enabled: false, // Coming soon
    color: '#0088CC',
    connectionType: 'token',
  },
} as const

export type IntegrationType = keyof typeof INTEGRATIONS

// Get only enabled integrations
export function getEnabledIntegrations(): IntegrationConfig[] {
  return Object.values(INTEGRATIONS).filter(i => i.enabled)
}

// Get all integrations (for admin/settings)
export function getAllIntegrations(): IntegrationConfig[] {
  return Object.values(INTEGRATIONS)
}
