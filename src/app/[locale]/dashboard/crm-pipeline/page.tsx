'use client'

import React, { useState } from 'react'
import { Search, Plus, User, Calendar, Tag } from 'lucide-react'
// import { useLanguage } from '@/contexts/LanguageContext'

const tagColors = {
  'AI Suggestion': 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-200',
  'Enterprise': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200',
  'Follow-up': 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-200',
  'High Priority': 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200',
  'Closed': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
}

export default function CRMPipelinePage() {
  const [searchQuery, setSearchQuery] = useState('')
  // const { t } = useLanguage()

  const pipelineData = [
    {
      id: 'lead-in',
      title: 'Lead In',
      count: 4,
      value: '$92,000',
      deals: [
        {
          id: 1,
          company: 'Innovate Corp',
          contact: 'Jane Doe',
          value: '$25,000',
          tags: ['AI Suggestion', 'Enterprise'],
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwXmbbLJ08KPqnqWO97VuHVB2hrSWrnjlKopduxPJ-5PQJxdfp_hc9axv1sIxxbm638GmIuFgrskHx9MZRhHZdi0QI_GidjYZTi3fsPXowH7Zkt7IT819kxUk4r9GTJ9OvwMfmY9uPx9tHyZ91HRemmCzPk5R9pYwom9cs2Q7Ci-UMb4szhx8LBtWSufmuWb6ak7Hox4N_r-QF8iRjqzgRGEnCeorpzIE6usSm_KZhAQILoqYQNShu0fkWu4IgjCWbnsjQUHBRTNM'
        },
        {
          id: 2,
          company: 'Quantum Solutions',
          contact: 'John Smith',
          value: '$12,000',
          tags: ['Follow-up'],
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOgWM2A0tZoFdNz6Gsq5IyyeICi-bLYsrLFiOiRZC3TYccMwu8E5xZbp0vjTRPl0HEFJsp5J1xrdTxnXE45jkwc5we8porJSPcYskr8GOmpHWxt_IyPhq_8Bb3qQGJEpwIoI5hMmCc-bJhYJazijKdUDmA4jhZ-f-TmzB2uFTGV-XPRcHQAz2llMRrFlrS8CQAVqW8od2lcw40f2il2_CkG7acO3GD2lNEXwmh1F6lVgmwKLTLrY2cS2Agd0nNAabL7FdYTIGVX0'
        }
      ]
    },
    {
      id: 'contact-made',
      title: 'Contact Made',
      count: 2,
      value: '$55,000',
      deals: [
        {
          id: 3,
          company: 'Apex Dynamics',
          contact: 'Emily White',
          value: '$30,000',
          tags: ['High Priority'],
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCazbhMZDexN9M-MxYtXNDlQMDSIev3xvZd72wbbV0WHm2157E6_R0u-dHA9MSNsjGGLaY_QOTToWKoMROETgS3VjecQUot51hUB9Gcrp3alE_dTXmuwyhLJq94sSqaBUKBRax-XuuZ2NJmMryDeHD3YD8Ce6wZ6wXSqBJTJraX1MI_SGUDx2WJykmnOJEk31lXJUwoVj1lV0yzTnND-jwmIJ5VYoHKiPmQpQqPbOJmMYFb-spzCQ6HjhbOy8U56Eq0IIX1s1HU4sw'
        }
      ]
    },
    {
      id: 'meeting-scheduled',
      title: 'Meeting Scheduled',
      count: 1,
      value: '$75,000',
      deals: [
        {
          id: 4,
          company: 'Future Systems',
          contact: 'Michael Brown',
          value: '$75,000',
          tags: ['Enterprise'],
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbcuWZGa9pcLGJ5BfJraSfpDIp-QapwyFEzyVj1XFF0gc-la_dyv9OMsDGaOiJOQvcvIXQwiS4syyU1OPs_y9N5w_z7k9AhJBMa9eErVgK_Ik8KQPUMKpEjwVC8kuWCaJ3Z9bg-I0ykSt3KswLeQiThIbOtfZb-lLPKg4a6bxefbMJKbX0DaeJzTOrL3YbC6OEr2Vx2DE71GZCwxxvMDrwQvCCCU70T9-f97DE64CmnkjsUDTidPA60JcMnXgKHJcjL0wPHRuayhM'
        }
      ]
    },
    {
      id: 'proposal',
      title: 'Proposal',
      count: 0,
      value: '$0',
      deals: []
    },
    {
      id: 'won',
      title: 'Won',
      count: 1,
      value: '$150,000',
      deals: [
        {
          id: 5,
          company: 'Global Tech Inc.',
          contact: 'Sarah Johnson',
          value: '$150,000',
          tags: ['Closed'],
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBIrGURjR0IHdLRFI5oA5vlQk9FKCWQ2adj8jmF-kNasspJzSb7uerlMk11Z6ekjJk9nphnPyMcnpKniBVJnanB-hCgsG3eLaGw7a3iUpCBncYRntUY5y3jg0GbaSfV4V-lOLe04OlotNtx-8LHzBgirptRVrbcEf9No1Jj_-DgHbYoOs7AI87bJCO5RFVEYb2rLYZXD3CWC05fhDQWE-7txPN78biVtRL1UujOUY0iodqUr6npEsTxmsDQvf5LD7oR8w4cMBo9x8'
        }
      ]
    }
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 px-8 py-4 shrink-0">
        <h1 className="text-xl font-bold text-navy dark:text-white">CRM Pipeline</h1>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="w-full max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="h-10 w-full rounded-lg border-none bg-gray-50 dark:bg-navy-700 pl-10 pr-4 text-sm text-navy dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Search deals..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide">
            <Plus size={16} />
            New Deal
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-3 p-6 shrink-0 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700">
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-3 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
          <User size={16} />
          <p className="text-sm font-medium">Assigned User</p>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-3 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
          <Calendar size={16} />
          <p className="text-sm font-medium">Date Range</p>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-50 dark:bg-navy-700 px-3 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
          <Tag size={16} />
          <p className="text-sm font-medium">Tags</p>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="inline-grid h-full min-w-full auto-cols-min grid-flow-col gap-6">
          {pipelineData.map((column) => (
            <div key={column.id} className="flex w-80 flex-col gap-4">
              <h3 className="text-navy dark:text-white text-base font-bold tracking-tight px-1">
                {column.title} ({column.count}) - {column.value}
              </h3>

              <div className="flex flex-col gap-4">
                {column.deals.length > 0 ? (
                  column.deals.map((deal) => (
                    <div key={deal.id} className="rounded-xl bg-white dark:bg-navy-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col gap-3">
                        <p className="font-bold text-navy dark:text-white">{deal.company}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{deal.contact}</p>
                        <p className="text-sm font-semibold text-navy dark:text-white">{deal.value}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex gap-2">
                            {deal.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-xs font-semibold rounded-full px-2 py-0.5 ${tagColors[tag as keyof typeof tagColors] || 'bg-gray-100 text-gray-700'}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="w-6 h-6 rounded-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${deal.avatar})` }}></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-navy-700/50 h-32">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Drag deals here</p>
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