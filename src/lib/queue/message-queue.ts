import { Queue } from 'bullmq'

let _messageQueue: Queue | null = null

function getBullMqConnection() {
  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) throw new Error('REDIS_URL is not set')

  const url = new URL(redisUrl)
  const isTls = url.protocol === 'rediss:'

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 6379,
    username: url.username || undefined,
    password: url.password || undefined,
    db: url.pathname && url.pathname !== '/' ? Number(url.pathname.slice(1)) : undefined,
    tls: isTls ? {} : undefined,
    // BullMQ expects ioredis options; passing plain options avoids the “two ioredis copies” type issue
    maxRetriesPerRequest: null as any,
  } as any
}

export function getMessageQueue() {
  if (!_messageQueue) {
    _messageQueue = new Queue('message-processing', {
      connection: getBullMqConnection(),
      defaultJobOptions: {
        attempts: Number(process.env.QUEUE_RETRY_ATTEMPTS ?? 3),
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    })
  }
  return _messageQueue
}

