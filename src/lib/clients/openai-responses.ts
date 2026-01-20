function extractOutputText(resJson: any): string {
  if (!resJson) return ''
  if (typeof resJson.output_text === 'string') return resJson.output_text

  // Try to pull from output array
  const output = resJson.output
  if (Array.isArray(output)) {
    for (const item of output) {
      const content = item?.content
      if (Array.isArray(content)) {
        for (const c of content) {
          if (typeof c?.text === 'string' && c.text.trim()) return c.text
          if (typeof c?.content === 'string' && c.content.trim()) return c.content
        }
      }
    }
  }
  return ''
}

export async function createResponse(params: {
  input: string
  model?: string
  system?: string
}) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const model = params.model ?? 'gpt-4.1-mini'
  const system = params.system ?? 'You are a helpful customer support agent. Reply briefly and clearly.'

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        { role: 'system', content: system },
        { role: 'user', content: params.input },
      ],
    }),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(
      `OpenAI Responses API failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`
    )
  }

  return {
    raw: json,
    text: extractOutputText(json),
  }
}

