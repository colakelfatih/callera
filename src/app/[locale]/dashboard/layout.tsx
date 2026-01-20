import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
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

  return <DashboardLayoutClient locale={locale}>{children}</DashboardLayoutClient>
}
