'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { Moon, Sun, Menu, LogOut } from 'lucide-react'
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

interface UserSession {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function TopBar({ onThemeToggle, isDark = false, onMobileMenuToggle, isMobileMenuOpen = false }: TopBarProps) {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const locale = params.locale as string
  const t = useTranslations('topbar')
  const tNav = useTranslations('navigation')
  const tInbox = useTranslations('inbox')
  const tCrm = useTranslations('crm')
  const tAuth = useTranslations('auth')
  const [user, setUser] = useState<UserSession['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname?.includes('/inbox')) return tInbox('title')
    if (pathname?.includes('/crm-pipeline')) return 'Kanban Board'
    if (pathname?.includes('/crm')) return tCrm('title')
    if (pathname?.includes('/integrations')) return tNav('integrations')
    if (pathname?.includes('/profile')) return 'Profil'
    if (pathname?.includes('/settings')) return 'Ayarlar'
    return ''
  }

  const pageTitle = getPageTitle()

  useEffect(() => {
    // Fetch user session
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/get-session')
        const session: UserSession = await response.json()
        if (session?.user) {
          setUser(session.user)
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push(`/${locale}/login`)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfileClick = () => {
    router.push(`/${locale}/dashboard/profile`)
  }

  const userName = user?.name || user?.email || 'User'
  const userEmail = user?.email || ''

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

          {/* Page Title */}
          {pageTitle && (
            <h1 className="text-xl font-bold text-navy dark:text-white hidden sm:block">
              {pageTitle}
            </h1>
          )}
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

          <div className="flex items-center gap-2 md:gap-3">
            {loading ? (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="hidden lg:block">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleProfileClick}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label="Profile"
                >
                  <Avatar name={userName} size="sm" src={user?.image || undefined} />
                </button>
                <button
                  onClick={handleProfileClick}
                  className="hidden lg:block cursor-pointer hover:opacity-80 transition-opacity text-left"
                  aria-label="Profile"
                >
                  <p className="text-sm font-medium text-navy dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail || t('admin')}</p>
                </button>
              </>
            )}
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