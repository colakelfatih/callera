import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { OnboardingRepository } from '@/repositories/onboarding.repository'
import DashboardLayoutClient from './dashboard-layout-client'

// Force dynamic rendering because we use headers() for session check
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Check authentication
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Check onboarding status - redirect to onboarding if not completed
  const onboardingStatus = await OnboardingRepository.getStatus(user.id)
  if (!onboardingStatus?.onboardingCompleted) {
    redirect(`/${locale}/onboarding`)
  }

  return <DashboardLayoutClient locale={locale}>{children}</DashboardLayoutClient>
}
