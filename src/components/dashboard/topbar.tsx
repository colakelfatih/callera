'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Moon, Sun, Menu, LogOut, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useTranslations, useLocale } from 'next-intl'
import { authClient } from '@/components/auth/auth-provider'

// Language options with flags
const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

interface TopBarProps {
  onThemeToggle?: () => void
  isDark?: boolean
  onMobileMenuToggle?: () => void
}

interface UserSession {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function TopBar({ onThemeToggle, isDark = false, onMobileMenuToggle }: TopBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('topbar')
  const tNav = useTranslations('navigation')
  const tInbox = useTranslations('inbox')
  const tCrm = useTranslations('crm')
  const tAuth = useTranslations('auth')
  const tLang = useTranslations('language')
  const [user, setUser] = useState<UserSession['user'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  
  // Current language
  const currentLang = languages.find(l => l.code === locale) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Change language
  const changeLanguage = (langCode: string) => {
    const newPathname = pathname?.replace(`/${locale}`, `/${langCode}`) || `/${langCode}`
    router.push(newPathname)
    setLangDropdownOpen(false)
  }

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname?.includes('/inbox')) return tInbox('title')
    if (pathname?.includes('/crm-pipeline')) return 'Kanban Board'
    if (pathname?.includes('/crm')) return tCrm('title')
    if (pathname?.includes('/integrations')) return tNav('integrations')
    if (pathname?.includes('/profile')) return 'Profil'
    if (pathname?.includes('/settings')) return tNav('settings')
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
    <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 h-[65px] flex items-center">
      <div className="flex items-center justify-between gap-4 w-full">
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

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Language Switcher */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-sm font-medium text-navy dark:text-white"
              aria-label={tLang('switchToEnglish')}
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={14} className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#252525] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-navy-700 transition-colors ${
                      locale === lang.code
                        ? 'text-primary font-semibold bg-primary-50 dark:bg-primary/10'
                        : 'text-navy dark:text-white'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {locale === lang.code && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
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