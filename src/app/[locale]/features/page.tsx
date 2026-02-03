'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { 
  MessageSquare, 
  Phone, 
  Bot, 
  Zap, 
  BarChart3, 
  Users, 
  Shield, 
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Instagram,
  Mail,
  Workflow,
  Brain,
  Globe,
  Headphones
} from 'lucide-react'

export default function FeaturesPage() {
  const t = useTranslations('features')
  const params = useParams()
  const locale = params.locale as string

  const mainFeatures = [
    {
      icon: Bot,
      title: t('main.aiCalling.title'),
      description: t('main.aiCalling.description'),
      highlight: t('main.aiCalling.highlight'),
      color: 'from-blue-500 to-indigo-600',
      details: [
        t('main.aiCalling.details.1'),
        t('main.aiCalling.details.2'),
        t('main.aiCalling.details.3'),
        t('main.aiCalling.details.4'),
      ]
    },
    {
      icon: MessageSquare,
      title: t('main.unifiedInbox.title'),
      description: t('main.unifiedInbox.description'),
      highlight: t('main.unifiedInbox.highlight'),
      color: 'from-purple-500 to-pink-600',
      details: [
        t('main.unifiedInbox.details.1'),
        t('main.unifiedInbox.details.2'),
        t('main.unifiedInbox.details.3'),
        t('main.unifiedInbox.details.4'),
      ]
    },
    {
      icon: Brain,
      title: t('main.aiResponses.title'),
      description: t('main.aiResponses.description'),
      highlight: t('main.aiResponses.highlight'),
      color: 'from-emerald-500 to-teal-600',
      details: [
        t('main.aiResponses.details.1'),
        t('main.aiResponses.details.2'),
        t('main.aiResponses.details.3'),
        t('main.aiResponses.details.4'),
      ]
    },
    {
      icon: Workflow,
      title: t('main.automation.title'),
      description: t('main.automation.description'),
      highlight: t('main.automation.highlight'),
      color: 'from-orange-500 to-red-600',
      details: [
        t('main.automation.details.1'),
        t('main.automation.details.2'),
        t('main.automation.details.3'),
        t('main.automation.details.4'),
      ]
    },
  ]

  const differentiators = [
    {
      icon: Phone,
      title: t('differentiators.realCalls.title'),
      description: t('differentiators.realCalls.description'),
    },
    {
      icon: Globe,
      title: t('differentiators.multiChannel.title'),
      description: t('differentiators.multiChannel.description'),
    },
    {
      icon: Sparkles,
      title: t('differentiators.smartAI.title'),
      description: t('differentiators.smartAI.description'),
    },
    {
      icon: Clock,
      title: t('differentiators.realtime.title'),
      description: t('differentiators.realtime.description'),
    },
    {
      icon: Shield,
      title: t('differentiators.security.title'),
      description: t('differentiators.security.description'),
    },
    {
      icon: Headphones,
      title: t('differentiators.support.title'),
      description: t('differentiators.support.description'),
    },
  ]

  const channels = [
    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' },
    { name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-500' },
    { name: 'Email', icon: Mail, color: 'bg-blue-500' },
    { name: 'Phone', icon: Phone, color: 'bg-indigo-500' },
  ]

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-1 py-12 sm:py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('hero.badge')}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-navy dark:text-white mb-6 leading-tight">
              {t('hero.title')}
              <span className="block text-primary">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`/${locale}/register`}>
                <Button variant="primary" size="lg" className="gap-2">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href={`/${locale}/pricing`}>
                <Button variant="outline" size="lg">
                  {t('hero.secondaryCta')}
                </Button>
              </a>
            </div>
          </div>

          {/* Supported Channels */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
                {t('channels.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('channels.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {channels.map((channel) => (
                <div
                  key={channel.name}
                  className="flex items-center gap-3 bg-white dark:bg-navy-800 rounded-xl px-6 py-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center`}>
                    <channel.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-navy dark:text-white">{channel.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
                {t('main.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('main.subtitle')}
              </p>
            </div>
            <div className="space-y-16">
              {mainFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                      {feature.description}
                    </p>
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl p-4 mb-6">
                      <p className="text-primary dark:text-primary font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {feature.highlight}
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <feature.icon className="w-24 h-24 text-white/30 absolute right-4 bottom-4" />
                      <div className="relative z-10 text-center">
                        <feature.icon className="w-16 h-16 text-white mx-auto mb-4" />
                        <p className="text-white font-semibold text-lg">{feature.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Sets Us Apart */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
                {t('differentiators.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('differentiators.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {differentiators.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group"
                >
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-navy dark:bg-navy-900 rounded-2xl p-8 sm:p-12 mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {t('stats.title')}
              </h2>
              <p className="text-gray-300">
                {t('stats.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">70%</div>
                <div className="text-gray-300">{t('stats.manualWork')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">3×</div>
                <div className="text-gray-300">{t('stats.responseSpeed')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">{t('stats.availability')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-300">{t('stats.uptime')}</div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
                {t('comparison.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('comparison.subtitle')}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-navy-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left p-4 font-semibold text-navy dark:text-white">{t('comparison.feature')}</th>
                    <th className="text-center p-4 font-semibold text-primary bg-primary/5">{t('comparison.callera')}</th>
                    <th className="text-center p-4 font-semibold text-gray-500">{t('comparison.others')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-gray-300">{t('comparison.features.aiCalling')}</td>
                    <td className="p-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-gray-300">{t('comparison.features.unifiedInbox')}</td>
                    <td className="p-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-gray-300">{t('comparison.features.aiResponses')}</td>
                    <td className="p-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-gray-300">{t('comparison.features.noCode')}</td>
                    <td className="p-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 text-gray-700 dark:text-gray-300">{t('comparison.features.crm')}</td>
                    <td className="p-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{t('comparison.features.turkishSupport')}</td>
                    <td className="p-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`/${locale}/register`}>
                <Button variant="primary" size="lg" className="gap-2">
                  {t('cta.primary')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Button variant="outline" size="lg">
                {t('cta.secondary')}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
