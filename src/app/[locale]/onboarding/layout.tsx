import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { OnboardingRepository } from '@/repositories/onboarding.repository'

export const dynamic = 'force-dynamic'

export default async function OnboardingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // If onboarding is already completed, redirect to dashboard
  const isCompleted = await OnboardingRepository.isCompleted(user.id)
  if (isCompleted) {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      {/* Minimal Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="font-display font-bold text-primary text-xl">
            Callera
          </div>
          <a
            href={`/${locale}/login`}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            Çıkış
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl">
          {children}
        </div>
      </main>
    </div>
  )
}
