'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Bell, Moon, Sun, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useTranslations } from 'next-intl'
import { authClient } from '@/components/auth/auth-provider'

interface TopBarProps {
  onThemeToggle?: () => void
  isDark?: boolean
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function TopBar({ onThemeToggle, isDark = false, onMobileMenuToggle, isMobileMenuOpen = false }: TopBarProps) {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('topbar')
  const tAuth = useTranslations('auth')

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push(`/${locale}/login`)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            className="p-2"
            aria-label={isDark ? t('switchToLight') : t('switchToDark')}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <Button variant="ghost" size="sm" className="p-2 relative hidden sm:flex" aria-label={t('notifications')}>
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          <div className="flex items-center gap-2 md:gap-3">
            <Avatar name="John Doe" size="sm" />
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-navy dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('admin')}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2"
              aria-label={tAuth('logout')}
              title={tAuth('logout')}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}