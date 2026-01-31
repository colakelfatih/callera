'use client'

import { useActionState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Send, CheckCircle, Loader2, PartyPopper, AlertCircle } from 'lucide-react'
import { sendTestMessage, skipTestMessage, completeOnboarding, goBackToIntegrationStep, type ActionState } from '@/actions/onboarding.actions'
import { Button } from '@/components/ui/button'

interface StepTestMessageProps {
  hasIntegration: boolean
  locale: string
}

export function StepTestMessage({ hasIntegration, locale }: StepTestMessageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [state, formAction, isSubmitting] = useActionState<ActionState | null, FormData>(
    sendTestMessage,
    null
  )

  const isSuccess = state?.success && state?.nextStep === 4

  // Handle skip
  const handleSkip = () => {
    startTransition(async () => {
      await skipTestMessage()
      router.refresh()
    })
  }

  // Handle complete
  const handleComplete = () => {
    startTransition(async () => {
      await completeOnboarding()
    })
  }

  // Handle go back to integration step
  const handleGoBackToIntegration = () => {
    startTransition(async () => {
      await goBackToIntegrationStep()
      router.refresh()
    })
  }

  // If no integration, show skip option
  if (!hasIntegration) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} className="text-yellow-600 dark:text-yellow-400" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            Entegrasyon Gerekli
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Test mesajı göndermek için önce bir mesajlaşma platformu bağlamanız gerekiyor.
            Şimdilik atlayabilir, daha sonra Ayarlar'dan bağlayabilirsiniz.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleGoBackToIntegration}
            disabled={isPending}
          >
            {isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Entegrasyon Bağla
          </Button>
          <Button
            onClick={handleSkip}
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Atla ve Tamamla
          </Button>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <PartyPopper size={40} className="text-green-600 dark:text-green-400" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Tebrikler! 🎉
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Kurulum başarıyla tamamlandı. Test mesajınız gönderildi.
            Artık Callera'yı kullanmaya başlayabilirsiniz!
          </p>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isPending}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <CheckCircle size={18} className="mr-2" />
          )}
          Dashboard'a Git
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={28} className="text-primary" />
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Her şeyin düzgün çalıştığını doğrulamak için kendinize bir test mesajı gönderin.
        </p>
      </div>

      {/* Error Message */}
      {state?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Telefon Numarası <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="tel"
              name="phoneNumber"
              required
              placeholder="+90 5XX XXX XXXX"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-lg"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            WhatsApp'a kayıtlı telefon numaranızı girin (ülke kodu ile birlikte)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            disabled={isPending || isSubmitting}
            className="sm:flex-1 text-slate-500"
          >
            Şimdilik Atla
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="sm:flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Test Mesajı Gönder
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
