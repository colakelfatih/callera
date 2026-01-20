import { Worker, QueueEvents } from 'bullmq'
import { getMessageQueue } from '../lib/queue/message-queue'
import { db } from '../lib/db'
import type { MessageJob } from '../types/message'
import { createResponse } from '../lib/clients/openai-responses'
import { sendWhatsAppTextMessage } from '../lib/clients/whatsapp-client'

const concurrency = Number(process.env.QUEUE_CONCURRENCY ?? 10)

// Reuse the same connection options BullMQ uses internally (avoids ioredis type/version conflicts)
const queue = getMessageQueue()
const queueEvents = new QueueEvents('message-processing', {
  // BullMQ exposes the connection options on the queue instance
  connection: (queue as any).opts.connection,
})
queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error('queue.failed', { jobId, failedReason })
})
queueEvents.on('completed', ({ jobId }) => {
  console.log('queue.completed', { jobId })
})

const worker = new Worker<MessageJob>(
  'message-processing',
  async (job) => {
    const { messageId, channel, senderId, messageText, connectionId } = job.data

    const msg = await db.message.findUnique({ where: { id: messageId } })
    if (!msg) {
      console.warn('worker.message_not_found', { messageId })
      return
    }

    if (msg.status === 'completed') {
      console.log('worker.already_completed', { messageId })
      return
    }

    await db.message.update({
      where: { id: messageId },
      data: { status: 'processing' },
    })

    const ai = await createResponse({
      input: messageText,
      system:
        'You are a helpful customer support agent. Reply in Turkish. Keep it short and actionable.',
    })

    const aiText = (ai.text || '').trim()
    if (!aiText) {
      throw new Error('OpenAI returned empty text')
    }

    if (channel === 'whatsapp') {
      const phoneNumberId = connectionId || process.env.WHATSAPP_PHONE_NUMBER_ID
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
      if (!phoneNumberId) throw new Error('Missing WhatsApp phoneNumberId (connectionId/WHATSAPP_PHONE_NUMBER_ID)')
      if (!accessToken) throw new Error('WHATSAPP_ACCESS_TOKEN is not set')

      await sendWhatsAppTextMessage({
        phoneNumberId,
        accessToken,
        to: senderId,
        text: aiText,
      })
    } else {
      // TODO: add other channel send implementations
      console.log('worker.skip_send_unsupported_channel', { channel })
    }

    await db.message.update({
      where: { id: messageId },
      data: { status: 'completed', aiResponse: aiText },
    })
  },
  { connection: (queue as any).opts.connection, concurrency }
)

worker.on('failed', (job, err) => {
  console.error('worker.failed', { jobId: job?.id, err: err?.message, attemptsMade: job?.attemptsMade })
  if (job?.data?.messageId) {
    db.message
      .update({
        where: { id: job.data.messageId },
        data: { status: 'failed' },
      })
      .catch(() => {})
  }
})

worker.on('completed', (job) => {
  console.log('worker.done', { jobId: job.id })
})

console.log('message-worker started', { concurrency })

