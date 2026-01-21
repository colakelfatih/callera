'use client'

import React, { useState } from 'react'
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

export default function InboxClient({ initialMessages }: Props) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(initialMessages[0] || null)
  const [filter, setFilter] = useState('all')
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const t = useTranslations('inbox')

  const filteredMessages = filter === 'all'
    ? initialMessages
    : initialMessages.filter(msg => msg.channel === filter)

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowMobileDetail(true)
    }
  }

  const getChannelDisplayName = (channel: string) => {
    if (channel === 'facebook_dm') return 'Facebook'
    return channel.charAt(0).toUpperCase() + channel.slice(1)
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Conversations List */}
      <div className={`w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${showMobileDetail ? 'hidden' : 'flex'} lg:flex`}>
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">{t('title')}</h1>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Filter size={16} className="mr-2" />
              {t('filter')}
            </Button>
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
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="text-gray-400 mb-2" size={32} />
              <p className="text-gray-600 dark:text-gray-400">{t('noMessages') || 'No messages yet'}</p>
            </div>
          ) : (
            filteredMessages.map((message) => {
              const ChannelIcon = channelIcons[message.channel as keyof typeof channelIcons] || MessageSquare
              const displayName = message.senderName || message.senderId || 'Unknown'

              return (
                <div
                  key={message.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 ${
                    selectedMessage?.id === message.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={displayName} size="sm" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-navy dark:text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp || message.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded ${channelColors[message.channel as keyof typeof channelColors] || 'bg-gray-100 text-gray-700'}`}>
                          <ChannelIcon size={12} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {getChannelDisplayName(message.channel)}
                        </span>
                        {message.status === 'pending' && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <Badge
                          variant={message.status === 'completed' ? 'success' : message.status === 'failed' ? 'error' : 'default'}
                          className="text-xs"
                        >
                          {message.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {message.messageText}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Mobile Conversation Detail */}
      {showMobileDetail && (
        <div className="lg:hidden flex-1 flex flex-col">
          {selectedMessage && (
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
                    <Avatar name={selectedMessage.senderName || selectedMessage.senderId || 'Unknown'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-navy dark:text-white truncate">
                        {selectedMessage.senderName || selectedMessage.senderId}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {getChannelDisplayName(selectedMessage.channel)}
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
                          variant={selectedMessage.status === 'completed' ? 'success' : selectedMessage.status === 'failed' ? 'error' : 'default'}
                        >
                          {selectedMessage.status}
                        </Badge>
                        <Badge variant="info" className="text-xs capitalize">
                          {selectedMessage.channel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {selectedMessage.messageText}
                        </p>
                      </div>

                      {selectedMessage.aiResponse && (
                        <div>
                          <h4 className="font-semibold text-navy dark:text-white mb-2">{t('aiResponse') || 'AI Response'}</h4>
                          <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {selectedMessage.aiResponse}
                            </p>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-navy dark:text-white mb-2">Message Details</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>ID: {selectedMessage.channelMessageId}</p>
                          <p>Type: {selectedMessage.messageType}</p>
                          <p>Received: {formatTime(selectedMessage.timestamp || selectedMessage.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* Desktop Conversation Detail */}
      <div className="hidden lg:flex lg:flex-1 flex-col">
        {selectedMessage ? (
          <>
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <Avatar name={selectedMessage.senderName || selectedMessage.senderId || 'Unknown'} size="lg" />
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-navy dark:text-white">
                      {selectedMessage.senderName || selectedMessage.senderId}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {getChannelDisplayName(selectedMessage.channel)}
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
                        variant={selectedMessage.status === 'completed' ? 'success' : selectedMessage.status === 'failed' ? 'error' : 'default'}
                      >
                        {selectedMessage.status}
                      </Badge>
                      <Badge variant="info" className="text-xs capitalize">
                        {selectedMessage.channel}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedMessage.messageText}
                      </p>
                    </div>

                    {selectedMessage.aiResponse && (
                      <div>
                        <h4 className="font-semibold text-navy dark:text-white mb-2">{t('aiResponse') || 'AI Response'}</h4>
                        <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {selectedMessage.aiResponse}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-navy dark:text-white mb-2">Message Details</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>ID: {selectedMessage.channelMessageId}</p>
                          <p>Type: {selectedMessage.messageType}</p>
                          <p>Received: {formatTime(selectedMessage.timestamp || selectedMessage.createdAt)}</p>
                        </div>
                      </div>
                    </div>
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
