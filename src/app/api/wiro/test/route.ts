import { NextRequest, NextResponse } from 'next/server'
import { createWiroChatResponse, runWiroChatTask, getWiroTaskDetailById } from '@/lib/clients/wiro-chat'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...params } = body

    if (action === 'runTask') {
      const result = await runWiroChatTask({
        prompt: params.prompt || 'Merhaba, nasılsın?',
        user_id: params.user_id || 'test-user',
        session_id: params.session_id || 'test-session',
        system_prompt: params.system_prompt,
        selectedModel: params.selectedModel,
        temperature: params.temperature,
        top_p: params.top_p,
        top_k: params.top_k,
        repetition_penalty: params.repetition_penalty,
        length_penalty: params.length_penalty,
        max_tokens: params.max_tokens,
        min_tokens: params.min_tokens,
        stop_sequences: params.stop_sequences,
        seed: params.seed,
        quantization: params.quantization,
        do_sample: params.do_sample,
      })
      return NextResponse.json({ success: true, data: result })
    }

    if (action === 'getTaskDetail') {
      const result = await getWiroTaskDetailById(params.taskid)
      return NextResponse.json({ success: true, data: result })
    }

    if (action === 'createChatResponse') {
      const result = await createWiroChatResponse({
        prompt: params.prompt || 'Merhaba, nasılsın?',
        user_id: params.user_id || 'test-user',
        session_id: params.session_id || 'test-session',
        system_prompt: params.system_prompt,
        selectedModel: params.selectedModel,
        pollIntervalMs: params.pollIntervalMs || 1000,
        timeoutMs: params.timeoutMs || 60000,
      })
      return NextResponse.json({ success: true, data: result })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Wiro test error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

// WebSocket endpoint için GET handler (Next.js App Router'da WebSocket desteği için)
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'WebSocket connection should be made from client side' })
}
