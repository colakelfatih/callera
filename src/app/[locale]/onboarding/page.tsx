import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { OnboardingRepository } from '@/repositories/onboarding.repository'
import { IntegrationRepository } from '@/repositories/integration.repository'
import { OnboardingProgress } from './components/onboarding-progress'
import { StepBusinessProfile } from './components/step-business-profile'
import { StepIntegration } from './components/step-integration'
import { StepTestMessage } from './components/step-test-message'

export const dynamic = 'force-dynamic'

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'İşletme Profili',
    description: 'İşletmeniz hakkında temel bilgileri girin',
  },
  {
    id: 2,
    title: 'Entegrasyon',
    description: 'Mesajlaşma platformunuzu bağlayın',
  },
  {
    id: 3,
    title: 'Test Mesajı',
    description: 'Her şeyin çalıştığını doğrulayın',
  },
]

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Get current onboarding status
  const status = await OnboardingRepository.getStatus(user.id)
  const integrationStatus = await IntegrationRepository.getStatus(user.id)

  // Determine current step (default to 1 if not started)
  // Note: Layout already handles redirect if onboardingCompleted is true
  let currentStep = status?.onboardingStep || 1
  
  // If step is 0, start at step 1
  if (currentStep === 0) {
    currentStep = 1
  }
  
  // Clamp step to valid range (1-3) since step 4 means completed
  if (currentStep > 3) {
    currentStep = 3
  }

  // Get business profile data for step 1
  const businessProfile = status ? {
    businessName: status.businessName || '',
    businessPhone: status.businessPhone || '',
    businessEmail: status.businessEmail || '',
    businessWebsite: status.businessWebsite || '',
    businessIndustry: status.businessIndustry || '',
  } : null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
      <OnboardingProgress currentStep={currentStep} steps={ONBOARDING_STEPS} />

      {/* Step Content */}
      <div className="mt-8">
        {currentStep === 1 && (
          <StepBusinessProfile initialData={businessProfile} />
        )}
        {currentStep === 2 && (
          <StepIntegration 
            integrationStatus={integrationStatus}
            locale={locale}
          />
        )}
        {currentStep === 3 && (
          <StepTestMessage 
            hasIntegration={integrationStatus.hasAny}
            locale={locale}
          />
        )}
      </div>
    </div>
  )
}
