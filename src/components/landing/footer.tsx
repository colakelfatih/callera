'use client'

import React from 'react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('landing.footer')

  return (
    <footer className="bg-navy dark:bg-navy-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Logo variant="full" size="lg" className="text-white mb-4" />
            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-md">
              {t('tagline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-navy">
                {t('requestDemo')}
              </Button>
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                {t('tryFree')}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">{t('product')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('features')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('pricing')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('integrations')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('api')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">{t('company')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('careers')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400 text-xs sm:text-sm">
            {t('copyright')}
          </p>
          <div className="flex gap-4 sm:gap-6 mt-4 md:mt-0 flex-wrap justify-center">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">{t('privacy')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">{t('terms')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">{t('security')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
