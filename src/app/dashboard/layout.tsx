'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    // In a real app, you'd persist this to localStorage
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={toggleSidebar}
        currentPath={typeof window !== 'undefined' ? window.location.pathname : '/dashboard/inbox'}
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
