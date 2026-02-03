'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'

export function PricingSection() {
  const t = useTranslations('landing.pricing')
  const params = useParams()
  const locale = params.locale as string
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: t('starter.name'),
      monthlyPrice: 299,
      annualPrice: 249,
      features: [
        { text: t('starter.feature1'), included: true },
        { text: t('starter.feature2'), included: true },
        { text: t('starter.feature3'), included: true },
        { text: t('starter.feature4'), included: false },
        { text: t('starter.feature5'), included: false },
      ],
      popular: false,
    },
    {
      name: t('professional.name'),
      monthlyPrice: 699,
      annualPrice: 599,
      features: [
        { text: t('professional.feature1'), included: true },
        { text: t('professional.feature2'), included: true },
        { text: t('professional.feature3'), included: true },
        { text: t('professional.feature4'), included: true },
        { text: t('professional.feature5'), included: true },
      ],
      popular: true,
    },
    {
      name: t('enterprise.name'),
      monthlyPrice: 1499,
      annualPrice: 1299,
      features: [
        { text: t('enterprise.feature1'), included: true },
        { text: t('enterprise.feature2'), included: true },
        { text: t('enterprise.feature3'), included: true },
        { text: t('enterprise.feature4'), included: true },
        { text: t('enterprise.feature5'), included: true },
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-24">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          {t('subtitle')}
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-navy dark:text-white' : 'text-gray-500'}`}>
            {t('monthly')}
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isAnnual ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-navy dark:text-white' : 'text-gray-500'}`}>
            {t('annual')}
          </span>
          {isAnnual && (
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">
              {t('save')}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-sm border-2 transition-all hover:shadow-lg ${
              plan.popular
                ? 'border-primary md:scale-105'
                : 'border-gray-100 dark:border-gray-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  {t('popular')}
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-navy dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-navy dark:text-white">
                  ₺{isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/{t('month')}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      feature.included
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <a href={`/${locale}/register`}>
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full"
              >
                {t('cta')}
              </Button>
            </a>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <a href={`/${locale}/pricing`} className="text-primary hover:underline text-sm font-medium">
          {t('viewAll')} →
        </a>
      </div>
    </section>
  )
}
