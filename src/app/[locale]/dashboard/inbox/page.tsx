import { db } from '@/lib/db'
import InboxClient from './inbox-client'

export const dynamic = 'force-dynamic'

// Mock data for testing channel icons
const mockMessages = [
  {
    id: 'mock-whatsapp-1',
    channel: 'whatsapp' as const,
    channelMessageId: 'mock-wa-msg-1',
    connectionId: null,
    senderId: '905551234567',
    senderName: 'Ahmet Yılmaz',
    messageText: 'Merhaba, Kadıköy\'deki 3+1 daire hala satılık mı?',
    messageType: 'text' as const,
    rawPayload: null,
    isFromBusiness: false,
    conversationId: null,
    status: 'completed' as const,
    aiResponse: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 dakika önce
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'mock-whatsapp-2',
    channel: 'whatsapp' as const,
    channelMessageId: 'mock-wa-msg-2',
    connectionId: null,
    senderId: '905551234567',
    senderName: 'Ahmet Yılmaz',
    messageText: 'Evet, hala satılık. Fiyatı 3.500.000 TL. Görüşme ayarlayalım mı?',
    messageType: 'text' as const,
    rawPayload: null,
    isFromBusiness: true,
    conversationId: null,
    status: 'completed' as const,
    aiResponse: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 dakika önce
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
    updatedAt: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: 'mock-instagram-1',
    channel: 'instagram' as const,
    channelMessageId: 'mock-ig-msg-1',
    connectionId: null,
    senderId: 'ig:123456789',
    senderName: 'zeynep.kaya',
    messageText: 'Merhaba! Story\'de paylaştığınız villa hakkında bilgi alabilir miyim? 🏠',
    messageType: 'text' as const,
    rawPayload: null,
    isFromBusiness: false,
    conversationId: null,
    status: 'completed' as const,
    aiResponse: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 dakika önce
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'mock-instagram-2',
    channel: 'instagram' as const,
    channelMessageId: 'mock-ig-msg-2',
    connectionId: null,
    senderId: 'ig:123456789',
    senderName: 'zeynep.kaya',
    messageText: 'Tabii ki! Bodrum\'daki villa 5+2, denize sıfır. Fiyat ve detaylar için DM\'den devam edelim. 🌊',
    messageType: 'text' as const,
    rawPayload: null,
    isFromBusiness: true,
    conversationId: null,
    status: 'completed' as const,
    aiResponse: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 dakika önce
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
]

export default async function InboxPage() {
  // Direkt DB'den mesajları çek
  const dbMessages = await db.message.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500, // Son 500 mesaj (thread içinde daha fazla context)
  })

  // Mock data'yı DB mesajlarıyla birleştir (mock data en üstte)
  const messages = [...mockMessages, ...dbMessages]

  return <InboxClient initialMessages={messages} />
}
