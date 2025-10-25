import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
    locales: ['tr', 'en'],
    defaultLocale: 'tr'
})

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|icon.png|favicon.ico|logo.png).*)',
    ],
}