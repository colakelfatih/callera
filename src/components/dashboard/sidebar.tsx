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
  TestTube,
  Settings
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
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
  ]

  return (
    <div className={cn(
      'bg-white dark:bg-[#1E1E1E] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 h-full overflow-y-auto relative',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className={cn(
        "flex items-center border-b border-gray-200 dark:border-gray-800",
        isCollapsed ? "justify-center p-3" : "justify-between p-4"
      )}>
        {!isCollapsed ? (
          <div className="font-display font-bold text-primary text-xl">
            Callera
          </div>
        ) : (
          <div className="font-display font-bold text-primary text-xl">
            C
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            aria-label={t('collapseSidebar')}
          >
            <Menu size={20} />
          </button>
        )}
      </div>
      
      {/* Expand button when collapsed - at bottom */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          aria-label={t('expandSidebar')}
        >
          <Menu size={20} />
        </button>
      )}

      <nav className={cn("space-y-2", isCollapsed ? "p-2" : "p-4")}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center transition-colors group relative',
                isCollapsed 
                  ? 'justify-center w-12 h-12 mx-auto rounded-lg' 
                  : 'gap-3 px-4 py-3 rounded-lg',
                isActive
                  ? isCollapsed
                    ? 'bg-primary-50 text-primary dark:bg-primary/20 dark:text-primary-400'
                    : 'bg-primary-50 text-primary dark:bg-primary/20 dark:text-primary-400 font-semibold border-l-4 border-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] hover:text-primary dark:hover:text-primary-400'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon size={isCollapsed ? 24 : 20} className="shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
              {/* Tooltip on hover when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-navy-800 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
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