'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Phone, Users, Zap, BarChart3, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Features() {
  const t = useTranslations('landing.features')

  const features = [
    {
      icon: MessageSquare,
      title: t('unifiedInbox.title'),
      description: t('unifiedInbox.description'),
      stats: t('unifiedInbox.stats')
    },
    {
      icon: Phone,
      title: t('aiCalling.title'),
      description: t('aiCalling.description'),
      stats: t('aiCalling.stats')
    },
    {
      icon: Users,
      title: t('autoLabeling.title'),
      description: t('autoLabeling.description'),
      stats: t('autoLabeling.stats')
    },
    {
      icon: Users,
      title: t('crm.title'),
      description: t('crm.description'),
      stats: t('crm.stats')
    },
    {
      icon: Zap,
      title: t('automation.title'),
      description: t('automation.description'),
      stats: t('automation.stats')
    },
    {
      icon: BarChart3,
      title: t('reports.title'),
      description: t('reports.description'),
      stats: t('reports.stats')
    }
  ]

  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-navy dark:text-white sm:text-4xl lg:text-5xl mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
              <div className="text-sm font-semibold text-primary">{feature.stats}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
