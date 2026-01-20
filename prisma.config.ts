import 'dotenv/config'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
    // Intentionally strict: required for migrate/dev/generate.
    // In Docker builds, pass DATABASE_URL as a BuildKit secret or build arg.
    url: env('DATABASE_URL'),
    },
})

