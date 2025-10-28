'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { mockConversations, mockContacts } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'
import { MessageSquare, Phone, Mail, Instagram, Filter, Search, X } from 'lucide-react'

const channelIcons = {
  email: Mail,
  whatsapp: MessageSquare,
  instagram: Instagram,
  phone: Phone
}

const channelColors = {
  email: 'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
  instagram: 'bg-pink-100 text-pink-700',
  phone: 'bg-purple-100 text-purple-700'
}

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [filter, setFilter] = useState('all')
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  const filteredConversations = filter === 'all'
    ? mockConversations
    : mockConversations.filter(conv => conv.channel === filter)

  const getContact = (contactId: string) =>
    mockContacts.find(contact => contact.id === contactId)

  const handleSelectConversation = (conversation: typeof mockConversations[0]) => {
    setSelectedConversation(conversation)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowMobileDetail(true)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Conversations List */}
      <div className={`w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${showMobileDetail ? 'hidden' : 'flex'} lg:flex`}>
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Inbox</h1>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['all', 'email', 'whatsapp', 'instagram', 'phone'].map((channel) => (
              <Button
                key={channel}
                variant={filter === channel ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(channel)}
                className="capitalize whitespace-nowrap"
              >
                {channel}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const contact = getContact(conversation.contactId)
            const ChannelIcon = channelIcons[conversation.channel]

            return (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 ${selectedConversation?.id === conversation.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={contact?.name || 'Unknown'} size="sm" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-navy dark:text-white truncate">
                        {contact?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(conversation.timestamp)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${channelColors[conversation.channel]}`}>
                        <ChannelIcon size={12} />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {conversation.channel}
                      </span>
                      {!conversation.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {conversation.content}
                    </p>

                    <div className="flex gap-1 mt-2">
                      {conversation.labels.map((label) => (
                        <Badge key={label} variant="info" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Conversation Detail */}
      {showMobileDetail && (
        <div className="lg:hidden flex-1 flex flex-col">
          {selectedConversation && (
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
                    <Avatar name={getContact(selectedConversation.contactId)?.name || 'Unknown'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-navy dark:text-white truncate">
                        {getContact(selectedConversation.contactId)?.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {getContact(selectedConversation.contactId)?.company}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone size={16} className="mr-2" />
                    Call
                  </Button>
                  <Button size="sm" className="flex-1">
                    Reply
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-navy-900">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-lg">Conversation</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant={selectedConversation.sentiment === 'positive' ? 'success' : selectedConversation.sentiment === 'negative' ? 'error' : 'default'}>
                          {selectedConversation.sentiment}
                        </Badge>
                        <Badge variant={selectedConversation.priority === 'high' ? 'error' : selectedConversation.priority === 'medium' ? 'warning' : 'default'}>
                          {selectedConversation.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedConversation.content}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-navy dark:text-white mb-2">Auto Labels</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedConversation.labels.map((label) => (
                              <Badge key={label} variant="info" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-navy dark:text-white mb-2">AI Summary</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Customer is interested in scheduling a demo and discussing pricing options.
                          </p>
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
        {selectedConversation ? (
          <>
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <Avatar name={getContact(selectedConversation.contactId)?.name || 'Unknown'} size="lg" />
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-navy dark:text-white">
                      {getContact(selectedConversation.contactId)?.name}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {getContact(selectedConversation.contactId)?.company}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone size={16} className="mr-2" />
                    Call
                  </Button>
                  <Button size="sm">
                    Reply
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg">Conversation</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant={selectedConversation.sentiment === 'positive' ? 'success' : selectedConversation.sentiment === 'negative' ? 'error' : 'default'}>
                        {selectedConversation.sentiment}
                      </Badge>
                      <Badge variant={selectedConversation.priority === 'high' ? 'error' : selectedConversation.priority === 'medium' ? 'warning' : 'default'}>
                        {selectedConversation.priority} priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedConversation.content}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-navy dark:text-white mb-2">Auto Labels</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedConversation.labels.map((label) => (
                            <Badge key={label} variant="info" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-navy dark:text-white mb-2">AI Summary</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Customer is interested in scheduling a demo and discussing pricing options.
                        </p>
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
                Select a conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a conversation from the list to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
