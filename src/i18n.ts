import { getRequestConfig } from 'next-intl/server'

const locales = ['tr', 'en', 'de', 'es'] as const
const fallbackLocale = 'tr'

export default getRequestConfig(async ({ locale }) => {
    // normalize / fallback
    let activeLocale = locale

    if (!activeLocale || !locales.includes(activeLocale as typeof locales[number])) {
        activeLocale = fallbackLocale
    }

    // Dynamic import for messages
    let messages
    try {
        messages = (await import(`./messages/${activeLocale}/${activeLocale}.json`)).default
    } catch {
        messages = (await import(`./messages/tr/tr.json`)).default
    }

    return {
        messages,
        locale: activeLocale
    }
})
