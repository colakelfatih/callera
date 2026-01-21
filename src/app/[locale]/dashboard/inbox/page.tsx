import { db } from '@/lib/db'
import InboxClient from './inbox-client'

export const dynamic = 'force-dynamic'

export default async function InboxPage() {
  // Direkt DB'den mesajları çek
  const messages = await db.message.findMany({
    where: {
      isFromBusiness: false, // Sadece gelen mesajlar
    },
    orderBy: { createdAt: 'desc' },
    take: 500, // Son 500 mesaj (thread içinde daha fazla context)
  })

  return <InboxClient initialMessages={messages} />
}
