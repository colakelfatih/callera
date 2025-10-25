import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: 'Callera - AI Assistant Platform',
  description: 'An AI assistant that calls your customers for you. Social messages, calls, and CRM in one flow.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans bg-background-light dark:bg-background-dark text-navy dark:text-gray-200">
        {children}
      </body>
    </html>
  )
}
