'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/topbar'

export default function DashboardLayoutClient({
  children,
  locale
}: {
  children: React.ReactNode
  locale: string
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('callera-theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Priority: saved preference > system preference
    const shouldBeDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark)
    
    if (shouldBeDark) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if no saved preference
      if (!localStorage.getItem('callera-theme')) {
        setIsDark(e.matches)
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('callera-theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          currentPath={typeof window !== 'undefined' ? window.location.pathname : `/${locale}/dashboard/inbox`}
          locale={locale}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed left-0 top-0 h-full z-50 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          isCollapsed={false}
          onToggle={toggleMobileMenu}
          currentPath={typeof window !== 'undefined' ? window.location.pathname : `/${locale}/dashboard/inbox`}
          locale={locale}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden lg:w-0">
        <TopBar
          onThemeToggle={toggleTheme}
          isDark={isDark}
          onMobileMenuToggle={toggleMobileMenu}
        />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

