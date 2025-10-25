# Internationalization (i18n) Setup

This project uses Next.js App Router with `next-intl` for internationalization support.

## Setup Overview

### 1. Dependencies
- `next-intl`: Internationalization library for Next.js

### 2. Configuration Files
- `middleware.ts`: Handles locale routing and detection
- `src/i18n.ts`: Configuration for next-intl
- `next.config.js`: Updated to use next-intl plugin

### 3. Folder Structure
```
messages/
├── tr.json    # Turkish translations
└── en.json    # English translations

src/app/
├── layout.tsx           # Root layout (no locale)
├── page.tsx             # Redirects to default locale
└── [locale]/            # Locale-specific routes
    ├── layout.tsx       # Locale layout with NextIntlClientProvider
    ├── page.tsx         # Landing page
    └── dashboard/       # Dashboard pages
```

### 4. Supported Locales
- `tr`: Turkish (default)
- `en`: English

## Usage

### In Components
```tsx
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('navigation.dialer')}</h1>
      <p>{t('common.search')}</p>
    </div>
  )
}
```

### Language Switching
```tsx
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export function Header() {
  return (
    <div>
      <LanguageSwitcher />
    </div>
  )
}
```

### Adding New Translations

1. Add new keys to both `messages/tr.json` and `messages/en.json`
2. Use the translations in components with `t('key.path')`

Example:
```json
// messages/tr.json
{
  "newSection": {
    "title": "Yeni Başlık",
    "description": "Açıklama"
  }
}

// messages/en.json
{
  "newSection": {
    "title": "New Title",
    "description": "Description"
  }
}
```

## URL Structure

- `/` → redirects to `/tr`
- `/tr` → Turkish version
- `/en` → English version
- `/tr/dashboard/dialer` → Turkish dialer page
- `/en/dashboard/dialer` → English dialer page

## Migration from Custom Context

The project has been migrated from a custom `LanguageContext` to `next-intl`:

### Before (Custom Context)
```tsx
import { useLanguage } from '@/contexts/LanguageContext'

const { t } = useLanguage()
const text = t.navigation.dialer
```

### After (next-intl)
```tsx
import { useTranslations } from 'next-intl'

const t = useTranslations()
const text = t('navigation.dialer')
```

## Benefits

1. **SEO-friendly**: Each locale has its own URL
2. **Server-side rendering**: Translations work on the server
3. **Type safety**: TypeScript support for translation keys
4. **Performance**: Optimized loading of translation files
5. **Standard**: Uses industry-standard i18n practices
