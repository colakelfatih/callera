'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'

export default function PricingPage() {
  const t = useTranslations('pricing')
  const params = useParams()
  const locale = params.locale as string
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: t('plans.starter.name'),
      description: t('plans.starter.description'),
      monthlyPrice: 299,
      annualPrice: 249,
      currency: '₺',
      features: [
        { text: t('plans.starter.features.users'), included: true },
        { text: t('plans.starter.features.messages'), included: true },
        { text: t('plans.starter.features.channels'), included: true },
        { text: t('plans.starter.features.crm'), included: true },
        { text: t('plans.starter.features.support'), included: true },
        { text: t('plans.starter.features.ai'), included: false },
        { text: t('plans.starter.features.automation'), included: false },
        { text: t('plans.starter.features.api'), included: false },
      ],
      popular: false,
      cta: t('plans.starter.cta'),
    },
    {
      name: t('plans.professional.name'),
      description: t('plans.professional.description'),
      monthlyPrice: 699,
      annualPrice: 599,
      currency: '₺',
      features: [
        { text: t('plans.professional.features.users'), included: true },
        { text: t('plans.professional.features.messages'), included: true },
        { text: t('plans.professional.features.channels'), included: true },
        { text: t('plans.professional.features.crm'), included: true },
        { text: t('plans.professional.features.support'), included: true },
        { text: t('plans.professional.features.ai'), included: true },
        { text: t('plans.professional.features.automation'), included: true },
        { text: t('plans.professional.features.api'), included: false },
      ],
      popular: true,
      cta: t('plans.professional.cta'),
    },
    {
      name: t('plans.enterprise.name'),
      description: t('plans.enterprise.description'),
      monthlyPrice: 1499,
      annualPrice: 1299,
      currency: '₺',
      features: [
        { text: t('plans.enterprise.features.users'), included: true },
        { text: t('plans.enterprise.features.messages'), included: true },
        { text: t('plans.enterprise.features.channels'), included: true },
        { text: t('plans.enterprise.features.crm'), included: true },
        { text: t('plans.enterprise.features.support'), included: true },
        { text: t('plans.enterprise.features.ai'), included: true },
        { text: t('plans.enterprise.features.automation'), included: true },
        { text: t('plans.enterprise.features.api'), included: true },
      ],
      popular: false,
      cta: t('plans.enterprise.cta'),
    },
  ]

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-1 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
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
                  {t('save')} 17%
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-sm border-2 transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-primary scale-105 md:scale-110'
                    : 'border-gray-100 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                      {t('popular')}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-navy dark:text-white">
                      {plan.currency}{isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/{t('month')}</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t('billedAnnually')}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
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
                    {plan.cta}
                  </Button>
                </a>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-8 text-center">
              {t('faq.title')}
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-navy dark:text-white mb-2">
                  {t('faq.q1.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('faq.q1.answer')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-navy dark:text-white mb-2">
                  {t('faq.q2.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('faq.q2.answer')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-navy dark:text-white mb-2">
                  {t('faq.q3.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('faq.q3.answer')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-navy dark:text-white mb-2">
                  {t('faq.q4.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('faq.q4.answer')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
              {t('enterprise.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('enterprise.subtitle')}
            </p>
            <Button variant="primary" size="lg">
              {t('enterprise.cta')}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
