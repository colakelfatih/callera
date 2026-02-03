'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('landing.header')
  const tAuth = useTranslations('auth')

  return (
    <div className="relative">
      <header className="flex items-center justify-between py-4 md:py-6">
        <Logo size="lg" />

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
          >
            {t('features')}
          </a>
          <a
            href={`/${locale}/pricing`}
            className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
          >
            {t('pricing')}
          </a>
          <a
            href={`/${locale}/about`}
            className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
          >
            {t('about')}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          <a href={`/${locale}/login`} className="text-sm font-medium text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors hidden md:block">
            {tAuth('login')}
          </a>
          <a href={`/${locale}/register`}>
            <Button size="sm" className="hidden sm:inline-flex">
              {tAuth('register')}
            </Button>
          </a>

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
            <a href={`/${locale}/pricing`} className="text-sm font-medium text-navy dark:text-white py-2" onClick={() => setIsMenuOpen(false)}>
              {t('pricing')}
            </a>
            <a href={`/${locale}/about`} className="text-sm font-medium text-navy dark:text-white py-2" onClick={() => setIsMenuOpen(false)}>
              {t('about')}
            </a>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <a href={`/${locale}/login`} className="block">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  {tAuth('login')}
                </Button>
              </a>
              <a href={`/${locale}/register`} className="block">
                <Button size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  {tAuth('register')}
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
