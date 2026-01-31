'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { Users, Plus, Search, Mail, Calendar, Tag, X } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Snackbar, useSnackbar } from '@/components/ui/snackbar'
import type { Contact, ContactTag } from '@prisma/client'

type ContactWithTags = Contact & {
  tags: ContactTag[]
}

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const statusColors = {
  lead: 'bg-yellow-100 text-yellow-700',
  prospect: 'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700'
}

// Predefined tag colors
const tagColors = [
  { name: 'Mor', value: '#8b5cf6' },
  { name: 'Mavi', value: '#3b82f6' },
  { name: 'Yeşil', value: '#22c55e' },
  { name: 'Sarı', value: '#eab308' },
  { name: 'Turuncu', value: '#f97316' },
  { name: 'Kırmızı', value: '#ef4444' },
  { name: 'Pembe', value: '#ec4899' },
  { name: 'Turkuaz', value: '#14b8a6' },
]

export default function CRMPage() {
  const [selectedContact, setSelectedContact] = useState<ContactWithTags | null>(null)
  const [filter, setFilter] = useState('all')
  const [contacts, setContacts] = useState<ContactWithTags[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingTag, setSavingTag] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [selectedTagColor, setSelectedTagColor] = useState('#8b5cf6')
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null)
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar()
  const t = useTranslations('crm')
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  // Fetch contacts from API
  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filter !== 'all') params.append('filter', filter)
        if (searchQuery) params.append('search', searchQuery)
        
        const response = await fetch(`/api/contacts?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch contacts')
        
        const data = await response.json()
        setContacts(data.contacts || [])
        
        // Set first contact as selected if available
        if (data.contacts && data.contacts.length > 0 && !selectedContact) {
          setSelectedContact(data.contacts[0])
        }
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [filter, searchQuery])

  const handleWhatsAppClick = (phone: string | null, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card selection
    if (phone) {
      router.push(`/${locale}/dashboard/inbox?phone=${encodeURIComponent(phone)}&channel=whatsapp`)
    }
  }

  const handleAddContact = async (data: { name: string; phone: string; email?: string; company?: string; status: string }) => {
    setSaving(true)
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create contact')

      const newContact = await response.json()
      
      // Refresh contacts list
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('filter', filter)
      if (searchQuery) params.append('search', searchQuery)
      
      const refreshResponse = await fetch(`/api/contacts?${params.toString()}`)
      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        setContacts(data.contacts || [])
      }

      setShowAddModal(false)
      showSnackbar(t('contactAdded'), 'success')
    } catch (error) {
      console.error('Error creating contact:', error)
      showSnackbar(t('contactAddError'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = async () => {
    if (!selectedContact || !newTagName.trim()) return
    
    setSavingTag(true)
    try {
      const response = await fetch(`/api/contacts/${selectedContact.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: newTagName.trim(), color: selectedTagColor }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add tag')
      }

      const { tag } = await response.json()
      
      // Update selected contact's tags
      setSelectedContact(prev => prev ? {
        ...prev,
        tags: [...prev.tags, tag]
      } : null)

      // Update contacts list
      setContacts(prev => prev.map(c => 
        c.id === selectedContact.id 
          ? { ...c, tags: [...c.tags, tag] }
          : c
      ))

      setNewTagName('')
      setShowTagModal(false)
      showSnackbar(t('tagAdded'), 'success')
    } catch (error: any) {
      console.error('Error adding tag:', error)
      showSnackbar(t('tagAddError'), 'error')
    } finally {
      setSavingTag(false)
    }
  }

  const handleRemoveTag = async (tagId: string) => {
    if (!selectedContact) return
    
    try {
      const response = await fetch(`/api/contacts/${selectedContact.id}/tags?tagId=${tagId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove tag')

      // Update selected contact's tags
      setSelectedContact(prev => prev ? {
        ...prev,
        tags: prev.tags.filter(t => t.id !== tagId)
      } : null)

      // Update contacts list
      setContacts(prev => prev.map(c => 
        c.id === selectedContact.id 
          ? { ...c, tags: c.tags.filter(t => t.id !== tagId) }
          : c
      ))
      showSnackbar(t('tagRemoved'), 'success')
    } catch (error) {
      console.error('Error removing tag:', error)
      showSnackbar(t('tagRemoveError'), 'error')
    }
  }

  // Get all unique tags from contacts
  const allTags = React.useMemo(() => {
    const tagMap = new Map<string, { tag: string; color: string; count: number }>()
    contacts.forEach(contact => {
      contact.tags?.forEach(t => {
        if (tagMap.has(t.tag)) {
          tagMap.get(t.tag)!.count++
        } else {
          tagMap.set(t.tag, { tag: t.tag, color: t.color || '#6366f1', count: 1 })
        }
      })
    })
    return Array.from(tagMap.values()).sort((a, b) => b.count - a.count)
  }, [contacts])

  // Filter contacts by selected tag
  const filteredContacts = React.useMemo(() => {
    if (!selectedTagFilter) return contacts
    return contacts.filter(contact => 
      contact.tags?.some(t => t.tag === selectedTagFilter)
    )
  }, [contacts, selectedTagFilter])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 px-4 md:px-6 py-4 shrink-0">
        {/* Search and Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="w-full sm:w-auto sm:min-w-[200px] lg:max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="h-10 w-full rounded-lg border-none bg-gray-50 dark:bg-navy-700 pl-10 pr-4 text-sm text-navy dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder={t('searchContacts')}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-3 text-navy dark:text-white border border-gray-200 dark:border-gray-600">
              <Calendar size={16} />
              <input
                type="date"
                className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer w-[130px]"
                placeholder={t('dateRange')}
              />
            </div>
            <div className="relative z-50">
              <button 
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 transition-colors ${
                  selectedTagFilter 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-50 dark:bg-navy-700 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Tag size={16} />
                <p className="text-sm font-medium hidden sm:block">
                  {selectedTagFilter || t('tags')}
                </p>
                <svg className={`w-4 h-4 transition-transform ${showTagDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              
              {/* Tag Dropdown */}
              {showTagDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowTagDropdown(false)} 
                  />
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[200px] z-50 animate-modal-pop">
                    {/* Clear filter option */}
                    <button
                      onClick={() => {
                        setSelectedTagFilter(null)
                        setShowTagDropdown(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-navy-700 flex items-center gap-2 ${
                        !selectedTagFilter ? 'bg-gray-100 dark:bg-navy-700' : ''
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="text-gray-700 dark:text-gray-300">{t('allTags')}</span>
                    </button>
                    
                    {allTags.length > 0 ? (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        {allTags.map((tag) => (
                          <button
                            key={tag.tag}
                            onClick={() => {
                              setSelectedTagFilter(tag.tag)
                              setShowTagDropdown(false)
                            }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-navy-700 flex items-center gap-2 ${
                              selectedTagFilter === tag.tag ? 'bg-gray-100 dark:bg-navy-700' : ''
                            }`}
                          >
                            <span 
                              className="w-3 h-3 rounded-full shrink-0" 
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">{tag.tag}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">({tag.count})</span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('noTags')}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
          {['all', 'lead', 'prospect', 'customer', 'closed'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize whitespace-nowrap text-xs sm:text-sm"
            >
              {t(status as 'all' | 'lead' | 'prospect' | 'customer' | 'closed')}
            </Button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Contacts List */}
          <div className="xl:col-span-2">
            <Card className="w-full">
            <CardHeader className="w-full">
              <div className="flex items-center justify-between gap-2 w-full min-w-0">
                <CardTitle className="truncate flex-1 min-w-0">{t('contacts')}</CardTitle>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors shrink-0"
                >
                  <Plus size={16} />
                  {t('addContact')}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Müşteri bulunamadı</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors ${
                        selectedContact?.id === contact.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar name={contact.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy dark:text-white truncate text-sm sm:text-base">
                            {contact.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {contact.company || contact.phone || ''}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                            {t('lastContact')}: {formatDate(contact.lastContact)}
                          </p>
                          {/* Contact Tags */}
                          {contact.tags && contact.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {contact.tags.slice(0, 3).map((tag) => (
                                <button
                                  key={tag.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedTagFilter(tag.tag)
                                  }}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-white hover:opacity-80 transition-opacity"
                                  style={{ backgroundColor: tag.color || '#6366f1' }}
                                >
                                  {tag.tag}
                                </button>
                              ))}
                              {contact.tags.length > 3 && (
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  +{contact.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 ml-[52px] sm:ml-0">
                        <Badge 
                          variant="default" 
                          className={`text-xs ${statusColors[contact.status as keyof typeof statusColors] || statusColors.lead}`}
                        >
                          {t(contact.status as 'lead' | 'prospect' | 'customer' | 'closed')}
                        </Badge>
                        
                        <div className="flex gap-1 items-center">
                          {contact.email && (
                            <Button variant="ghost" size="sm" className="p-2 h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <Mail size={16} />
                            </Button>
                          )}
                          {contact.phone && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-2 h-8 w-8" 
                              onClick={(e) => handleWhatsAppClick(contact.phone, e)}
                              title="WhatsApp"
                            >
                              <WhatsAppIcon size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            </Card>
          </div>

        {/* Contact Detail - Desktop */}
        <div className="hidden xl:block">
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
                    {selectedContact.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{selectedContact.email}</span>
                      </div>
                    )}
                    {selectedContact.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-400">{selectedContact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Status</h4>
                  <Badge 
                    variant="default" 
                    className={`text-sm ${statusColors[selectedContact.status as keyof typeof statusColors] || statusColors.lead}`}
                  >
                    {t(selectedContact.status as 'lead' | 'prospect' | 'customer' | 'closed')}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-navy dark:text-white">Etiketler</h4>
                    <button
                      onClick={() => setShowTagModal(true)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-colors"
                      title="Etiket Ekle"
                    >
                      <Plus size={16} className="text-primary" />
                    </button>
                  </div>
                  {selectedContact.tags && selectedContact.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedContact.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: tag.color || '#6366f1' }}
                        >
                          {tag.tag}
                          <button
                            onClick={() => handleRemoveTag(tag.id)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Henüz etiket yok</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">{t('lastContact')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(selectedContact.lastContact)}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center">
                    <Mail size={16} className="mr-2" />
                    Email
                  </Button>
                  {selectedContact.phone && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(`/${locale}/dashboard/inbox?phone=${encodeURIComponent(selectedContact.phone!)}&channel=whatsapp`)
                      }}
                    >
                      <WhatsAppIcon size={16} className="mr-2" />
                      WhatsApp
                    </Button>
                  )}
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
        
        {/* Contact Detail - Mobile Bottom Sheet */}
        {selectedContact && (
          <div className="xl:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedContact(null)}>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1E1E1E] rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="sticky top-0 bg-white dark:bg-[#1E1E1E] pt-3 pb-2 px-4">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto" />
              </div>
              
              <div className="px-4 pb-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar name={selectedContact.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-navy dark:text-white truncate">{selectedContact.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{selectedContact.company}</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white mb-2 text-sm">{t('contactInfo')}</h4>
                    <div className="space-y-2 text-sm">
                      {selectedContact.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400 shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400 truncate">{selectedContact.email}</span>
                        </div>
                      )}
                      {selectedContact.phone && (
                        <div className="flex items-center gap-2">
                          <WhatsAppIcon size={16} className="text-gray-400 shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{selectedContact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white mb-2 text-sm">Status</h4>
                    <Badge 
                      variant="default" 
                      className={`text-sm ${statusColors[selectedContact.status as keyof typeof statusColors] || statusColors.lead}`}
                    >
                      {t(selectedContact.status as 'lead' | 'prospect' | 'customer' | 'closed')}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-navy dark:text-white text-sm">Etiketler</h4>
                      <button
                        onClick={() => setShowTagModal(true)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-colors"
                        title="Etiket Ekle"
                      >
                        <Plus size={14} className="text-primary" />
                      </button>
                    </div>
                    {selectedContact.tags && selectedContact.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedContact.tags.map((tag) => (
                          <span 
                            key={tag.id} 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: tag.color || '#6366f1' }}
                          >
                            {tag.tag}
                            <button
                              onClick={() => handleRemoveTag(tag.id)}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Henüz etiket yok</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center">
                      <Mail size={16} className="mr-2" />
                      Email
                    </Button>
                    {selectedContact.phone && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex-1 flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(`/${locale}/dashboard/inbox?phone=${encodeURIComponent(selectedContact.phone!)}&channel=whatsapp`)
                        }}
                      >
                        <WhatsAppIcon size={16} className="mr-2" />
                        WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white dark:bg-navy-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-navy-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy dark:text-white">Yeni Kişi Ekle</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Müşteri listesine yeni kişi ekle</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form 
              className="p-6"
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('name') as string
                const phone = formData.get('phone') as string
                const email = formData.get('email') as string
                const company = formData.get('company') as string
                const status = formData.get('status') as string
                
                if (name && phone) {
                  handleAddContact({ name, phone, email: email || undefined, company: company || undefined, status })
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    placeholder="Kişi adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    placeholder="+90 555 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Şirket
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    placeholder="Şirket adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Durum
                  </label>
                  <select
                    name="status"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    defaultValue="lead"
                  >
                    <option value="lead">{t('lead')}</option>
                    <option value="prospect">{t('prospect')}</option>
                    <option value="customer">{t('customer')}</option>
                    <option value="closed">{t('closed')}</option>
                  </select>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-600 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {saving ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {showTagModal && selectedContact && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowTagModal(false)
            setNewTagName('')
          }}
        >
          <div 
            className="bg-white dark:bg-navy-800 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-navy-900 border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy dark:text-white">Etiket Ekle</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedContact.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowTagModal(false)
                  setNewTagName('')
                }}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Etiket Adı
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Örn: VIP, Yeni Müşteri"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Renk Seç
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedTagColor(color.value)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedTagColor === color.value 
                          ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-navy-800' 
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {newTagName.trim() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Önizleme
                  </label>
                  <span 
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: selectedTagColor }}
                  >
                    {newTagName.trim()}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                type="button"
                onClick={() => {
                  setShowTagModal(false)
                  setNewTagName('')
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-600 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!newTagName.trim() || savingTag}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingTag ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Tag size={16} />
                )}
                {savingTag ? 'Ekleniyor...' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </div>
  )
}
