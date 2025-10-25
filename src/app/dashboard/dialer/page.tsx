'use client'

import React, { useState } from 'react'
import { Search, Plus, Bell, LayoutDashboard, Inbox, Users, Phone, Settings, Workflow } from 'lucide-react'

const callQueueData = [
  {
    id: 1,
    name: 'Liam Johnson',
    phone: '(555) 123-4567',
    time: '14:45',
    date: 'Today',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARW_OCj2I9hVjcM0b9N72YTXFPQG8jUN7dMfRYi2hSNRYZ6dsvtKuWI6bpeYlkUvLo5vsh0DTAPmE6kmUG2IXt2rl3pDNhO__AA3trq2n-gF4e16bj7xb5Th3E-7FmwfWliZgq5xBnSj-23G7xtTe8R9_aduA_a-MHoa-FbAjRtO1YPN19lC5TlOyByz-sax3kkASQs-pohmlAm7yv5TTDCUJhqhGJW4M7vt3kqQoQVcM4gPMqDyy3kT3Vc-WdmJSMc8MlAPcFNQ4'
  },
  {
    id: 2,
    name: 'Olivia Chen',
    phone: '(555) 987-6543',
    time: '15:02',
    date: 'Today',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABmvTSViTcVeqdRYUPaKiEzZfmLHC2Ys25yyq0cTdJyeczy0XGVbLaZwgwE5sfU4qnvNIMTtMps2BGgnwobFkTxMKwKF6cCn0bjAfXXb8s2iKAXAXDu3lm0ED0bE_3IaJ_tB3VR9fEmkpD9oJmyoqvhcA33141CmZWjHllBl8PxCLqTCjcgOwqwkjyVLVtMyis_-9Fl9oMHpVw58fiq6rZ9DD9DUINagbeyIIFm5VEinBlgBztooBaL_yEQt37InczxXBuDeSl0Qk'
  },
  {
    id: 3,
    name: 'Ben Carter',
    phone: '(555) 321-7890',
    time: '15:18',
    date: 'Today',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr_1LY0GTVSTllP8OxMGPUAox7nYJEA34S9ufdlUNHvruLgrlcBBOok5lvQWrgprYMp0OGfF7_UxoJF4HhNPXrQvudP_VqK7F-0hkVyWj6tH2SzEqE0S448-eel1JYHfSI7Y7x8N31OFEMUlrqI9Cp-v1-t6ExFta7gff-caZTOwaUeIdPIAtybNMAk-jT0HXtwaRcGPFlAef3oZ0qZelyAyhUgx6wsSYoqbJRYFDi6gbB_SaxNITp49p8Vf5VM6yqhMCcZY23aCc'
  }
]

const recentActivity = [
  {
    id: 1,
    contact: 'Sophia Miller',
    time: '14:25',
    outcome: 'Connected',
    statusColor: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
  },
  {
    id: 2,
    contact: 'Ethan Brown',
    time: '14:22',
    outcome: 'Voicemail Left',
    statusColor: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
  },
  {
    id: 3,
    contact: 'Ava Garcia',
    time: '14:19',
    outcome: 'No Answer',
    statusColor: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
  }
]

