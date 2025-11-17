import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { AuthProvider } from '@/components/auth/auth-provider'

const locales = ['tr', 'en']

export const metadata: Metadata = {
  title: 'Callera - AI Assistant Platform',
  description: 'An AI assistant that calls your customers for you. Social messages, calls, and CRM in one flow.',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Load messages using next-intl's built-in method
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="font-sans bg-background-light dark:bg-background-dark text-navy dark:text-gray-200">
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}