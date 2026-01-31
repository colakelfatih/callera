'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, Calendar, Tag, X, MessageSquare, Phone, Mail, Clock, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Contact, ContactTag } from '@prisma/client'

type ContactWithTags = Contact & {
  tags: ContactTag[]
}

interface Deal {
  id: string
  company: string | null
  contact: string
  phone: string | null
  value: string
  tags: Array<{ id: string; tag: string; color?: string }>
  status: 'lead' | 'prospect' | 'customer' | 'closed'
  avatar: string | null
}

interface PipelineColumn {
  id: string
  title: string
  count: number
  value: string
  deals: Deal[]
}

const tagColors = {
  'AI Suggestion': 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-200',
  'Enterprise': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200',
  'Follow-up': 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-200',
  'High Priority': 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200',
  'Closed': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
}

export default function CRMPipelinePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDealColumn, setNewDealColumn] = useState<string>('lead-in')
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [contactHistory, setContactHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [pipelineData, setPipelineData] = useState<PipelineColumn[]>([])
  const [loading, setLoading] = useState(true)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null)
  const t = useTranslations('crm')

  // Get all unique tags from pipeline data
  const allTags = React.useMemo(() => {
    const tagMap = new Map<string, { tag: string; color: string; count: number }>()
    pipelineData.forEach(column => {
      column.deals.forEach(deal => {
        deal.tags?.forEach(tag => {
          if (tagMap.has(tag.tag)) {
            tagMap.get(tag.tag)!.count++
          } else {
            tagMap.set(tag.tag, { tag: tag.tag, color: tag.color || '#6366f1', count: 1 })
          }
        })
      })
    })
    return Array.from(tagMap.values()).sort((a, b) => b.count - a.count)
  }, [pipelineData])

  // Filter pipeline data by selected tag
  const filteredPipelineData = React.useMemo(() => {
    if (!selectedTagFilter) return pipelineData
    return pipelineData.map(column => ({
      ...column,
      deals: column.deals.filter(deal => 
        deal.tags?.some(tag => tag.tag === selectedTagFilter)
      ),
      count: column.deals.filter(deal => 
        deal.tags?.some(tag => tag.tag === selectedTagFilter)
      ).length
    }))
  }, [pipelineData, selectedTagFilter])

  // Helper function to convert contacts to pipeline format
  const convertContactsToPipeline = (contacts: ContactWithTags[]): PipelineColumn[] => {
    // Group contacts by status
    const statusGroups: Record<string, ContactWithTags[]> = {
      'lead': [],
      'prospect': [],
      'customer': [],
      'closed': [],
    }

    contacts.forEach((contact) => {
      const status = contact.status || 'lead'
      if (statusGroups[status]) {
        statusGroups[status].push(contact)
      } else {
        statusGroups['lead'].push(contact)
      }
    })

    return [
      {
        id: 'lead-in',
        title: 'Gelen Müşteriler',
        count: statusGroups['lead'].length,
        value: '',
        deals: statusGroups['lead'].map((contact) => ({
          id: contact.id,
          company: contact.company || null,
          contact: contact.name,
          phone: contact.phone || null,
          value: '',
          tags: contact.tags || [],
          status: 'lead' as const,
          avatar: contact.avatar || null,
        })),
      },
      {
        id: 'contact-made',
        title: 'İletişim Kuruldu',
        count: statusGroups['prospect'].length,
        value: '',
        deals: statusGroups['prospect'].map((contact) => ({
          id: contact.id,
          company: contact.company || null,
          contact: contact.name,
          phone: contact.phone || null,
          value: '',
          tags: contact.tags || [],
          status: 'prospect' as const,
          avatar: contact.avatar || null,
        })),
      },
      {
        id: 'customer',
        title: 'Müşteri',
        count: statusGroups['customer'].length,
        value: '',
        deals: statusGroups['customer'].map((contact) => ({
          id: contact.id,
          company: contact.company || null,
          contact: contact.name,
          phone: contact.phone || null,
          value: '',
          tags: contact.tags || [],
          status: 'customer' as const,
          avatar: contact.avatar || null,
        })),
      },
      {
        id: 'won',
        title: 'Kazanıldı',
        count: statusGroups['closed'].length,
        value: '',
        deals: statusGroups['closed'].map((contact) => ({
          id: contact.id,
          company: contact.company || null,
          contact: contact.name,
          phone: contact.phone || null,
          value: '',
          tags: contact.tags || [],
          status: 'closed' as const,
          avatar: contact.avatar || null,
        })),
      },
    ]
  }

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/contacts')
        if (!response.ok) throw new Error('Failed to fetch contacts')
        
        const data = await response.json()
        const convertedPipeline = convertContactsToPipeline(data.contacts || [])
        setPipelineData(convertedPipeline)
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setIsDragging(true)
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', deal.id.toString())
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.6'
      e.currentTarget.style.cursor = 'grabbing'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
      e.currentTarget.style.cursor = 'pointer'
    }
    // Delay to prevent click event after drag
    setTimeout(() => setIsDragging(false), 100)
    setDraggedDeal(null)
    setDragOverColumn(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string, index?: number) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
    if (index !== undefined) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column container, not moving to a child
    const target = e.currentTarget as HTMLElement
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!target.contains(relatedTarget)) {
      setDragOverColumn(null)
      setDragOverIndex(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, targetColumnId: string, targetIndex?: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedDeal) return

    // Map column ID to status
    const statusMap: Record<string, 'lead' | 'prospect' | 'customer' | 'closed'> = {
      'lead-in': 'lead',
      'contact-made': 'prospect',
      'meeting-scheduled': 'prospect',
      'proposal': 'customer',
      'won': 'closed',
    }

    const newStatus = statusMap[targetColumnId] || 'lead'

    try {
      // Update contact status via API
      const response = await fetch(`/api/contacts/${draggedDeal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update contact status')

      // Refresh contacts data
      const contactsResponse = await fetch('/api/contacts')
      if (contactsResponse.ok) {
        const data = await contactsResponse.json()
        const convertedPipeline = convertContactsToPipeline(data.contacts || [])
        setPipelineData(convertedPipeline)
      }
    } catch (error) {
      console.error('Failed to update contact status:', error)
    }

    setDraggedDeal(null)
    setDragOverColumn(null)
    setDragOverIndex(null)
  }

  const handleAddNewDeal = () => {
    setShowAddModal(true)
    setNewDealColumn('lead-in') // Default to first column
  }

  const handleSaveNewDeal = async (dealData: { contact: string; phone: string; status: 'lead' | 'prospect' | 'customer' | 'closed' }) => {
    try {
      // Create contact via API
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dealData.contact,
          phone: dealData.phone,
          status: dealData.status,
        }),
      })

      if (!response.ok) throw new Error('Failed to create contact')

      // Refresh contacts data
      const contactsResponse = await fetch('/api/contacts')
      if (contactsResponse.ok) {
        const data = await contactsResponse.json()
        const convertedPipeline = convertContactsToPipeline(data.contacts || [])
        setPipelineData(convertedPipeline)
      }

      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create contact:', error)
      alert('Müşteri oluşturulamadı')
    }
  }

  const handleDealClick = async (deal: Deal) => {
    // Don't open if we just finished dragging
    if (isDragging) {
      return
    }
    
    setSelectedDeal(deal)
    setLoadingHistory(true)
    
    try {
      // Fetch contact history from API
      if (deal.phone) {
        const response = await fetch(`/api/contacts/history?phone=${encodeURIComponent(deal.phone)}`)
        if (response.ok) {
          const data = await response.json()
          setContactHistory(data.history || [])
        } else {
          setContactHistory([])
        }
      } else {
        setContactHistory([])
      }
    } catch (error) {
      console.error('Failed to fetch contact history:', error)
      setContactHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  }


  return (
    <div className="flex flex-1 flex-col overflow-hidden max-w-full">
      {/* Top Navigation */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 px-3 md:px-6 py-3 md:py-4 shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className="w-full sm:w-auto sm:min-w-[180px] md:max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="h-9 md:h-10 w-full rounded-lg border-none bg-gray-50 dark:bg-navy-700 pl-9 pr-4 text-sm text-navy dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder={t('searchDeals')}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-2 md:px-3 text-navy dark:text-white border border-gray-200 dark:border-gray-600">
              <Calendar size={16} />
              <input
                type="date"
                className="bg-transparent border-none outline-none text-xs md:text-sm font-medium cursor-pointer w-[100px] md:w-[130px]"
                placeholder={t('dateRange')}
              />
            </div>
            <div className="relative z-50">
              <button 
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-1 md:gap-x-2 rounded-lg px-2 md:px-3 transition-colors ${
                  selectedTagFilter 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-50 dark:bg-navy-700 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Tag size={16} />
                <span className="text-xs md:text-sm font-medium hidden sm:inline">
                  {selectedTagFilter || t('tags')}
                </span>
                <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${showTagDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
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
                      <span className="text-gray-700 dark:text-gray-300">{t('allTags') || 'Tüm Etiketler'}</span>
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
                        {t('noTags') || 'Henüz etiket yok'}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleAddNewDeal}
            className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-9 md:h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            <span>{t('newDeal')}</span>
          </button>
        </div>
      </header>

      {/* Müşteriler Board */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 h-full">
            {filteredPipelineData.map((column) => (
            <div
              key={column.id}
              className="flex flex-col gap-2 md:gap-3 min-h-0"
            >
              <div className="flex items-center justify-between px-1 shrink-0">
                <h3 className="text-navy dark:text-white text-sm md:text-base font-bold tracking-tight">
                  {column.title}
                </h3>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {column.count}
                </span>
              </div>

              <div 
                className="flex flex-col flex-1 overflow-y-auto min-h-0 rounded-lg"
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {column.deals.length > 0 ? (
                  <>
                    {/* Drop zone at the top */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDragOver(e, column.id, 0)
                      }}
                      onDrop={(e) => handleDrop(e, column.id, 0)}
                      className={`min-h-[2px] rounded transition-all ${
                        dragOverColumn === column.id && dragOverIndex === 0
                          ? 'bg-primary/30 min-h-[4px] -my-1'
                          : 'bg-transparent'
                      }`}
                    />
                    {column.deals.map((deal, index) => (
                      <React.Fragment key={deal.id}>
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleDealClick(deal)}
                          className="rounded-lg bg-white dark:bg-navy-800 p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 mb-2 md:mb-3"
                        >
                          <div className="flex flex-col gap-1.5 md:gap-2">
                            <p className="font-semibold text-xs md:text-sm text-navy dark:text-white truncate">{deal.contact}</p>
                            {deal.phone && (
                              <p className="text-[11px] md:text-xs text-gray-600 dark:text-gray-400 truncate">{deal.phone}</p>
                            )}
                            
                            {/* Deal Tags */}
                            {deal.tags && deal.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {deal.tags.slice(0, 2).map((tag) => (
                                  <button
                                    key={tag.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedTagFilter(tag.tag)
                                    }}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-medium text-white hover:opacity-80 transition-opacity"
                                    style={{ backgroundColor: tag.color || '#6366f1' }}
                                  >
                                    {tag.tag}
                                  </button>
                                ))}
                                {deal.tags.length > 2 && (
                                  <span className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400">
                                    +{deal.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1.5 md:pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex gap-1 flex-wrap">
                                <span
                                  className={`text-[10px] md:text-xs font-medium rounded-full px-1.5 py-0.5 ${
                                    deal.status === 'lead' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                    deal.status === 'prospect' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' :
                                    deal.status === 'customer' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-200'
                                  }`}
                                >
                                  {deal.status === 'lead' ? t('lead') :
                                   deal.status === 'prospect' ? t('prospect') :
                                   deal.status === 'customer' ? t('customer') :
                                   t('closed')}
                                </span>
                              </div>
                              {deal.avatar ? (
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-center bg-no-repeat bg-cover shrink-0" style={{ backgroundImage: `url(${deal.avatar})` }}></div>
                              ) : (
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/20 shrink-0 flex items-center justify-center">
                                  <User size={10} className="text-primary md:hidden" />
                                  <User size={12} className="text-primary hidden md:block" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Drop zone after each card */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDragOver(e, column.id, index + 1)
                          }}
                          onDrop={(e) => handleDrop(e, column.id, index + 1)}
                          className={`min-h-[2px] rounded transition-all ${
                            dragOverColumn === column.id && dragOverIndex === index + 1
                              ? 'bg-primary/30 min-h-[4px] -my-1'
                              : 'bg-transparent'
                          }`}
                        />
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <div className={`rounded-lg border-2 border-dashed transition-all duration-300 flex-1 ${
                    dragOverColumn === column.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-navy-800/50'
                  } p-4`}>
                    <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
                      <p className={`text-sm transition-colors duration-300 text-center ${
                        dragOverColumn === column.id
                          ? 'text-primary font-semibold'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {t('dragDealsHere')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
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
                <h2 className="text-lg font-bold text-navy dark:text-white">Yeni Müşteri</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Müşteriler'e yeni kişi ekle</p>
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
                const contact = formData.get('contact') as string
                const phone = formData.get('phone') as string
                const status = formData.get('status') as 'lead' | 'prospect' | 'customer' | 'closed'
                const column = formData.get('column') as string
                
                if (contact && phone) {
                  setNewDealColumn(column)
                  handleSaveNewDeal({ contact, phone, status })
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
                    name="contact"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    placeholder="Müşteri adı"
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

                <div className="grid grid-cols-2 gap-3">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Kolon
                    </label>
                    <select
                      name="column"
                      required
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                      defaultValue="lead-in"
                    >
                      {pipelineData.map((column) => (
                        <option key={column.id} value={column.id}>
                          {column.title}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Detail Sidebar */}
      {selectedDeal && (
        <div 
          className="sidebar-overlay fixed inset-0 bg-black/50 z-50 flex justify-end"
          onClick={() => setSelectedDeal(null)}
        >
          <div 
            className="sidebar-panel bg-white dark:bg-navy-800 w-full md:max-w-md h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-navy dark:text-white">Müşteri Detayları</h2>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div 
                  className="w-16 h-16 rounded-full bg-center bg-no-repeat bg-cover shrink-0"
                  style={{ backgroundImage: `url(${selectedDeal.avatar})` }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-navy dark:text-white">{selectedDeal.contact}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Phone size={14} />
                    {selectedDeal.phone}
                  </p>
                  {selectedDeal.company && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                      <User size={14} />
                      {selectedDeal.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Durum</h4>
                <span
                  className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${
                    selectedDeal.status === 'lead' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200' :
                    selectedDeal.status === 'prospect' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' :
                    selectedDeal.status === 'customer' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-200'
                  }`}
                >
                  {selectedDeal.status === 'lead' ? t('lead') :
                   selectedDeal.status === 'prospect' ? t('prospect') :
                   selectedDeal.status === 'customer' ? t('customer') :
                   t('closed')}
                </span>
              </div>

              {/* History Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <Clock size={16} />
                  Geçmiş
                </h4>
                
                {loadingHistory ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Yükleniyor...
                  </div>
                ) : contactHistory.length > 0 ? (
                  <div className="space-y-3">
                    {contactHistory.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-gray-50 dark:bg-navy-700/50 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            item.type === 'message' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            item.type === 'call' ? 'bg-green-100 dark:bg-green-900/30' :
                            'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {item.type === 'message' ? (
                              <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
                            ) : item.type === 'call' ? (
                              <Phone size={16} className="text-green-600 dark:text-green-400" />
                            ) : (
                              <Mail size={16} className="text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy dark:text-white">
                              {item.title || 'Etkileşim'}
                            </p>
                            {item.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {formatDate(item.timestamp || item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Henüz geçmiş kaydı bulunmuyor</p>
                    <p className="text-xs mt-1">Bu müşteri ile ilk etkileşimler burada görünecek</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}