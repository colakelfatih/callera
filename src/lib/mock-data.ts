export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  avatar?: string
  status: 'lead' | 'prospect' | 'customer' | 'closed'
  lastContact: Date
  tags: string[]
}

export interface Conversation {
  id: string
  contactId: string
  channel: 'email' | 'whatsapp' | 'instagram' | 'phone'
  content: string
  timestamp: Date
  isRead: boolean
  isOutbound: boolean
  sentiment: 'positive' | 'neutral' | 'negative'
  labels: string[]
  priority: 'low' | 'medium' | 'high'
}

export interface Call {
  id: string
  contactId: string
  type: 'inbound' | 'outbound'
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed'
  duration?: number
  transcript?: string
  summary?: string
  timestamp: Date
  aiGenerated: boolean
}

export interface AutomationFlow {
  id: string
  name: string
  trigger: string
  conditions: string[]
  actions: string[]
  isActive: boolean
  lastRun?: Date
}

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    status: 'prospect',
    lastContact: new Date('2024-01-15T10:30:00'),
    tags: ['enterprise', 'interested']
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@healthplus.com',
    phone: '+1 (555) 234-5678',
    company: 'HealthPlus Clinic',
    status: 'customer',
    lastContact: new Date('2024-01-14T14:20:00'),
    tags: ['healthcare', 'active']
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@realestate.com',
    phone: '+1 (555) 345-6789',
    company: 'Chen Real Estate',
    status: 'lead',
    lastContact: new Date('2024-01-13T09:15:00'),
    tags: ['real-estate', 'new']
  }
]

export const mockConversations: Conversation[] = [
  {
    id: '1',
    contactId: '1',
    channel: 'email',
    content: 'Hi, I\'m interested in learning more about your AI calling solution. Can we schedule a demo?',
    timestamp: new Date('2024-01-15T10:30:00'),
    isRead: false,
    isOutbound: false,
    sentiment: 'positive',
    labels: ['demo-request', 'pricing'],
    priority: 'high'
  },
  {
    id: '2',
    contactId: '2',
    channel: 'whatsapp',
    content: 'The appointment reminder system is working perfectly! Thank you.',
    timestamp: new Date('2024-01-14T14:20:00'),
    isRead: true,
    isOutbound: false,
    sentiment: 'positive',
    labels: ['satisfaction', 'appointment'],
    priority: 'low'
  },
  {
    id: '3',
    contactId: '3',
    channel: 'phone',
    content: 'AI Call Summary: Discussed property management automation. Client interested in lead qualification system.',
    timestamp: new Date('2024-01-13T09:15:00'),
    isRead: true,
    isOutbound: true,
    sentiment: 'neutral',
    labels: ['ai-call', 'lead-qualification'],
    priority: 'medium'
  }
]

export const mockCalls: Call[] = [
  {
    id: '1',
    contactId: '1',
    type: 'outbound',
    status: 'scheduled',
    timestamp: new Date('2024-01-16T14:30:00'),
    aiGenerated: true
  },
  {
    id: '2',
    contactId: '2',
    type: 'inbound',
    status: 'completed',
    duration: 420,
    transcript: 'Client called to confirm appointment. AI assistant handled the call and provided confirmation details.',
    summary: 'Appointment confirmation call completed successfully.',
    timestamp: new Date('2024-01-14T14:20:00'),
    aiGenerated: true
  },
  {
    id: '3',
    contactId: '3',
    type: 'outbound',
    status: 'completed',
    duration: 180,
    transcript: 'Discussed property management automation features. Client showed interest in lead qualification system.',
    summary: 'Productive discussion about automation solutions for real estate.',
    timestamp: new Date('2024-01-13T09:15:00'),
    aiGenerated: true
  }
]

export const mockAutomationFlows: AutomationFlow[] = [
  {
    id: '1',
    name: 'New Lead Follow-up',
    trigger: 'New contact added',
    conditions: ['Contact status = lead', 'Source = website'],
    actions: ['Send welcome email', 'Schedule AI call', 'Add to nurture sequence'],
    isActive: true,
    lastRun: new Date('2024-01-15T08:00:00')
  },
  {
    id: '2',
    name: 'Appointment Reminders',
    trigger: 'Appointment scheduled',
    conditions: ['Appointment type = consultation', '24 hours before appointment'],
    actions: ['Send SMS reminder', 'Make AI confirmation call'],
    isActive: true,
    lastRun: new Date('2024-01-14T10:00:00')
  }
]
