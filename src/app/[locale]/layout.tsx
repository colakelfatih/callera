import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { AuthProvider } from '@/components/auth/auth-provider'
import { routing } from '@/i18n/routing'

export const metadata: Metadata = {
  title: 'Cevaplıyoruz - AI Müşteri İletişim Platformu',
  description: 'Müşterileriniz için sizi arayan bir AI asistanı. Sosyal mesajlar, aramalar ve CRM tek bir akışta.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('cevapliyoruz-theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  // Load messages for the current locale
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased bg-background-light dark:bg-background-dark text-navy dark:text-gray-200 transition-colors duration-200">
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
