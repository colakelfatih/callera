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

interface SidebarProps {
  currentPath?: string
  isCollapsed?: boolean
  onToggle?: () => void
  locale?: string
}

export function Sidebar({ currentPath = '/dashboard/inbox', isCollapsed = false, onToggle, locale = 'tr' }: SidebarProps) {
  const navigation = [
    { name: 'Inbox', href: `/${locale}/dashboard/inbox`, icon: MessageSquare },
    { name: 'Dialer', href: `/${locale}/dashboard/dialer`, icon: Phone },
    { name: 'CRM', href: `/${locale}/dashboard/crm`, icon: Users },
    { name: 'Pipeline', href: `/${locale}/dashboard/crm-pipeline`, icon: Users },
    { name: 'Flows', href: `/${locale}/dashboard/flows`, icon: Zap },
    { name: 'Insights', href: `/${locale}/dashboard/insights`, icon: BarChart3 },
    { name: 'Studio', href: `/${locale}/dashboard/studio`, icon: Calendar },
    { name: 'Settings', href: `/${locale}/dashboard/settings`, icon: Settings },
  ]

  return (
    <div className={cn(
      'bg-white dark:bg-navy-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className={cn(
        "flex items-center border-b border-gray-200 dark:border-gray-700",
        isCollapsed ? "justify-center p-4" : "justify-between p-4"
      )}>
        {!isCollapsed && (
          <div className="font-display font-bold text-navy dark:text-white text-lg">
            Callera
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors",
            isCollapsed ? "p-4" : "p-2"
          )}
        >
          <Menu size={isCollapsed ? 28 : 20} />
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
                'flex items-center transition-colors group relative',
                isCollapsed ? 'justify-center px-4 py-5 rounded-xl min-h-[48px]' : 'gap-3 px-4 py-3 rounded-xl',
                isActive
                  ? 'bg-primary/10 text-primary dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 hover:text-navy dark:hover:text-white'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon size={isCollapsed ? 28 : 20} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </a>
          )
        })}
      </nav>
    </div>
  )
}