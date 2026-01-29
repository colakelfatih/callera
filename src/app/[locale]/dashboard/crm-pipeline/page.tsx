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
  tags: Array<{ id: string; tag: string }>
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
  const t = useTranslations('crm')

  // Fetch pipeline data from API
  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/contacts/pipeline')
        if (!response.ok) throw new Error('Failed to fetch pipeline')
        
        const data = await response.json()
        
        // Convert contacts to deals format
        const convertedPipeline = data.pipeline.map((column: any) => ({
          id: column.id,
          title: column.title,
          count: column.count,
          value: '',
          deals: column.contacts.map((contact: ContactWithTags) => ({
            id: contact.id,
            company: contact.company || null,
            contact: contact.name,
            phone: contact.phone || null,
            value: '',
            tags: contact.tags || [],
            status: (contact.status || 'lead') as 'lead' | 'prospect' | 'customer' | 'closed',
            avatar: contact.avatar || null,
          })),
        }))
        
        setPipelineData(convertedPipeline)
      } catch (error) {
        console.error('Error fetching pipeline:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPipeline()
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

      // Refresh pipeline data
      const pipelineResponse = await fetch('/api/contacts/pipeline')
      if (pipelineResponse.ok) {
        const pipelineData = await pipelineResponse.json()
        const convertedPipeline = pipelineData.pipeline.map((column: any) => ({
          id: column.id,
          title: column.title,
          count: column.count,
          value: '',
          deals: column.contacts.map((contact: ContactWithTags) => ({
            id: contact.id,
            company: contact.company || null,
            contact: contact.name,
            phone: contact.phone || null,
            value: '',
            tags: contact.tags || [],
            status: (contact.status || 'lead') as 'lead' | 'prospect' | 'customer' | 'closed',
            avatar: contact.avatar || null,
          })),
        }))
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

      // Refresh pipeline data
      const pipelineResponse = await fetch('/api/contacts/pipeline')
      if (pipelineResponse.ok) {
        const pipelineData = await pipelineResponse.json()
        const convertedPipeline = pipelineData.pipeline.map((column: any) => ({
          id: column.id,
          title: column.title,
          count: column.count,
          value: '',
          deals: column.contacts.map((contact: ContactWithTags) => ({
            id: contact.id,
            company: contact.company || null,
            contact: contact.name,
            phone: contact.phone || null,
            value: '',
            tags: contact.tags || [],
            status: (contact.status || 'lead') as 'lead' | 'prospect' | 'customer' | 'closed',
            avatar: contact.avatar || null,
          })),
        }))
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
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 px-4 md:px-6 py-3 md:py-4 shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
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
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-2 md:px-3 text-navy dark:text-white border border-gray-200 dark:border-gray-600">
              <Calendar size={16} />
              <input
                type="date"
                className="bg-transparent border-none outline-none text-xs md:text-sm font-medium cursor-pointer w-[110px] md:w-[130px]"
                placeholder={t('dateRange')}
              />
            </div>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 md:gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-2 md:px-3 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
              <Tag size={16} />
              <span className="text-xs md:text-sm font-medium hidden sm:inline">{t('tags')}</span>
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
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

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-3 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>
          </div>
        ) : (
          <div className="inline-grid h-full min-w-full auto-cols-min grid-flow-col gap-3 md:gap-4">
            {pipelineData.map((column) => (
            <div
              key={column.id}
              className="flex w-[260px] md:w-72 h-full flex-col gap-3"
            >
              <h3 className="text-navy dark:text-white text-base font-bold tracking-tight px-1 shrink-0">
                {column.title} ({column.count})
              </h3>

              <div 
                className="flex flex-col flex-1 overflow-y-auto min-h-0"
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
                          className="rounded-lg bg-white dark:bg-navy-800 p-3 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-200 mb-3"
                        >
                          <div className="flex flex-col gap-2">
                            <p className="font-semibold text-sm text-navy dark:text-white truncate">{deal.contact}</p>
                            {deal.phone && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{deal.phone}</p>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex gap-1 flex-wrap">
                                <span
                                  className={`text-xs font-medium rounded-full px-1.5 py-0.5 ${
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
                                <div className="w-5 h-5 rounded-full bg-center bg-no-repeat bg-cover shrink-0" style={{ backgroundImage: `url(${deal.avatar})` }}></div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-primary/20 shrink-0 flex items-center justify-center">
                                  <User size={12} className="text-primary" />
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
                  <div className={`rounded-lg bg-white dark:bg-navy-800 border-2 border-dashed transition-all duration-300 ${
                    dragOverColumn === column.id
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-navy-700/50'
                  } p-3`}>
                    <div className="flex flex-col items-center justify-center min-h-[80px]">
                      <p className={`text-xs transition-colors duration-300 text-center ${
                        dragOverColumn === column.id
                          ? 'text-primary font-semibold'
                          : 'text-gray-500 dark:text-gray-400'
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
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div 
            className="bg-white dark:bg-navy-800 rounded-t-2xl md:rounded-lg p-4 md:p-6 w-full md:max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Yeni Müşteri Ekle</h2>
            
            <form onSubmit={(e) => {
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
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Müşteri adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="+90 555 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Durum
                  </label>
                  <select
                    name="status"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    defaultValue="lead"
                  >
                    <option value="lead">{t('lead')}</option>
                    <option value="prospect">{t('prospect')}</option>
                    <option value="customer">{t('customer')}</option>
                    <option value="closed">{t('closed')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kolon
                  </label>
                  <select
                    name="column"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 px-3 py-2 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
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

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-600 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
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