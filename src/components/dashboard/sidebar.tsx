'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { 
  MessageSquare, 
  Phone, 
  Users, 
  Zap, 
  BarChart3, 
  Calendar,
  Settings,
  Menu
} from 'lucide-react'

const navigation = [
  { name: 'Inbox', href: '/dashboard/inbox', icon: MessageSquare },
  { name: 'Dialer', href: '/dashboard/dialer', icon: Phone },
  { name: 'CRM', href: '/dashboard/crm', icon: Users },
  { name: 'Pipeline', href: '/dashboard/crm-pipeline', icon: Users },
  { name: 'Flows', href: '/dashboard/flows', icon: Zap },
  { name: 'Insights', href: '/dashboard/insights', icon: BarChart3 },
  { name: 'Studio', href: '/dashboard/studio', icon: Calendar },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  currentPath?: string
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ currentPath = '/dashboard/inbox', isCollapsed = false, onToggle }: SidebarProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-navy-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="font-display font-bold text-navy dark:text-white text-lg">
            Callera
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = currentPath === item.href
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                isActive 
                  ? 'bg-primary/10 text-primary dark:text-primary-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 hover:text-navy dark:hover:text-white'
              )}
            >
              <item.icon size={20} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
