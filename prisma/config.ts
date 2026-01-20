// Prisma Config for Migrate (Prisma 7+)
export default {
  adapter: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL,
  },
}
