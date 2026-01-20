import IORedis from 'ioredis'

let _redis: IORedis | null = null

function getRedis() {
  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) throw new Error('REDIS_URL is not set')
  if (!_redis) {
    // Separate client to avoid interference with BullMQ connection options
    _redis = new IORedis(redisUrl, { maxRetriesPerRequest: null })
  }
  return _redis
}

export async function dedupeMessage(params: {
  channel: string
  channelMessageId: string
  ttlSeconds?: number
}) {
  const ttlSeconds = params.ttlSeconds ?? 60 * 60 // 1 hour
  const key = `msg:dedupe:${params.channel}:${params.channelMessageId}`

  // SET key value NX EX ttlSeconds
  // ioredis typings expect EX seconds before NX
  const result = await getRedis().set(key, '1', 'EX', ttlSeconds, 'NX')
  return {
    key,
    isNew: result === 'OK',
  }
}

