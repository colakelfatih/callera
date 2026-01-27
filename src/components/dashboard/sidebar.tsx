'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
  MessageSquare,
  Users,
  Plug,
  Menu,
  TestTube
} from 'lucide-react'

interface SidebarProps {
  currentPath?: string
  isCollapsed?: boolean
  onToggle?: () => void
  locale?: string
}

export function Sidebar({ currentPath, isCollapsed = false, onToggle, locale = 'tr' }: SidebarProps) {
  const t = useTranslations('navigation')
  const pathname = usePathname()

  const navigation = [
    { name: t('inbox'), href: `/${locale}/dashboard/inbox`, icon: MessageSquare },
    { name: t('crm'), href: `/${locale}/dashboard/crm`, icon: Users },
    { name: t('pipeline'), href: `/${locale}/dashboard/crm-pipeline`, icon: Users },
    { name: t('wiroTest'), href: `/${locale}/dashboard/wiro-test`, icon: TestTube },
    { name: t('integrations'), href: `/${locale}/dashboard/integrations`, icon: Plug },
  ]

  return (
    <div className={cn(
      'bg-white dark:bg-navy-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-full overflow-y-auto',
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
          aria-label={isCollapsed ? t('expandSidebar') : t('collapseSidebar')}
        >
          <Menu size={isCollapsed ? 28 : 20} />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
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