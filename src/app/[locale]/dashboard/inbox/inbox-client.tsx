'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/utils'
import { MessageSquare, Phone, Mail, Instagram, X, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

const channelIcons = {
  email: Mail,
  whatsapp: MessageSquare,
  instagram: Instagram,
  phone: Phone,
}

const channelColors = {
  email: 'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
  instagram: 'bg-pink-100 text-pink-700',
  phone: 'bg-purple-100 text-purple-700',
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
  const [composerText, setComposerText] = useState('')
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const t = useTranslations('inbox')

  const seenIdsRef = useRef<Set<string>>(new Set(initialMessages.map((m) => m.id)))
  const threadCursorRef = useRef<Record<string, string | null>>({})
  const threadHasMoreRef = useRef<Record<string, boolean>>({})
  const topSentinelRef = useRef<HTMLDivElement | null>(null)
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null)
  const shouldAutoScrollRef = useRef(false)
  const selectedThreadIdRef = useRef<string | null>(null)
  const mobileScrollRef = useRef<HTMLDivElement | null>(null)
  const desktopScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    selectedThreadIdRef.current = selectedThreadId
  }, [selectedThreadId])

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

  // Auto-scroll to bottom when new message arrives in the selected thread (but not while loading older)
  useEffect(() => {
    if (loadingMore) return
    if (!selectedThread) return
    if (!shouldAutoScrollRef.current) return
    shouldAutoScrollRef.current = false
    bottomSentinelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [loadingMore, selectedThread?.messages.length, selectedThreadId])

  // When switching threads, snap to bottom once so it feels like a chat app
  useEffect(() => {
    if (!selectedThread) return
    shouldAutoScrollRef.current = true
    // allow render to commit first, then force scroll container to bottom
    const tId = setTimeout(() => {
      const el = (showMobileDetail ? mobileScrollRef.current : desktopScrollRef.current) ?? null
      if (el) {
        el.scrollTop = el.scrollHeight
      } else {
        bottomSentinelRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
      }
    }, 0)
    return () => clearTimeout(tId)
  }, [selectedThreadId, showMobileDetail])

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
          // If this message belongs to currently selected thread, scroll down
          const currentSelected = selectedThreadIdRef.current
          if (currentSelected && threadIdFor(incoming) === currentSelected) {
            shouldAutoScrollRef.current = true
          }
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
    return channel.charAt(0).toUpperCase() + channel.slice(1)
  }

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchMode(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const params = new URLSearchParams({ q: query.trim() })
      if (filter !== 'all') {
        params.append('channel', filter)
      }
      
      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      
      const data = await res.json()
      // Store full hit data including highlights
      const results = (data.hits || []).map((hit: any) => ({
        id: hit.id,
        channel: hit.channel,
        channelMessageId: hit.id,
        connectionId: null,
        isFromBusiness: false,
        senderId: hit.senderId,
        senderName: hit.senderName,
        messageText: hit.messageText,
        messageType: 'text',
        status: 'completed',
        aiResponse: null,
        timestamp: hit.timestamp,
        createdAt: hit.createdAt,
        highlights: hit.highlights || [],
        textMatch: hit.textMatch || 0,
      }))
      
      setSearchResults(results)
      setSearchMode(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Render highlighted text (Typesense uses <mark> tags)
  const renderHighlightedText = (text: string, highlights: any[] = []) => {
    if (!highlights || highlights.length === 0) {
      // Fallback: simple word highlighting
      const queryWords = searchQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 0)
      if (queryWords.length === 0) return <span>{text}</span>
      
      const words = text.split(/(\s+)/)
      return (
        <>
          {words.map((word, i) => {
            const isMatch = queryWords.some((qw) => word.toLowerCase().includes(qw))
            return isMatch ? (
              <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded font-semibold">
                {word}
              </mark>
            ) : (
              <span key={i}>{word}</span>
            )
          })}
        </>
      )
    }

    // Typesense highlights format: { field: 'messageText', snippets: ['...<mark>...</mark>...'] }
    const messageHighlight = highlights.find((h: any) => h.field === 'messageText')
    if (messageHighlight && messageHighlight.snippets && messageHighlight.snippets.length > 0) {
      // Use the first snippet (most relevant)
      const snippet = messageHighlight.snippets[0]
      
      // Parse <mark> tags
      const parts: Array<{ text: string; highlighted: boolean }> = []
      let lastIndex = 0
      const regex = /<mark>(.*?)<\/mark>/g
      let match

      while ((match = regex.exec(snippet)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push({ text: snippet.substring(lastIndex, match.index), highlighted: false })
        }
        // Add highlighted text
        parts.push({ text: match[1], highlighted: true })
        lastIndex = match.index + match[0].length
      }
      
      // Add remaining text
      if (lastIndex < snippet.length) {
        parts.push({ text: snippet.substring(lastIndex), highlighted: false })
      }

      if (parts.length > 0) {
        return (
          <>
            {parts.map((part, i) =>
              part.highlighted ? (
                <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded font-semibold">
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </>
        )
      }
    }

    // Fallback to simple highlighting
    const queryWords = searchQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 0)
    const words = text.split(/(\s+)/)
    return (
      <>
        {words.map((word, i) => {
          const isMatch = queryWords.some((qw) => word.toLowerCase().includes(qw))
          return isMatch ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded font-semibold">
              {word}
            </mark>
          ) : (
            <span key={i}>{word}</span>
          )
        })}
      </>
    )
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      } else {
        setSearchMode(false)
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, filter])

  const sendMessage = async () => {
    if (!selectedThread) return
    const text = composerText.trim()
    if (!text) return
    setSending(true)
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: selectedThread.channel,
          senderId: selectedThread.senderId,
          connectionId: selectedThread.connectionId,
          text,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

      const outbound = data?.message as Message
      if (outbound?.id && !seenIdsRef.current.has(outbound.id)) {
        seenIdsRef.current.add(outbound.id)
        setMessages((prev) => [outbound, ...prev])
      }
      setComposerText('')
      shouldAutoScrollRef.current = true
    } catch {
      // ignore toast for now; keep UI minimal
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Threads List */}
      <div className={`w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${showMobileDetail ? 'hidden' : 'flex'} lg:flex`}>
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">{t('title')}</h1>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-gray-600 rounded-lg text-navy dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Small realtime indicator only (no i18n key spam) */}
          <div className="flex items-center gap-2 mb-3" title={realtimeConnected ? 'Realtime connected' : 'Realtime reconnecting'}>
            <div className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['all', 'whatsapp', 'instagram'].map((channel) => (
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
          {searchMode ? (
            // Search Results - Google/Algolia style
            searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search className="text-gray-400 mb-2" size={32} />
                <p className="text-gray-600 dark:text-gray-400">
                  {isSearching ? 'Aranıyor...' : 'Sonuç bulunamadı'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  "{searchQuery}" için <strong>{searchResults.length}</strong> sonuç bulundu
                </div>
                {searchResults.map((message: any) => {
                  const ChannelIcon = channelIcons[message.channel as keyof typeof channelIcons] || MessageSquare
                  const displayName = message.senderName || message.senderId || 'Unknown'
                  const threadId = threadIdFor(message)

                  return (
                    <div
                      key={message.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-navy-800"
                      onClick={() => {
                        setSelectedThreadId(threadId)
                        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                          setShowMobileDetail(true)
                        }
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar name={displayName} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-navy dark:text-white truncate">
                              {displayName}
                            </p>
                            <div className={`p-1 rounded ${channelColors[message.channel as keyof typeof channelColors] || 'bg-gray-100 text-gray-700'}`}>
                              <ChannelIcon size={12} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {getChannelDisplayName(message.channel)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatTime(message.timestamp || message.createdAt)}
                        </p>
                      </div>

                      {/* Message Text with Highlights */}
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {renderHighlightedText(message.messageText, message.highlights)}
                        </p>
                      </div>

                      {/* Footer with match score */}
                      {message.textMatch && (
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Eşleşme: {Math.round(message.textMatch * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          ) : threads.length === 0 ? (
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
                </div>
              </div>

              <div ref={mobileScrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-navy-900">
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
                      <div ref={bottomSentinelRef} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Always-on composer (chat app style) */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800">
                <div className="flex gap-2">
                  <input
                    className="input"
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    placeholder="Mesaj yaz…"
                    disabled={sending || !selectedThread}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={sending || !composerText.trim() || !selectedThread}>
                    {sending ? '...' : 'Send'}
                  </Button>
                </div>
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
                </div>
              </div>
            </div>

            <div ref={desktopScrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto">
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
                    <div ref={bottomSentinelRef} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Always-on composer (chat app style) */}
            <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800">
              <div className="flex gap-2">
                <input
                  className="input"
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="Mesaj yaz…"
                  disabled={sending || !selectedThread}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button onClick={sendMessage} disabled={sending || !composerText.trim() || !selectedThread}>
                  {sending ? '...' : 'Send'}
                </Button>
              </div>
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
