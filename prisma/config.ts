// Prisma Config for Migrate (Prisma 7+)
export default {
  // Required for `prisma migrate dev`
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://callera:callera_password@localhost:5432/callera_db?schema=public',
  },
  adapter: {
    provider: 'postgresql',
    url:
      process.env.DATABASE_URL ??
      'postgresql://callera:callera_password@localhost:5432/callera_db?schema=public',
  },
}
