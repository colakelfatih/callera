import createMiddleware from 'next-intl/middleware'
import { defineRouting } from 'next-intl/routing'

const routing = defineRouting({
  locales: ['tr', 'en', 'de', 'es'],
  defaultLocale: 'tr',
  localePrefix: 'always'
})

export default createMiddleware(routing)

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
