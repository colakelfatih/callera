'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/utils'
import { MessageSquare, Phone, Mail, Instagram, Filter, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

const channelIcons = {
  email: Mail,
  whatsapp: MessageSquare,
  instagram: Instagram,
  phone: Phone,
  facebook_dm: MessageSquare,
}

const channelColors = {
  email: 'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
  instagram: 'bg-pink-100 text-pink-700',
  phone: 'bg-purple-100 text-purple-700',
  facebook_dm: 'bg-blue-100 text-blue-700',
}

type Message = {
  id: string
  channel: string
  channelMessageId: string
  connectionId?: string | null
  isFromBusiness: boolean
  senderId: string
  senderName: string | null
  messageText: string
  messageType: string
  status: string
  aiResponse: string | null
  timestamp: Date | string | null
  createdAt: Date | string
}

type Props = {
  initialMessages: Message[]
}

type Thread = {
  id: string
  channel: string
  senderId: string
  senderName: string | null
  connectionId: string | null
  lastAt: Date | string
  lastText: string
  pendingCount: number
  messages: Message[]
}

function threadIdFor(m: Message) {
  // no ':' (BullMQ restriction does not apply here, but keep it simple)
  return `${m.channel}|${m.senderId}|${m.connectionId ?? ''}`
}

function messageSortKey(m: Message) {
  return m.timestamp ?? m.createdAt
}

function toDateValue(v: Date | string | null | undefined) {
  if (!v) return 0
  const d = typeof v === 'string' ? new Date(v) : v
  return d.getTime()
}

export default function InboxClient({ initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [realtimeConnected, setRealtimeConnected] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const t = useTranslations('inbox')

  const seenIdsRef = useRef<Set<string>>(new Set(initialMessages.map((m) => m.id)))
  const threadCursorRef = useRef<Record<string, string | null>>({})
  const threadHasMoreRef = useRef<Record<string, boolean>>({})
  const topSentinelRef = useRef<HTMLDivElement | null>(null)

  const threads = useMemo<Thread[]>(() => {
    const map = new Map<string, Thread>()

    for (const m of messages) {
      const tid = threadIdFor(m)
      const existing = map.get(tid)
      const pendingDelta = m.status === 'pending' ? 1 : 0

      if (!existing) {
        map.set(tid, {
          id: tid,
          channel: m.channel,
          senderId: m.senderId,
          senderName: m.senderName,
          connectionId: m.connectionId ?? null,
          lastAt: messageSortKey(m) ?? m.createdAt,
          lastText: m.messageText,
          pendingCount: pendingDelta,
          messages: [m],
        })
      } else {
        existing.messages.push(m)
        existing.pendingCount += pendingDelta

        const existingLast = toDateValue(existing.lastAt)
        const candidateLast = toDateValue(messageSortKey(m) ?? m.createdAt)
        if (candidateLast >= existingLast) {
          existing.lastAt = messageSortKey(m) ?? m.createdAt
          existing.lastText = m.messageText
          existing.senderName = m.senderName ?? existing.senderName
        }
      }
    }

    const list = Array.from(map.values())
    list.sort((a, b) => toDateValue(b.lastAt) - toDateValue(a.lastAt))
    return filter === 'all' ? list : list.filter((th) => th.channel === filter)
  }, [filter, messages])

  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id)
    }
  }, [selectedThreadId, threads])

  const selectedThread = useMemo(() => {
    const th = threads.find((x) => x.id === selectedThreadId) ?? null
    if (!th) return null
    // messages oldest -> newest
    const sorted = [...th.messages].sort((a, b) => {
      return toDateValue(messageSortKey(a) ?? a.createdAt) - toDateValue(messageSortKey(b) ?? b.createdAt)
    })
    return { ...th, messages: sorted }
  }, [selectedThreadId, threads])

  const loadOlder = async () => {
    if (!selectedThread) return
    if (loadingMore) return

    const tid = selectedThread.id
    if (threadHasMoreRef.current[tid] === false) return

    const oldest = selectedThread.messages[0]
    const cursor = threadCursorRef.current[tid] ?? (oldest ? oldest.id : null)
    if (!cursor) return

    setLoadingMore(true)
    try {
      const sp = new URLSearchParams()
      sp.set('channel', selectedThread.channel)
      sp.set('senderId', selectedThread.senderId)
      if (selectedThread.connectionId) sp.set('connectionId', selectedThread.connectionId)
      sp.set('cursor', cursor)
      sp.set('limit', '50')

      const res = await fetch(`/api/messages/thread?${sp.toString()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      const fetched: Message[] = Array.isArray(data.messages) ? data.messages : []
      // fetched are newest->older (desc); merge and let derived sorting handle ordering
      let anyNew = false
      setMessages((prev) => {
        const next = [...prev]
        for (const m of fetched) {
          if (m?.id && !seenIdsRef.current.has(m.id)) {
            seenIdsRef.current.add(m.id)
            next.push(m)
            anyNew = true
          }
        }
        return next
      })

      threadCursorRef.current[tid] = data.nextCursor ?? null
      threadHasMoreRef.current[tid] = Boolean(data.hasMore)

      // If API returned no new rows, stop trying
      if (!anyNew && fetched.length === 0) {
        threadHasMoreRef.current[tid] = false
      }
    } catch {
      // ignore; keep UI resilient
    } finally {
      setLoadingMore(false)
    }
  }

  // Infinite scroll: when the top sentinel becomes visible, load older messages
  useEffect(() => {
    if (!selectedThreadId) return
    const el = topSentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadOlder()
        }
      },
      { root: null, threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [selectedThreadId, selectedThread?.messages.length, loadingMore])

  // SSE realtime stream
  const esRef = useRef<EventSource | null>(null)
  useEffect(() => {
    let retryTimer: any = null

    const connect = () => {
      if (esRef.current) esRef.current.close()
      const es = new EventSource('/api/messages/stream')
      esRef.current = es

      es.addEventListener('ready', () => setRealtimeConnected(true))

      es.addEventListener('message', (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data) as any
          const incoming: Message = {
            id: data.id,
            channel: data.channel,
            channelMessageId: data.channelMessageId,
            connectionId: data.connectionId ?? null,
            isFromBusiness: Boolean(data.isFromBusiness),
            senderId: data.senderId,
            senderName: data.senderName ?? null,
            messageText: data.messageText,
            messageType: data.messageType,
            status: data.status,
            aiResponse: data.aiResponse ?? null,
            timestamp: data.timestamp ?? null,
            createdAt: data.createdAt,
          }

          if (seenIdsRef.current.has(incoming.id)) return
          seenIdsRef.current.add(incoming.id)
          setMessages((prev) => [incoming, ...prev])
          // if nothing selected yet, select this thread
          setSelectedThreadId((prevSelected) => prevSelected ?? threadIdFor(incoming))
        } catch {
          // ignore malformed payload
        }
      })

      es.onerror = () => {
        setRealtimeConnected(false)
        // EventSource auto-reconnects, but we add backoff to avoid tight loops in some proxies
        if (!retryTimer) {
          retryTimer = setTimeout(() => {
            retryTimer = null
            connect()
          }, 1500)
        }
      }
    }

    connect()
    return () => {
      if (retryTimer) clearTimeout(retryTimer)
      esRef.current?.close()
      esRef.current = null
    }
  }, [])

  const getChannelDisplayName = (channel: string) => {
    if (channel === 'facebook_dm') return 'Facebook'
    return channel.charAt(0).toUpperCase() + channel.slice(1)
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Threads List */}
      <div className={`w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${showMobileDetail ? 'hidden' : 'flex'} lg:flex`}>
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">{t('title')}</h1>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Filter size={16} className="mr-2" />
              {t('filter')}
            </Button>
          </div>

          {/* Small realtime indicator only (no i18n key spam) */}
          <div className="flex items-center gap-2 mb-3" title={realtimeConnected ? 'Realtime connected' : 'Realtime reconnecting'}>
            <div className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['all', 'whatsapp', 'instagram', 'facebook_dm'].map((channel) => (
              <Button
                key={channel}
                variant={filter === channel ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(channel)}
                className="capitalize whitespace-nowrap"
              >
                {getChannelDisplayName(channel)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="text-gray-400 mb-2" size={32} />
              <p className="text-gray-600 dark:text-gray-400">{t('noMessages') || 'No messages yet'}</p>
            </div>
          ) : (
            threads.map((thread) => {
              const ChannelIcon = channelIcons[thread.channel as keyof typeof channelIcons] || MessageSquare
              const displayName = thread.senderName || thread.senderId || 'Unknown'

              return (
                <div
                  key={thread.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 ${
                    selectedThreadId === thread.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedThreadId(thread.id)
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setShowMobileDetail(true)
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={displayName} size="sm" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-navy dark:text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(thread.lastAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded ${channelColors[thread.channel as keyof typeof channelColors] || 'bg-gray-100 text-gray-700'}`}>
                          <ChannelIcon size={12} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {getChannelDisplayName(thread.channel)}
                        </span>
                        {thread.pendingCount > 0 && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {thread.lastText}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Mobile Thread Detail */}
      {showMobileDetail && (
        <div className="lg:hidden flex-1 flex flex-col">
          {selectedThread && (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => setShowMobileDetail(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar name={selectedThread.senderName || selectedThread.senderId || 'Unknown'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-navy dark:text-white truncate">
                        {selectedThread.senderName || selectedThread.senderId}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {getChannelDisplayName(selectedThread.channel)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone size={16} className="mr-2" />
                    {t('call')}
                  </Button>
                  <Button size="sm" className="flex-1">
                    {t('reply')}
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-navy-900">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-lg">{t('conversation')}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          variant={selectedThread.pendingCount > 0 ? 'warning' : 'success'}
                        >
                          {selectedThread.pendingCount > 0 ? 'pending' : 'ok'}
                        </Badge>
                        <Badge variant="info" className="text-xs capitalize">
                          {selectedThread.channel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div ref={topSentinelRef} />
                      {loadingMore && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Loading older…</p>
                      )}
                      {selectedThread.messages.map((m) => (
                        <div key={m.id} className="space-y-2">
                          <div className={`flex ${m.isFromBusiness ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[85%] p-3 rounded-lg ${
                                m.isFromBusiness
                                  ? 'bg-primary/5 dark:bg-primary/10'
                                  : 'bg-gray-50 dark:bg-navy-700'
                              }`}
                            >
                              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{m.messageText}</p>
                              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                {formatTime(m.timestamp || m.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* Desktop Thread Detail */}
      <div className="hidden lg:flex lg:flex-1 flex-col">
        {selectedThread ? (
          <>
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <Avatar name={selectedThread.senderName || selectedThread.senderId || 'Unknown'} size="lg" />
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-navy dark:text-white">
                      {selectedThread.senderName || selectedThread.senderId}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {getChannelDisplayName(selectedThread.channel)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone size={16} className="mr-2" />
                    {t('call')}
                  </Button>
                  <Button size="sm">
                    {t('reply')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg">{t('conversation')}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        variant={selectedThread.pendingCount > 0 ? 'warning' : 'success'}
                      >
                        {selectedThread.pendingCount > 0 ? 'pending' : 'ok'}
                      </Badge>
                      <Badge variant="info" className="text-xs capitalize">
                        {selectedThread.channel}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div ref={topSentinelRef} />
                    {loadingMore && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Loading older…</p>
                    )}
                    {selectedThread.messages.map((m) => (
                      <div key={m.id} className="space-y-2">
                        <div className={`flex ${m.isFromBusiness ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[75%] p-3 rounded-lg ${
                              m.isFromBusiness
                                ? 'bg-primary/5 dark:bg-primary/10'
                                : 'bg-gray-50 dark:bg-navy-700'
                            }`}
                          >
                            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{m.messageText}</p>
                            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                              {formatTime(m.timestamp || m.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                {t('selectConversation')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('selectConversationDesc')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
