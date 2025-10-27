import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import trMessages from './messages/tr/tr.json'
import enMessages from './messages/en/en.json'

const locales = ['tr', 'en'] as const
const fallbackLocale = 'tr'

const messages = {
    tr: trMessages,
    en: enMessages
}

export default getRequestConfig(async ({ locale }) => {
    // normalize / fallback
    let activeLocale = locale

    if (!activeLocale || !locales.includes(activeLocale as any)) {
        activeLocale = fallbackLocale
    }

    return {
        messages: messages[activeLocale as keyof typeof messages],
        locale: activeLocale
    }
})