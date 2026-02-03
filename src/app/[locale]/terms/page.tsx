'use client'

import React from 'react'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { useTranslations } from 'next-intl'

export default function TermsPage() {
  const t = useTranslations('legal.terms')

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-1 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-8">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {t('lastUpdated')}: 3 Şubat 2026
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.introduction.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.introduction.content')}
                </p>
              </section>

              {/* Acceptance */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.acceptance.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.acceptance.content')}
                </p>
              </section>

              {/* Services */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.services.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.services.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.services.items.unified')}</li>
                  <li>{t('sections.services.items.ai')}</li>
                  <li>{t('sections.services.items.crm')}</li>
                  <li>{t('sections.services.items.automation')}</li>
                </ul>
              </section>

              {/* Account */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.account.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.account.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.account.items.accurate')}</li>
                  <li>{t('sections.account.items.security')}</li>
                  <li>{t('sections.account.items.notify')}</li>
                  <li>{t('sections.account.items.responsible')}</li>
                </ul>
              </section>

              {/* Acceptable Use */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.acceptableUse.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.acceptableUse.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.acceptableUse.items.laws')}</li>
                  <li>{t('sections.acceptableUse.items.spam')}</li>
                  <li>{t('sections.acceptableUse.items.harmful')}</li>
                  <li>{t('sections.acceptableUse.items.rights')}</li>
                  <li>{t('sections.acceptableUse.items.interfere')}</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.intellectualProperty.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.intellectualProperty.content')}
                </p>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.payment.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.payment.content')}
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.termination.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.termination.content')}
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.liability.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.liability.content')}
                </p>
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.changes.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.changes.content')}
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.contact.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.contact.content')}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  <strong>E-posta:</strong> info@cevapliyoruz.com<br />
                  <strong>Website:</strong> www.cevapliyoruz.com
                </p>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
