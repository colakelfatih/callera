'use client'

import React, { useState } from 'react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations('landing.header')

  return (
    <div className="relative">
      <header className="flex items-center justify-between py-4 md:py-6">
        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
          >
            {t('features')}
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
          >
            {t('pricing')}
          </a>
          <a
            href="#about"
            className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
          >
            {t('about')}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Button size="sm" className="hidden sm:inline-flex">
            {t('requestDemo')}
          </Button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t('menu')}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-navy-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <a href="#features" className="text-sm font-medium text-navy dark:text-white py-2" onClick={() => setIsMenuOpen(false)}>
              {t('features')}
            </a>
            <a href="#pricing" className="text-sm font-medium text-navy dark:text-white py-2" onClick={() => setIsMenuOpen(false)}>
              {t('pricing')}
            </a>
            <a href="#about" className="text-sm font-medium text-navy dark:text-white py-2" onClick={() => setIsMenuOpen(false)}>
              {t('about')}
            </a>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
                {t('requestDemo')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
