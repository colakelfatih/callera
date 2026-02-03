'use client'

import React from 'react'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { useTranslations } from 'next-intl'

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy')

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

              {/* Data Collection */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.dataCollection.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.dataCollection.content')}
                </p>
                
                <h3 className="text-lg font-medium text-navy dark:text-white mb-2">
                  {t('sections.dataCollection.personal.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                  <li>{t('sections.dataCollection.personal.items.name')}</li>
                  <li>{t('sections.dataCollection.personal.items.email')}</li>
                  <li>{t('sections.dataCollection.personal.items.phone')}</li>
                  <li>{t('sections.dataCollection.personal.items.company')}</li>
                </ul>

                <h3 className="text-lg font-medium text-navy dark:text-white mb-2">
                  {t('sections.dataCollection.usage.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.dataCollection.usage.items.ip')}</li>
                  <li>{t('sections.dataCollection.usage.items.browser')}</li>
                  <li>{t('sections.dataCollection.usage.items.pages')}</li>
                  <li>{t('sections.dataCollection.usage.items.time')}</li>
                </ul>
              </section>

              {/* How We Use */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.howWeUse.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.howWeUse.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.howWeUse.items.provide')}</li>
                  <li>{t('sections.howWeUse.items.improve')}</li>
                  <li>{t('sections.howWeUse.items.communicate')}</li>
                  <li>{t('sections.howWeUse.items.support')}</li>
                  <li>{t('sections.howWeUse.items.security')}</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.dataSharing.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.dataSharing.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.dataSharing.items.providers')}</li>
                  <li>{t('sections.dataSharing.items.legal')}</li>
                  <li>{t('sections.dataSharing.items.consent')}</li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.dataSecurity.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.dataSecurity.content')}
                </p>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.cookies.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.cookies.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.cookies.items.essential')}</li>
                  <li>{t('sections.cookies.items.analytics')}</li>
                  <li>{t('sections.cookies.items.functional')}</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.yourRights.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.yourRights.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.yourRights.items.access')}</li>
                  <li>{t('sections.yourRights.items.correct')}</li>
                  <li>{t('sections.yourRights.items.delete')}</li>
                  <li>{t('sections.yourRights.items.restrict')}</li>
                  <li>{t('sections.yourRights.items.portability')}</li>
                  <li>{t('sections.yourRights.items.object')}</li>
                </ul>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.retention.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.retention.content')}
                </p>
              </section>

              {/* Children */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.children.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.children.content')}
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
                  <strong>E-posta:</strong> privacy@cevapliyoruz.com<br />
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
