'use client'

import React from 'react'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { useTranslations } from 'next-intl'
import { Trash2, Mail, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DataDeletionPage() {
  const t = useTranslations('dataDeletion')

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-1 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('subtitle')}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              {/* Introduction */}
              <section className="bg-white dark:bg-navy-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {t('sections.intro.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.intro.content')}
                </p>
              </section>

              {/* What Data We Collect */}
              <section className="bg-white dark:bg-navy-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.dataCollected.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.dataCollected.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.dataCollected.items.profile')}</li>
                  <li>{t('sections.dataCollected.items.messages')}</li>
                  <li>{t('sections.dataCollected.items.connections')}</li>
                  <li>{t('sections.dataCollected.items.usage')}</li>
                </ul>
              </section>

              {/* How to Request Deletion */}
              <section className="bg-white dark:bg-navy-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.howToDelete.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {t('sections.howToDelete.content')}
                </p>

                {/* Method 1: From Settings */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-navy-900 rounded-lg">
                  <h3 className="font-medium text-navy dark:text-white mb-3">
                    {t('sections.howToDelete.method1.title')}
                  </h3>
                  <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>{t('sections.howToDelete.method1.step1')}</li>
                    <li>{t('sections.howToDelete.method1.step2')}</li>
                    <li>{t('sections.howToDelete.method1.step3')}</li>
                    <li>{t('sections.howToDelete.method1.step4')}</li>
                  </ol>
                </div>

                {/* Method 2: Contact Us */}
                <div className="p-4 bg-gray-50 dark:bg-navy-900 rounded-lg">
                  <h3 className="font-medium text-navy dark:text-white mb-3">
                    {t('sections.howToDelete.method2.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('sections.howToDelete.method2.content')}
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <a 
                      href="mailto:privacy@cevapliyoruz.com?subject=Data%20Deletion%20Request" 
                      className="text-primary hover:underline font-medium"
                    >
                      privacy@cevapliyoruz.com
                    </a>
                  </div>
                </div>
              </section>

              {/* What Happens After Deletion */}
              <section className="bg-white dark:bg-navy-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  {t('sections.afterDeletion.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.afterDeletion.content')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t('sections.afterDeletion.items.permanent')}</li>
                  <li>{t('sections.afterDeletion.items.timeframe')}</li>
                  <li>{t('sections.afterDeletion.items.confirmation')}</li>
                  <li>{t('sections.afterDeletion.items.exceptions')}</li>
                </ul>
              </section>

              {/* Facebook/Instagram Specific */}
              <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 sm:p-8 border border-blue-100 dark:border-blue-800">
                <h2 className="text-xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.facebook.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('sections.facebook.content')}
                </p>
                <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                  <li>{t('sections.facebook.step1')}</li>
                  <li>{t('sections.facebook.step2')}</li>
                  <li>{t('sections.facebook.step3')}</li>
                  <li>{t('sections.facebook.step4')}</li>
                </ol>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('sections.facebook.note')}
                </p>
              </section>

              {/* Contact */}
              <section className="text-center py-8">
                <h2 className="text-xl font-semibold text-navy dark:text-white mb-4">
                  {t('sections.contact.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('sections.contact.content')}
                </p>
                <a href="mailto:privacy@cevapliyoruz.com?subject=Data%20Deletion%20Request">
                  <Button variant="primary" size="lg">
                    <Mail className="w-5 h-5 mr-2" />
                    {t('sections.contact.cta')}
                  </Button>
                </a>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
