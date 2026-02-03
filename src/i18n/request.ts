import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale

  // Validate the locale
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale
  }

  // Load messages for current locale
  const messages = (await import(`../messages/${locale}/${locale}.json`)).default
  
  // Load fallback messages (Turkish)
  const fallbackMessages = locale !== 'tr' 
    ? (await import(`../messages/tr/tr.json`)).default 
    : messages

  // Merge messages with fallback
  const mergedMessages = locale !== 'tr' 
    ? deepMerge(fallbackMessages, messages) 
    : messages

  return {
    locale,
    messages: mergedMessages,
    onError(error) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Translation missing:', error.message)
      }
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`
    }
  }
})

// Deep merge utility for merging translation objects
function deepMerge<T extends Record<string, unknown>>(target: T, source: T): T {
  const result = { ...target } as T
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]
      
      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue
      }
    }
  }
  
  return result
}
