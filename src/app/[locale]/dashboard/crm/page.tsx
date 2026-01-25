'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { mockContacts } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Users, Plus, Search, Filter, Mail, MessageSquare } from 'lucide-react'
import type { Contact } from '@/lib/mock-data'
import { useTranslations } from 'next-intl'

const statusColors = {
  lead: 'bg-yellow-100 text-yellow-700',
  prospect: 'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700'
}

export default function CRMPage() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0])
  const [filter, setFilter] = useState('all')
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const t = useTranslations('crm')

  const filteredContacts = filter === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.status === filter)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy dark:text-white">{t('title')}</h1>
        <div className="flex items-center gap-4">
          <Button>
            <Plus size={16} className="mr-2" />
            {t('addContact')}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('searchContacts')}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'lead', 'prospect', 'customer', 'closed'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {t(status as 'all' | 'lead' | 'prospect' | 'customer' | 'closed')}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('contacts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 ${
                      selectedContact?.id === contact.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar name={contact.name} size="md" />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy dark:text-white truncate">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {contact.company}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {t('lastContact')}: {formatDate(contact.lastContact)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant="default" 
                        className={`text-xs ${statusColors[contact.status]}`}
                      >
                        {contact.status}
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="p-2">
                          <Mail size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                          <MessageSquare size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Detail */}
        <div>
          {selectedContact ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar name={selectedContact.name} size="lg" />
                  <div>
                    <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">{selectedContact.company}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">{t('contactInfo')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">{selectedContact.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Status</h4>
                  <Badge 
                    variant="default" 
                    className={`text-sm ${statusColors[selectedContact.status]}`}
                  >
                    {selectedContact.status}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedContact.tags.map((tag) => (
                      <Badge key={tag} variant="info" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">{t('lastContact')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(selectedContact.lastContact)}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail size={16} className="mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                  {t('selectContact')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('selectContactDesc')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
