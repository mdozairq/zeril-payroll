import { execSync } from 'node:child_process'
import { join } from 'node:path'

/** Vitest is run from projects/payroll-api (see package.json scripts). */
const apiRoot = process.cwd()

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${join(apiRoot, '.vitest.db')}`
}
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-ci'
process.env.X402_DEV_BYPASS = 'true'

execSync('npx prisma generate', { cwd: apiRoot, stdio: 'inherit' })
execSync('npx prisma db push --skip-generate', { cwd: apiRoot, stdio: 'inherit' })
