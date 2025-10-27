'use client'

import React from 'react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('landing.footer')

  return (
    <footer className="bg-navy dark:bg-navy-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo variant="full" size="lg" className="text-white mb-4" />
            <p className="text-gray-300 mb-6 max-w-md">
              {t('tagline')}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-navy">
                {t('requestDemo')}
              </Button>
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                {t('tryFree')}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('product')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('features')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('pricing')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('integrations')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('api')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('company')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('careers')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t('copyright')}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{t('privacy')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{t('terms')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{t('security')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
