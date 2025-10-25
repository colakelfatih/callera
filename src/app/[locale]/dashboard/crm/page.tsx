'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { mockContacts } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Users, Plus, Search, Filter, Phone, Mail, MessageSquare } from 'lucide-react'

const statusColors = {
  lead: 'bg-yellow-100 text-yellow-700',
  prospect: 'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700'
}

export default function CRMPage() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0])
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [filter, setFilter] = useState('all')

  const filteredContacts = filter === 'all' 
    ? mockContacts 
    : mockContacts.filter(contact => contact.status === filter)

  const kanbanColumns = [
    { id: 'lead', title: 'Leads', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { id: 'prospect', title: 'Prospects', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'customer', title: 'Customers', color: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'closed', title: 'Closed', color: 'bg-gray-50 dark:bg-gray-900/20' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy dark:text-white">CRM</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
            >
              List
            </Button>
            <Button
              variant={view === 'kanban' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('kanban')}
            >
              Kanban
            </Button>
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search contacts..."
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
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List/Kanban */}
        <div className="lg:col-span-2">
          {view === 'list' ? (
            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
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
                          Last contact: {formatDate(contact.lastContact)}
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
                            <Phone size={16} />
                          </Button>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kanbanColumns.map((column) => {
                const columnContacts = filteredContacts.filter(contact => contact.status === column.id)
                
                return (
                  <div key={column.id} className={`p-4 rounded-lg ${column.color}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-navy dark:text-white capitalize">
                        {column.title}
                      </h3>
                      <Badge variant="default" className="text-xs">
                        {columnContacts.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {columnContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="p-3 bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar name={contact.name} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-navy dark:text-white text-sm truncate">
                                {contact.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {contact.company}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="info" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Contact Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
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
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Last Contact</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(selectedContact.lastContact)}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Phone size={16} className="mr-2" />
                    Call
                  </Button>
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
                  Select a contact
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a contact to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
