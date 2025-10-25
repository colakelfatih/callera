import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Phone, Users, Zap, BarChart3, Calendar } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Unified Inbox',
    description: 'All your customer conversations in one place. Instagram, WhatsApp, Email, and Phone calls unified.',
    stats: '3× faster first contact'
  },
  {
    icon: Phone,
    title: 'AI Calling & Callback',
    description: 'AI makes outbound calls, handles conversations, and schedules callbacks automatically.',
    stats: '70% reduction in manual work'
  },
  {
    icon: Users,
    title: 'Auto Labeling',
    description: 'AI automatically labels conversations by intent, sentiment, and priority.',
    stats: 'Reduce manual labeling by 70%'
  },
  {
    icon: Users,
    title: 'CRM & Pipeline',
    description: 'Seamless CRM integration with pipeline management and contact tracking.',
    stats: 'Complete customer view'
  },
  {
    icon: Zap,
    title: 'Automation Flows',
    description: 'No-code automation builder for complex workflows and customer journeys.',
    stats: 'Unlimited possibilities'
  },
  {
    icon: BarChart3,
    title: 'Reports',
    description: 'Comprehensive analytics and insights into your customer interactions.',
    stats: 'Data-driven decisions'
  }
]

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-navy dark:text-white sm:text-4xl lg:text-5xl mb-4">
          Everything you need to manage customer relationships
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          From AI-powered calling to unified inbox management, Callera brings all your customer touchpoints together.
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
