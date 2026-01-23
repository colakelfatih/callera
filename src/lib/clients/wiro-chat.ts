import crypto from 'crypto'

type WiroRunTaskResponse = {
  errors?: unknown[]
  taskid?: string
  socketaccesstoken?: string
  result?: boolean
}

type WiroTaskOutput = {
  id?: string
  name?: string
  contenttype?: string
  url?: string
}

type WiroTaskListItem = {
  id?: string
  uuid?: string
  socketaccesstoken?: string
  status?: string
  debugoutput?: string
  debugerror?: string
  outputs?: WiroTaskOutput[]
}

type WiroTaskDetailResponse = {
  total?: string
  errors?: unknown[]
  tasklist?: WiroTaskListItem[]
  result?: boolean
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Wiro auth header preparation (as documented):
 * - NONCE: unix time (or any random integer value)
 * - SIGNATURE: HMAC-SHA256 of message = (YOUR_API_SECRET + NONCE) with key = YOUR_API_KEY
 *   Docs show: echo -n "${YOUR_API_SECRET}${NONCE}" | openssl dgst -sha256 -hmac "${YOUR_API_KEY}"
 */
function buildWiroAuthHeaders() {
  const apiKey = process.env.WIRO_API_KEY
  const apiSecret = process.env.WIRO_API_SECRET
  if (!apiKey) throw new Error('WIRO_API_KEY is not set')
  if (!apiSecret) throw new Error('WIRO_API_SECRET is not set')

  const nonce = String(Math.floor(Date.now() / 1000))
  const hex = crypto.createHmac('sha256', apiKey).update(`${apiSecret}${nonce}`).digest('hex')

  // Match OpenSSL default output format from the docs command
  const signature = `SHA2-256(stdin)= ${hex}`

  return {
    'x-api-key': apiKey,
    'x-nonce': nonce,
    'x-signature': signature,
  }
}

export async function runWiroChatTask(params: {
  prompt: string
  user_id?: string
  session_id?: string
  system_prompt?: string
  selectedModel?: string
  selectedModelPrivate?: string
  temperature?: string
  top_p?: string
  top_k?: number
  repetition_penalty?: string
  length_penalty?: string
  max_tokens?: number
  min_tokens?: number
  stop_sequences?: string
  seed?: string
  quantization?: string
  do_sample?: string
  callbackUrl?: string
}) {
  const authHeaders = buildWiroAuthHeaders()

  // Docs show: Content-Type: multipart/form-data with a JSON body (-d '{...}').
  // We follow that format exactly (do not guess alternate encodings).
  const body = JSON.stringify({
    selectedModel: params.selectedModel ?? process.env.WIRO_SELECTED_MODEL ?? '617',
    selectedModelPrivate: params.selectedModelPrivate ?? '',
    prompt: params.prompt ?? '',
    user_id: params.user_id ?? '',
    session_id: params.session_id ?? '',
    system_prompt:
      params.system_prompt ??
      'You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. \nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don\'t know the answer to a question, please don\'t share false information.',
    temperature: params.temperature ?? '0.7',
    top_p: params.top_p ?? '0.95',
    top_k: params.top_k ?? 0,
    repetition_penalty: params.repetition_penalty ?? '1.0',
    length_penalty: params.length_penalty ?? '1',
    max_tokens: params.max_tokens ?? 0,
    min_tokens: params.min_tokens ?? 0,
    max_new_tokens: 0,
    min_new_tokens: -1,
    stop_sequences: params.stop_sequences ?? '',
    seed: params.seed ?? '123456',
    quantization: params.quantization ?? '--quantization',
    do_sample: params.do_sample ?? '--do_sample',
    ...(params.callbackUrl ? { callbackUrl: params.callbackUrl } : {}),
  })

  const res = await fetch('https://api.wiro.ai/v1/Run/wiro/chat', {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'multipart/form-data',
    } as any,
    body,
  })

  const json = (await res.json().catch(() => null)) as WiroRunTaskResponse | null
  if (!res.ok) {
    throw new Error(`Wiro Run failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`)
  }
  if (!json?.taskid) {
    throw new Error(`Wiro Run did not return taskid: ${json ? JSON.stringify(json) : 'null'}`)
  }
  return json
}

export async function getWiroTaskDetailById(taskid: string) {
  const authHeaders = buildWiroAuthHeaders()
  const body = JSON.stringify({ taskid })

  const res = await fetch('https://api.wiro.ai/v1/Task/Detail', {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'multipart/form-data',
    } as any,
    body,
  })

  const json = (await res.json().catch(() => null)) as WiroTaskDetailResponse | null
  if (!res.ok) {
    throw new Error(
      `Wiro Task Detail failed: ${res.status} ${res.statusText} ${json ? JSON.stringify(json) : ''}`
    )
  }
  return json
}

export async function pollWiroTaskUntilTerminal(params: {
  taskid: string
  pollIntervalMs: number
  timeoutMs: number
}) {
  const startedAt = Date.now()

  while (true) {
    const detail = await getWiroTaskDetailById(params.taskid)
    const task = detail?.tasklist?.[0]
    const status = task?.status

    if (status === 'task_postprocess_end' || status === 'task_cancel') {
      return { detail, task }
    }

    if (Date.now() - startedAt > params.timeoutMs) {
      throw new Error(`Wiro task polling timed out after ${params.timeoutMs}ms (last status: ${status ?? 'unknown'})`)
    }

    await sleep(params.pollIntervalMs)
  }
}

async function tryExtractTextFromTask(task: WiroTaskListItem | undefined | null) {
  const debug = (task?.debugoutput ?? '').trim()
  if (debug) return debug

  const first = task?.outputs?.[0]
  const url = first?.url
  const contentType = (first?.contenttype ?? '').toLowerCase()
  if (!url) return ''

  // If Wiro provides a textual output file, fetch it and return its contents.
  if (contentType.startsWith('text/') || contentType === 'application/json') {
    const res = await fetch(url)
    if (!res.ok) return ''
    return (await res.text()).trim()
  }

  return ''
}

/**
 * High-level helper: submit a chat task and poll until terminal status, then return best-effort text.
 */
export async function createWiroChatResponse(params: {
  prompt: string
  user_id?: string
  session_id?: string
  system_prompt?: string
  selectedModel?: string
  pollIntervalMs?: number
  timeoutMs?: number
}) {
  const run = await runWiroChatTask({
    prompt: params.prompt,
    user_id: params.user_id,
    session_id: params.session_id,
    system_prompt: params.system_prompt,
    selectedModel: params.selectedModel,
  })

  const { detail, task } = await pollWiroTaskUntilTerminal({
    taskid: run.taskid!,
    pollIntervalMs: params.pollIntervalMs ?? 1000,
    timeoutMs: params.timeoutMs ?? 60_000,
  })

  const text = await tryExtractTextFromTask(task)

  return {
    run,
    detail,
    task,
    text,
  }
}

