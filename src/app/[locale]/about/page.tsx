'use client'

import React from 'react'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { useTranslations } from 'next-intl'
import { Users, Target, Lightbulb, Heart, Globe, Zap } from 'lucide-react'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-1 py-12 sm:py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-8 sm:p-12 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
                {t('mission.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {t('mission.content')}
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-6 text-center">
                {t('story.title')}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('story.paragraph1')}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('story.paragraph2')}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('story.paragraph3')}
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-10 text-center">
              {t('values.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Lightbulb className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                  {t('values.innovation.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('values.innovation.content')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Heart className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                  {t('values.customer.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('values.customer.content')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                  {t('values.teamwork.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('values.teamwork.content')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Globe className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                  {t('values.transparency.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('values.transparency.content')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                  {t('values.efficiency.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('values.efficiency.content')}
                </p>
              </div>
              <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                  {t('values.quality.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('values.quality.content')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-navy dark:bg-navy-900 rounded-2xl p-8 sm:p-12 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-300">{t('stats.customers')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1M+</div>
                <div className="text-gray-300">{t('stats.messages')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-gray-300">{t('stats.calls')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-300">{t('stats.uptime')}</div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('contact.subtitle')}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>E-posta:</strong> info@cevapliyoruz.com<br />
              <strong>Website:</strong> www.cevapliyoruz.com
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