export default function DialerPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="flex w-20 flex-col items-center gap-4 border-r border-gray-200/80 dark:border-navy/20 bg-white dark:bg-background-dark py-4">
        <div className="flex items-center justify-center">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBE58OF8xvF1rIsS76oKGkvGuMEIvN_nkEpF0ApD2d1Bl2eIR0dVnIQnbG0xl-1b9_BDTty_CV6G9tLkTbsjYvmPEF39RE-v1lBwaUui0fWF3o9tsqNCzT-bTDNUyS-DhOuWwDaR2g0eJGJ1p-K3w58pgW9CbVnOIxAzmiY2o0OWXDuRcVCQ6ncDsQJHgJPijoSmAm4qjhOKYZ6UcxUU9FJNT9N3YWfv_idSDlVb_DoHSlbG26KVZJ2BM7m0U29_W2LFvUZa7RkbCg")'}}></div>
        </div>
        
        <nav className="flex flex-col items-center gap-2">
          <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary" href="#" title="Dashboard">
            <LayoutDashboard size={24} />
            <p className="text-xs font-medium">Dashboard</p>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary" href="#" title="Inbox">
            <Inbox size={24} />
            <p className="text-xs font-medium">Inbox</p>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary" href="#" title="Contacts">
            <Users size={24} />
            <p className="text-xs font-medium">Contacts</p>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-primary/10 text-primary dark:text-primary" href="#" title="Dialer">
            <Phone size={24} />
            <p className="text-xs font-bold">Dialer</p>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary" href="#" title="Automations">
            <Workflow size={24} />
            <p className="text-xs font-medium">Automations</p>
          </a>
        </nav>
        
        <div className="mt-auto flex flex-col items-center gap-4">
          <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#" title="Settings">
            <Settings size={24} />
          </a>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2urgt9BvhOPuyW1A7iPcSpRXPk4tJIZkyYrJ4mox_n4PT3jAq18Pe9sTcXY_TR0jMd2nmNN2JB5FmkV-Jl4o5mXWmX829qarO8Z79Ztl2BWMgV2vzW_xcZNWYM8SnfHzm6DR3mvd4ZO3HZiCA_y3Q6VOPeENBfYiz7dFRiYt1PJDKMxbiXy9Fstu5Cn7lvgUq4dCBgnvGbuPjMglYEwWp-kELqZBWpXFDEhu0DhwBY1blv5OIsFs07D0NuKkzsXNeQy_KOY8TVAA")'}}></div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200/80 dark:border-navy/20 bg-white dark:bg-background-dark px-6 sm:px-10 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Phone size={32} className="text-primary" />
            <h1 className="text-navy dark:text-white text-xl font-bold leading-tight tracking-tight">AI Dialer</h1>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-gray-500 dark:text-gray-400 flex border-none bg-gray-100 dark:bg-white/5 items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search size={20} />
                </div>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-navy dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-white/5 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" 
                  placeholder="Search contacts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-gray-100 dark:bg-white/5 text-navy dark:text-white/90 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0">
              <Bell size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByej0Vp4s06uTZRCQqYRxEZEhaLYT8VmJTdsJ0_SwnuAiPTF4F_f0_ov_Sj1sf13s9hB98IIZxjNzu-5fiyp98VXGhbtF78vOtZHe-qGrZFiNGWd8C6A1yvRDBknAAlDa1JByzxTfNLJheTYw7j-CI5JQPiRYI0BCQeAvVlvPvaa00djOVzNJWKkYhVd5nfY_8wIPsKCjztCwpjkqmqQ8haM2r9QiXZSMNfpqpxDbCUHFa_o2f_2MtXi9Vtn7D9F1hEs5jpgRJnMg")'}}></div>
              <div className="flex flex-col text-right">
                <p className="text-sm font-semibold text-navy dark:text-white">Jane Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Queue & History */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-navy/10 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-gray-200/80 dark:border-navy/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-navy dark:text-white">Call Queue</h3>
                  <button className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20">
                    <span className="truncate">Add Contact</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upcoming calls for Q4 Lead Follow-up</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {callQueueData.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: `url(${contact.avatar})`}}></div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-navy dark:text-white">{contact.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-navy dark:text-white/90">{contact.time}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dialer & Stats */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Dialer Status Card */}
            <div className="rounded-xl shadow-sm bg-white dark:bg-navy/10 p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">DIALER STATUS</p>
                  <p className="text-2xl font-bold text-navy dark:text-white tracking-tight mt-1">Dialer is Active</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90">
                    <span className="truncate">Pause Dialer</span>
                  </button>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-200 dark:bg-white/10 text-navy dark:text-white text-sm font-medium leading-normal hover:bg-gray-300 dark:hover:bg-white/20">
                    <span className="truncate">New Campaign</span>
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200/80 dark:border-navy/20 flex flex-col sm:flex-row items-start sm:items-end gap-3 justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-base text-gray-600 dark:text-gray-300">Next call: <span className="font-semibold text-navy dark:text-white">John Doe</span> at <span className="font-semibold text-navy dark:text-white">14:30</span></p>
                  <p className="text-base text-gray-600 dark:text-gray-300">Active Campaign: <span className="font-semibold text-navy dark:text-white">Q4 Lead Follow-up</span></p>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-gray-500 dark:text-gray-400">Next call in:</p>
                  <p className="text-xl font-bold text-primary">02:15</p>
                </div>
              </div>
            </div>

            {/* Section Header */}
            <h2 className="text-navy dark:text-white text-xl font-bold leading-tight tracking-tight px-0 pt-2 pb-0">Campaign Progress</h2>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 rounded-xl p-5 border border-gray-200/80 dark:border-navy/20 bg-white dark:bg-navy/10">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Calls Completed</p>
                <p className="text-navy dark:text-white text-3xl font-bold leading-tight">128 / 300</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-5 border border-gray-200/80 dark:border-navy/20 bg-white dark:bg-navy/10">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Connection Rate</p>
                <p className="text-navy dark:text-white text-3xl font-bold leading-tight">42%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-5 border border-gray-200/80 dark:border-navy/20 bg-white dark:bg-navy/10">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Callbacks Scheduled</p>
                <p className="text-navy dark:text-white text-3xl font-bold leading-tight">15</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-navy/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200/80 dark:border-navy/20">
                <h3 className="font-bold text-navy dark:text-white">Recent Activity</h3>
              </div>
              <div className="flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-3" scope="col">Contact</th>
                      <th className="px-6 py-3" scope="col">Time</th>
                      <th className="px-6 py-3" scope="col">Outcome</th>
                      <th className="px-6 py-3 text-right" scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="bg-white dark:bg-transparent border-b border-gray-200/80 dark:border-navy/20 hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="px-6 py-4 font-semibold text-navy dark:text-white">{activity.contact}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{activity.time}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center ${activity.statusColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                            {activity.outcome}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a className="font-medium text-primary hover:underline" href="#">View Log</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
