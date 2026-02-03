'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ArrowRight, MessageCircle } from 'lucide-react'

export function CTASection() {
  const t = useTranslations('landing.cta')
  const params = useParams()
  const locale = params.locale as string

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            {t('badge')}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto">
            {t('title')}
          </h2>
          
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`/${locale}/register`}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                {t('tryFree')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
            >
              {t('requestDemo')}
            </Button>
          </div>

          <p className="text-white/70 text-sm mt-6">
            {t('noCreditCard')}
          </p>
        </div>
      </div>
    </section>
  )
}
