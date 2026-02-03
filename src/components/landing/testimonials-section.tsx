'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const t = useTranslations('landing.testimonials')

  const testimonials = [
    {
      name: t('testimonial1.name'),
      role: t('testimonial1.role'),
      company: t('testimonial1.company'),
      content: t('testimonial1.content'),
      avatar: 'AK',
      rating: 5,
    },
    {
      name: t('testimonial2.name'),
      role: t('testimonial2.role'),
      company: t('testimonial2.company'),
      content: t('testimonial2.content'),
      avatar: 'MÖ',
      rating: 5,
    },
    {
      name: t('testimonial3.name'),
      role: t('testimonial3.role'),
      company: t('testimonial3.company'),
      content: t('testimonial3.content'),
      avatar: 'SY',
      rating: 5,
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{testimonial.avatar}</span>
              </div>
              <div>
                <p className="font-semibold text-navy dark:text-white text-sm">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
