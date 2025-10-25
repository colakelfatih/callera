'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { mockConversations, mockContacts } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'
import { MessageSquare, Phone, Mail, Instagram, Filter, Search } from 'lucide-react'

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

  const filteredConversations = filter === 'all' 
    ? mockConversations 
    : mockConversations.filter(conv => conv.channel === filter)

  const getContact = (contactId: string) => 
    mockContacts.find(contact => contact.id === contactId)

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-navy dark:text-white">Inbox</h1>
            <Button variant="ghost" size="sm">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex gap-2 mb-4">
            {['all', 'email', 'whatsapp', 'instagram', 'phone'].map((channel) => (
              <Button
                key={channel}
                variant={filter === channel ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(channel)}
                className="capitalize"
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
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 ${
                  selectedConversation?.id === conversation.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
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
      
      {/* Conversation Detail */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={getContact(selectedConversation.contactId)?.name || 'Unknown'} size="lg" />
                  <div>
                    <h2 className="text-xl font-bold text-navy dark:text-white">
                      {getContact(selectedConversation.contactId)?.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
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
            
            <div className="flex-1 p-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Conversation</CardTitle>
                    <div className="flex gap-2">
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
                    
                    <div className="grid grid-cols-2 gap-4">
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
