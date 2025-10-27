'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/topbar'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const locale = params.locale as string
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('callera-theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('callera-theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        currentPath={typeof window !== 'undefined' ? window.location.pathname : `/${locale}/dashboard/inbox`}
        locale={locale}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onThemeToggle={toggleTheme} isDark={isDark} />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}