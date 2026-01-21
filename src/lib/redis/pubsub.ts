import IORedis from 'ioredis'

const CHANNEL_NEW_MESSAGE = 'new-message'

function getRedisUrl() {
  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) throw new Error('REDIS_URL is not set')
  return redisUrl
}

let _publisher: IORedis | null = null
function getPublisher() {
  if (!_publisher) {
    _publisher = new IORedis(getRedisUrl(), { maxRetriesPerRequest: null })
  }
  return _publisher
}

export type NewMessageEvent = {
  id: string
  channel: string
  channelMessageId: string
  connectionId?: string | null
  senderId: string
  senderName?: string | null
  messageText: string
  messageType: string
  status: string
  aiResponse?: string | null
  timestamp?: string | null
  createdAt: string
}

export async function publishNewMessage(event: NewMessageEvent) {
  const payload = JSON.stringify(event)
  await getPublisher().publish(CHANNEL_NEW_MESSAGE, payload)
}

export function subscribeToNewMessages(opts: {
  onMessage: (event: NewMessageEvent) => void
  onError?: (err: unknown) => void
}) {
  const sub = new IORedis(getRedisUrl(), { maxRetriesPerRequest: null })

  const handler = (channel: string, message: string) => {
    if (channel !== CHANNEL_NEW_MESSAGE) return
    try {
      const parsed = JSON.parse(message) as NewMessageEvent
      opts.onMessage(parsed)
    } catch (err) {
      opts.onError?.(err)
    }
  }

  sub.on('message', handler)
  sub.on('error', (err) => opts.onError?.(err))

  const start = async () => {
    await sub.subscribe(CHANNEL_NEW_MESSAGE)
  }

  const stop = async () => {
    try {
      sub.off('message', handler)
      await sub.unsubscribe(CHANNEL_NEW_MESSAGE)
    } catch {
      // ignore
    } finally {
      sub.disconnect()
    }
  }

  return { start, stop }
}

