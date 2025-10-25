'use client'

import React, { useState } from 'react'
import { Search, Bell, User, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

interface TopBarProps {
  onThemeToggle?: () => void
  isDark?: boolean
}

export function TopBar({ onThemeToggle, isDark = false }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations, contacts, or calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            className="p-2"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          <div className="flex items-center gap-3">
            <Avatar name="John Doe" size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-navy dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
