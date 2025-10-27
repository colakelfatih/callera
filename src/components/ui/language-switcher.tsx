'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from './button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const t = useTranslations('language')

    const toggleLanguage = () => {
        const newLocale = locale === 'tr' ? 'en' : 'tr'
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
        router.push(newPathname)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="p-2"
            title={locale === 'tr' ? t('switchToEnglish') : t('switchToTurkish')}
        >
            <Globe size={20} />
            <span className="ml-1 text-xs font-medium">{locale.toUpperCase()}</span>
        </Button>
    )
}
