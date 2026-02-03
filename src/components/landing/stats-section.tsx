'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

export function StatsSection() {
  const t = useTranslations('landing.stats')

  const stats = [
    { value: '500+', label: t('customers') },
    { value: '1M+', label: t('messages') },
    { value: '50K+', label: t('calls') },
    { value: '%70', label: t('timeSaved') },
    { value: '99.9%', label: t('uptime') },
    { value: '4.9/5', label: t('rating') },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-navy dark:bg-navy-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
