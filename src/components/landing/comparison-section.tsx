'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Check, X, Minus } from 'lucide-react'

export function ComparisonSection() {
  const t = useTranslations('landing.comparison')

  const features = [
    { key: 'unifiedInbox', cevapliyoruz: true, zendesk: true, freshdesk: true, intercom: true },
    { key: 'aiCalling', cevapliyoruz: true, zendesk: false, freshdesk: false, intercom: false },
    { key: 'whatsappIntegration', cevapliyoruz: true, zendesk: 'paid', freshdesk: 'paid', intercom: true },
    { key: 'instagramIntegration', cevapliyoruz: true, zendesk: 'paid', freshdesk: true, intercom: true },
    { key: 'aiResponses', cevapliyoruz: true, zendesk: 'paid', freshdesk: 'paid', intercom: 'paid' },
    { key: 'automationFlows', cevapliyoruz: true, zendesk: true, freshdesk: true, intercom: true },
    { key: 'crm', cevapliyoruz: true, zendesk: 'paid', freshdesk: true, intercom: 'paid' },
    { key: 'turkishSupport', cevapliyoruz: true, zendesk: false, freshdesk: false, intercom: false },
    { key: 'localPricing', cevapliyoruz: true, zendesk: false, freshdesk: false, intercom: false },
    { key: 'freeSetup', cevapliyoruz: true, zendesk: false, freshdesk: false, intercom: false },
  ]

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-green-500 mx-auto" />
    } else if (value === false) {
      return <X className="w-5 h-5 text-red-400 mx-auto" />
    } else if (value === 'paid') {
      return <span className="text-xs text-orange-500 font-medium">{t('paidAddon')}</span>
    }
    return <Minus className="w-5 h-5 text-gray-400 mx-auto" />
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 dark:bg-navy-900/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {t('feature')}
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-lg font-bold text-primary">Cevaplıyoruz</span>
                    <span className="text-xs text-gray-500">{t('startingFrom')} ₺249/{t('month')}</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Zendesk</span>
                    <span className="text-xs text-gray-500">$55/{t('month')}</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Freshdesk</span>
                    <span className="text-xs text-gray-500">$35/{t('month')}</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Intercom</span>
                    <span className="text-xs text-gray-500">$74/{t('month')}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr 
                  key={feature.key} 
                  className={`border-b border-gray-100 dark:border-gray-800 ${
                    index % 2 === 0 ? 'bg-white dark:bg-navy-800/50' : ''
                  }`}
                >
                  <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {t(`features.${feature.key}`)}
                  </td>
                  <td className="py-4 px-4 text-center bg-primary/5">
                    {renderValue(feature.cevapliyoruz)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderValue(feature.zendesk)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderValue(feature.freshdesk)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {renderValue(feature.intercom)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}
