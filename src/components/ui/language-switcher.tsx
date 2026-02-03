'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const t = useTranslations('language')

    const newLocale = locale === 'tr' ? 'en' : 'tr'
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)

    const handleLanguageChange = () => {
        // Full page navigation to ensure locale change takes effect
        window.location.href = newPathname
    }

    return (
        <button
            onClick={handleLanguageChange}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
            title={locale === 'tr' ? t('switchToEnglish') : t('switchToTurkish')}
        >
            <Globe size={18} />
            <span className="text-xs font-bold uppercase">{newLocale}</span>
        </button>
    )
}
