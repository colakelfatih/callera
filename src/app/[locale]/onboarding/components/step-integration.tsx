'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ExternalLink, Loader2, ArrowRight } from 'lucide-react'
import { getEnabledIntegrations, type IntegrationConfig } from '@/config/integrations'
import { skipIntegrationStep, completeIntegrationStep } from '@/actions/onboarding.actions'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import type { IntegrationStatus } from '@/repositories/integration.repository'

interface StepIntegrationProps {
  integrationStatus: IntegrationStatus
  locale: string
}

export function StepIntegration({ integrationStatus, locale }: StepIntegrationProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const enabledIntegrations = getEnabledIntegrations()

  // Check if an integration is connected
  const isConnected = (integrationId: string): boolean => {
    switch (integrationId) {
      case 'whatsapp':
        return integrationStatus.hasWhatsApp
      case 'instagram':
        return integrationStatus.hasInstagram
      case 'facebook':
        return integrationStatus.hasFacebook
      case 'telegram':
        return integrationStatus.hasTelegram
      default:
        return false
    }
  }

  // Get connection URL for an integration
  const getConnectionUrl = (integrationId: string): string => {
    switch (integrationId) {
      case 'whatsapp':
        return `/${locale}/dashboard/integrations?connect=whatsapp`
      case 'instagram':
        return `/api/instagram/auth`
      default:
        return '#'
    }
  }

  // Handle skip
  const handleSkip = () => {
    startTransition(async () => {
      await skipIntegrationStep()
      router.refresh()
    })
  }

  // Handle continue (when at least one is connected)
  const handleContinue = () => {
    startTransition(async () => {
      await completeIntegrationStep()
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Müşterilerinizle iletişim kurmak için en az bir mesajlaşma platformu bağlamanızı öneriyoruz.
          Daha sonra Ayarlar &gt; Entegrasyonlar bölümünden de bağlayabilirsiniz.
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enabledIntegrations.map((integration) => {
          const connected = isConnected(integration.id)
          const Icon = integration.icon

          return (
            <div
              key={integration.id}
              className={`relative p-5 rounded-xl border-2 transition-all flex flex-col h-full ${
                connected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : selectedIntegration === integration.id
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Connected Badge */}
              {connected && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <CheckCircle size={12} />
                    Bağlı
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                {integration.id === 'whatsapp' ? (
                  <WhatsAppIcon size={24} style={{ color: integration.color }} />
                ) : (
                  <Icon size={24} style={{ color: integration.color }} />
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                {integration.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow">
                {integration.description}
              </p>

              {/* Action Button - Always at bottom */}
              <div className="mt-4">
                {connected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-full text-green-600 border-green-200 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} className="flex-shrink-0" />
                    <span>Bağlandı</span>
                  </Button>
                ) : (
                  <a href={getConnectionUrl(integration.id)} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                      style={{ 
                        borderColor: integration.color,
                        color: integration.color,
                      }}
                    >
                      <span>Bağla</span>
                      <ExternalLink size={14} className="flex-shrink-0" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming Soon */}
      <div className="text-center text-sm text-slate-400 dark:text-slate-500">
        Facebook Messenger ve Telegram desteği yakında eklenecek
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          onClick={handleSkip}
          disabled={isPending}
          className="sm:flex-1 text-slate-500"
        >
          {isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
          Şimdilik Atla
        </Button>

        {integrationStatus.hasAny && (
          <Button
            onClick={handleContinue}
            disabled={isPending}
            className="sm:flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : (
              <>
                Devam Et
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
