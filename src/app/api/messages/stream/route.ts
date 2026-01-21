import { NextRequest } from 'next/server'
import { subscribeToNewMessages, type NewMessageEvent } from '@/lib/redis/pubsub'

export const dynamic = 'force-dynamic'

function sseFormat(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

export async function GET(_request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sseFormat(event, data)))
      }

      // initial hello + keepalive comment to open stream
      send('ready', { ok: true, ts: Date.now() })

      const sub = subscribeToNewMessages({
        onMessage: (evt: NewMessageEvent) => {
          send('message', evt)
        },
        onError: (err) => {
          send('error', { message: String((err as any)?.message ?? err) })
        },
      })

      await sub.start()

      const heartbeat = setInterval(() => {
        // SSE comment line keeps proxies from closing idle connections
        controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`))
      }, 25_000)

      const cleanup = async () => {
        clearInterval(heartbeat)
        await sub.stop()
      }
      // store cleanup without relying on private fields
      ;(stream as any)._cleanup = cleanup
    },
    async cancel() {
      const cleanup = (stream as any)._cleanup
      if (typeof cleanup === 'function') await cleanup()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

