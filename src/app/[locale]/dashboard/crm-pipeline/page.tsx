'use client'

import React, { useState } from 'react'
import { Search, Plus, Calendar, Tag } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Deal {
  id: number
  company: string
  contact: string
  phone: string
  value: string
  tags: string[]
  status: 'lead' | 'prospect' | 'customer' | 'closed'
  avatar: string
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
  const t = useTranslations('crm')

  const [pipelineData, setPipelineData] = useState<PipelineColumn[]>([
    {
      id: 'lead-in',
      title: t('leadIn'),
      count: 4,
      value: '',
      deals: [
        {
          id: 1,
          company: 'Innovate Corp',
          contact: 'Jane Doe',
          phone: '+90 555 123 4567',
          value: '$25,000',
          tags: ['AI Suggestion', 'Enterprise'],
          status: 'lead',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwXmbbLJ08KPqnqWO97VuHVB2hrSWrnjlKopduxPJ-5PQJxdfp_hc9axv1sIxxbm638GmIuFgrskHx9MZRhHZdi0QI_GidjYZTi3fsPXowH7Zkt7IT819kxUk4r9GTJ9OvwMfmY9uPx9tHyZ91HRemmCzPk5R9pYwom9cs2Q7Ci-UMb4szhx8LBtWSufmuWb6ak7Hox4N_r-QF8iRjqzgRGEnCeorpzIE6usSm_KZhAQILoqYQNShu0fkWu4IgjCWbnsjQUHBRTNM'
        },
        {
          id: 2,
          company: 'Quantum Solutions',
          contact: 'John Smith',
          phone: '+90 555 234 5678',
          value: '$12,000',
          tags: ['Follow-up'],
          status: 'prospect',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOgWM2A0tZoFdNz6Gsq5IyyeICi-bLYsrLFiOiRZC3TYccMwu8E5xZbp0vjTRPl0HEFJsp5J1xrdTxnXE45jkwc5we8porJSPcYskr8GOmpHWxt_IyPhq_8Bb3qQGJEpwIoI5hMmCc-bJhYJazijKdUDmA4jhZ-f-TmzB2uFTGV-XPRcHQAz2llMRrFlrS8CQAVqW8od2lcw40f2il2_CkG7acO3GD2lNEXwmh1F6lVgmwKLTLrY2cS2Agd0nNAabL7FdYTIGVX0'
        }
      ]
    },
    {
      id: 'contact-made',
      title: t('contactMade'),
      count: 2,
      value: '',
      deals: [
        {
          id: 3,
          company: 'Apex Dynamics',
          contact: 'Emily White',
          phone: '+90 555 345 6789',
          value: '$30,000',
          tags: ['High Priority'],
          status: 'prospect',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCazbhMZDexN9M-MxYtXNDlQMDSIev3xvZd72wbbV0WHm2157E6_R0u-dHA9MSNsjGGLaY_QOTToWKoMROETgS3VjecQUot51hUB9Gcrp3alE_dTXmuwyhLJq94sSqaBUKBRax-XuuZ2NJmMryDeHD3YD8Ce6wZ6wXSqBJTJraX1MI_SGUDx2WJykmnOJEk31lXJUwoVj1lV0yzTnND-jwmIJ5VYoHKiPmQpQqPbOJmMYFb-spzCQ6HjhbOy8U56Eq0IIX1s1HU4sw'
        }
      ]
    },
    {
      id: 'meeting-scheduled',
      title: t('meetingScheduled'),
      count: 1,
      value: '',
      deals: [
        {
          id: 4,
          company: 'Future Systems',
          contact: 'Michael Brown',
          phone: '+90 555 456 7890',
          value: '$75,000',
          tags: ['Enterprise'],
          status: 'customer',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbcuWZGa9pcLGJ5BfJraSfpDIp-QapwyFEzyVj1XFF0gc-la_dyv9OMsDGaOiJOQvcvIXQwiS4syyU1OPs_y9N5w_z7k9AhJBMa9eErVgK_Ik8KQPUMKpEjwVC8kuWCaJ3Z9bg-I0ykSt3KswLeQiThIbOtfZb-lLPKg4a6bxefbMJKbX0DaeJzTOrL3YbC6OEr2Vx2DE71GZCwxxvMDrwQvCCCU70T9-f97DE64CmnkjsUDTidPA60JcMnXgKHJcjL0wPHRuayhM'
        }
      ]
    },
    {
      id: 'proposal',
      title: t('proposal'),
      count: 0,
      value: '',
      deals: []
    },
    {
      id: 'won',
      title: t('won'),
      count: 1,
      value: '',
      deals: [
        {
          id: 5,
          company: 'Global Tech Inc.',
          contact: 'Sarah Johnson',
          phone: '+90 555 567 8901',
          value: '$150,000',
          tags: ['Closed'],
          status: 'closed',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBIrGURjR0IHdLRFI5oA5vlQk9FKCWQ2adj8jmF-kNasspJzSb7uerlMk11Z6ekjJk9nphnPyMcnpKniBVJnanB-hCgsG3eLaGw7a3iUpCBncYRntUY5y3jg0GbaSfV4V-lOLe04OlotNtx-8LHzBgirptRVrbcEf9No1Jj_-DgHbYoOs7AI87bJCO5RFVEYb2rLYZXD3CWC05fhDQWE-7txPN78biVtRL1UujOUY0iodqUr6npEsTxmsDQvf5LD7oR8w4cMBo9x8'
        }
      ]
    }
  ])

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', deal.id.toString())
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
      e.currentTarget.style.transform = 'rotate(2deg)'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
      e.currentTarget.style.transform = 'rotate(0deg)'
    }
    setDraggedDeal(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (draggedDeal) {
      setPipelineData(prevData => {
        const newData = prevData.map(column => {
          // Remove deal from source column
          if (column.deals.some(deal => deal.id === draggedDeal.id)) {
            return {
              ...column,
              deals: column.deals.filter(deal => deal.id !== draggedDeal.id),
              count: column.count - 1,
              value: ''
            }
          }
          // Add deal to target column
          if (column.id === targetColumnId) {
            return {
              ...column,
              deals: [...column.deals, draggedDeal],
              count: column.count + 1,
              value: ''
            }
          }
          return column
        })
        return newData
      })
    }
    setDraggedDeal(null)
    setDragOverColumn(null)
  }


  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 px-8 py-4 shrink-0">
        <h1 className="text-xl font-bold text-navy dark:text-white">Kanban Board</h1>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="w-full max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="h-10 w-full rounded-lg border-none bg-gray-50 dark:bg-navy-700 pl-10 pr-4 text-sm text-navy dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder={t('searchDeals')}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide">
            <Plus size={16} />
            {t('newDeal')}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-3 p-6 shrink-0 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-3 text-navy dark:text-white border border-gray-200 dark:border-gray-600">
          <Calendar size={16} />
          <input
            type="date"
            className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer"
            placeholder={t('dateRange')}
          />
        </div>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-3 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
          <Tag size={16} />
          <p className="text-sm font-medium">{t('tags')}</p>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="inline-grid h-full min-w-full auto-cols-min grid-flow-col gap-4">
          {pipelineData.map((column) => (
            <div
              key={column.id}
              className={`flex w-64 flex-col gap-3 transition-all duration-300 ${
                dragOverColumn === column.id ? 'transform scale-105' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <h3 className="text-navy dark:text-white text-base font-bold tracking-tight px-1">
                {column.title} ({column.count})
              </h3>

              <div className="flex flex-col gap-4 min-h-[200px]">
                {column.deals.length > 0 ? (
                  column.deals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
                      className="rounded-lg bg-white dark:bg-navy-800 p-3 shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-all duration-200 transform hover:scale-102 active:scale-95 animate-fade-in"
                    >
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold text-sm text-navy dark:text-white truncate">{deal.contact}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{deal.phone}</p>

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
                          <div className="w-5 h-5 rounded-full bg-center bg-no-repeat bg-cover flex-shrink-0" style={{ backgroundImage: `url(${deal.avatar})` }}></div>
                        </div>
                      </div>
                    </div>
                  ))
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
      </div>
    </div>
  )
}