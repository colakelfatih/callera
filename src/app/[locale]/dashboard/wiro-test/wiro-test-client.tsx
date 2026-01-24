'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Send, CheckCircle2, XCircle, Clock, Wifi, WifiOff } from 'lucide-react'

type TestResult = {
  success: boolean
  data?: any
  error?: string
}

type TaskStatus = {
  taskid?: string
  status?: string
  text?: string
  detail?: any
  error?: string
}

export default function WiroTestClient() {
  const [prompt, setPrompt] = useState('Merhaba, nasılsın?')
  const [systemPrompt, setSystemPrompt] = useState(
    'Sen bir müşteri destek temsilcisisin. Türkçe yanıt ver. Kısa ve net ol.'
  )
  const [userId, setUserId] = useState('test-user')
  const [sessionId, setSessionId] = useState('test-session')
  const [selectedModel, setSelectedModel] = useState('617')
  const [temperature, setTemperature] = useState('0.7')
  const [topP, setTopP] = useState('0.95')
  const [topK, setTopK] = useState('0')
  const [maxTokens, setMaxTokens] = useState('0')
  const [minTokens, setMinTokens] = useState('0')
  const [repetitionPenalty, setRepetitionPenalty] = useState('1.0')
  const [lengthPenalty, setLengthPenalty] = useState('1')
  const [seed, setSeed] = useState('123456')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TaskStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const [taskDetail, setTaskDetail] = useState<any>(null)
  
  // WebSocket state
  const [wsConnected, setWsConnected] = useState(false)
  const [wsMessages, setWsMessages] = useState<string[]>([])
  const [socketAccessToken, setSocketAccessToken] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)
  const [useWebSocket, setUseWebSocket] = useState(false)

  const handleRunTask = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setTaskDetail(null)

    try {
      const response = await fetch('/api/wiro/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'runTask',
          prompt,
          user_id: userId,
          session_id: sessionId,
          system_prompt: systemPrompt,
          selectedModel,
          temperature,
          top_p: topP,
          top_k: parseInt(topK) || 0,
          max_tokens: parseInt(maxTokens) || 0,
          min_tokens: parseInt(minTokens) || 0,
          repetition_penalty: repetitionPenalty,
          length_penalty: lengthPenalty,
          seed,
        }),
      })

      const json: TestResult = await response.json()

      if (!json.success) {
        throw new Error(json.error || 'Failed to run task')
      }

      setResult({
        taskid: json.data?.taskid,
        status: 'running',
      })
      
      // Save socket access token for WebSocket connection
      if (json.data?.socketaccesstoken) {
        setSocketAccessToken(json.data.socketaccesstoken)
      }
      
      // Connect WebSocket if enabled
      if (useWebSocket && json.data?.socketaccesstoken) {
        connectWebSocket(json.data.socketaccesstoken, json.data.taskid)
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }
  
  const connectWebSocket = (token: string, taskid?: string) => {
    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close()
    }
    
    // Try common WebSocket endpoints
    const endpoints = [
      `wss://api.wiro.ai/ws?token=${token}`,
      `wss://api.wiro.ai/socket?token=${token}`,
      `wss://socket.wiro.ai?token=${token}`,
      `wss://api.wiro.ai/ws/${token}`,
    ]
    
    let connected = false
    
    for (const endpoint of endpoints) {
      try {
        const ws = new WebSocket(endpoint)
        
        ws.onopen = () => {
          setWsConnected(true)
          addWsMessage(`WebSocket bağlantısı kuruldu: ${endpoint}`)
          connected = true
          
          // Send taskid if available
          if (taskid) {
            ws.send(JSON.stringify({ taskid, action: 'subscribe' }))
          }
        }
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            addWsMessage(`Mesaj alındı: ${JSON.stringify(data, null, 2)}`)
            
            // Update result if task status is received
            if (data.status) {
              setResult((prev) => ({
                ...prev,
                status: data.status,
                text: data.debugoutput || data.text || prev?.text,
              }))
            }
            
            // Check if task is complete
            if (data.status === 'task_postprocess_end' || data.status === 'task_cancel') {
              addWsMessage(`Task tamamlandı: ${data.status}`)
              if (data.debugoutput) {
                setResult((prev) => ({
                  ...prev,
                  text: data.debugoutput,
                }))
              }
            }
          } catch (e) {
            addWsMessage(`Ham mesaj: ${event.data}`)
          }
        }
        
        ws.onerror = (error) => {
          if (!connected) {
            // Try next endpoint - error will be logged, loop continues naturally
            addWsMessage(`WebSocket bağlantı hatası: ${endpoint}`)
            return
          }
          addWsMessage(`WebSocket hatası: ${error}`)
        }
        
        ws.onclose = () => {
          setWsConnected(false)
          addWsMessage('WebSocket bağlantısı kapatıldı')
        }
        
        wsRef.current = ws
        break // Successfully connected, stop trying other endpoints
      } catch (err) {
        // Continue to next endpoint
        continue
      }
    }
    
    if (!connected) {
      addWsMessage('WebSocket bağlantısı kurulamadı. Lütfen endpoint\'i manuel olarak kontrol edin.')
    }
  }
  
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setWsConnected(false)
      addWsMessage('WebSocket bağlantısı kapatıldı')
    }
  }
  
  const addWsMessage = (message: string) => {
    setWsMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const handleGetTaskDetail = async (taskid: string) => {
    setPolling(true)
    try {
      const response = await fetch('/api/wiro/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getTaskDetail',
          taskid,
        }),
      })

      const json: TestResult = await response.json()

      if (!json.success) {
        throw new Error(json.error || 'Failed to get task detail')
      }

      const task = json.data?.tasklist?.[0]
      setTaskDetail(json.data)

      if (task) {
        setResult({
          taskid,
          status: task.status,
          text: task.debugoutput || task.outputs?.[0]?.url || '',
        })
      }

      return task?.status
    } catch (err: any) {
      setError(err.message || 'Unknown error')
      return null
    } finally {
      setPolling(false)
    }
  }

  const handleCreateChatResponse = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setTaskDetail(null)

    try {
      const response = await fetch('/api/wiro/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createChatResponse',
          prompt,
          user_id: userId,
          session_id: sessionId,
          system_prompt: systemPrompt,
          selectedModel,
          pollIntervalMs: 1000,
          timeoutMs: 60000,
        }),
      })

      const json: TestResult = await response.json()

      if (!json.success) {
        throw new Error(json.error || 'Failed to create chat response')
      }

      setResult({
        taskid: json.data?.run?.taskid,
        status: json.data?.task?.status,
        text: json.data?.text,
      })
      setTaskDetail(json.data?.detail)
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handlePollTask = async () => {
    if (!result?.taskid) return

    setPolling(true)
    const interval = setInterval(async () => {
      const status = await handleGetTaskDetail(result.taskid!)
      if (status === 'task_postprocess_end' || status === 'task_cancel' || status === 'error') {
        clearInterval(interval)
        setPolling(false)
      }
    }, 2000)

    // Timeout after 60 seconds
    setTimeout(() => {
      clearInterval(interval)
      setPolling(false)
    }, 60000)
  }

  const getStatusIcon = (status?: string) => {
    if (!status) return null
    if (status === 'task_postprocess_end') return <CheckCircle2 className="text-green-500" size={20} />
    if (status === 'task_cancel' || status === 'error') return <XCircle className="text-red-500" size={20} />
    return <Clock className="text-yellow-500" size={20} />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy dark:text-white">Wiro Test Sayfası</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Test Parametreleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                rows={3}
                placeholder="Kullanıcı mesajı..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                System Prompt
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                rows={3}
                placeholder="Sistem promptu..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Session ID
                </label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selected Model
              </label>
              <input
                type="text"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                placeholder="617"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Temperature
                </label>
                <input
                  type="text"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Top P
                </label>
                <input
                  type="text"
                  value={topP}
                  onChange={(e) => setTopP(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Top K
                </label>
                <input
                  type="text"
                  value={topK}
                  onChange={(e) => setTopK(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Seed
                </label>
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Tokens
                </label>
                <input
                  type="text"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Tokens
                </label>
                <input
                  type="text"
                  value={minTokens}
                  onChange={(e) => setMinTokens(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Repetition Penalty
                </label>
                <input
                  type="text"
                  value={repetitionPenalty}
                  onChange={(e) => setRepetitionPenalty(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Length Penalty
                </label>
                <input
                  type="text"
                  value={lengthPenalty}
                  onChange={(e) => setLengthPenalty(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-navy-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useWebSocket"
                  checked={useWebSocket}
                  onChange={(e) => setUseWebSocket(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="useWebSocket" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  WebSocket ile dinle (Task başlatıldığında otomatik bağlan)
                </label>
              </div>
              
              {socketAccessToken && (
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Socket Token: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{socketAccessToken}</code>
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={handleRunTask}
                  disabled={loading || polling}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Task Başlatılıyor...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Task Başlat
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCreateChatResponse}
                  disabled={loading || polling}
                  className="flex-1"
                  variant="outline"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tam Yanıt Alınıyor...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Tam Yanıt Al
                    </>
                  )}
                </Button>
              </div>
              
              {socketAccessToken && (
                <div className="flex gap-2">
                  {!wsConnected ? (
                    <Button
                      onClick={() => connectWebSocket(socketAccessToken, result?.taskid)}
                      disabled={!socketAccessToken}
                      className="flex-1"
                      variant="outline"
                    >
                      <WifiOff className="mr-2 h-4 w-4" />
                      WebSocket Bağlan
                    </Button>
                  ) : (
                    <Button
                      onClick={disconnectWebSocket}
                      className="flex-1"
                      variant="outline"
                    >
                      <Wifi className="mr-2 h-4 w-4" />
                      WebSocket Bağlantısını Kapat
                    </Button>
                  )}
                </div>
              )}
            </div>

            {result?.taskid && (
              <Button
                onClick={handlePollTask}
                disabled={polling}
                className="w-full"
                variant="outline"
              >
                {polling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Durum Kontrol Ediliyor...
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Durumu Kontrol Et
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Sonuçlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-800 dark:text-red-200 font-medium">Hata:</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(result.status)}
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                      Durum: {result.status || 'Bilinmiyor'}
                    </p>
                  </div>
                  {result.taskid && (
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Task ID: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">{result.taskid}</code>
                    </p>
                  )}
                </div>

                {result.text && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="font-medium text-green-800 dark:text-green-200 mb-2">Yanıt:</p>
                    <p className="text-green-700 dark:text-green-300 whitespace-pre-wrap">{result.text}</p>
                  </div>
                )}
              </div>
            )}

            {taskDetail && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-md">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Task Detayları:</p>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-96">
                  {JSON.stringify(taskDetail, null, 2)}
                </pre>
              </div>
            )}

            {!result && !error && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-md text-center">
                <p className="text-gray-500 dark:text-gray-400">Henüz test yapılmadı</p>
              </div>
            )}
            
            {/* WebSocket Messages */}
            {wsMessages.length > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-purple-800 dark:text-purple-200">
                    WebSocket Mesajları
                    {wsConnected && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                        (Bağlı)
                      </span>
                    )}
                  </p>
                  <Button
                    onClick={() => setWsMessages([])}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    Temizle
                  </Button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {wsMessages.map((msg, idx) => (
                    <p key={idx} className="text-xs text-purple-600 dark:text-purple-300 font-mono">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
