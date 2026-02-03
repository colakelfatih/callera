import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16'da appDir artık stable, experimental olarak işaretlenmesine gerek yok
  // output: 'standalone', // Temporarily disabled for Docker build
}

export default withNextIntl(nextConfig)
