# payroll-api

Express + Prisma backend for PayRoll: companies, employees, KYC, payroll runs, payments/payslips, tax estimates, off-ramp orchestration, audit logs.

## Prerequisites

- Node.js >= 20
- SQLite (default dev) or PostgreSQL (production)

## Setup

```bash
npm ci
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

API: `http://localhost:3001` — health check: `GET /api/health`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run start` | Run compiled server |
| `npm run test` | Vitest + Supertest |
| `npm run check-types` | `tsc --noEmit` |
| `npm run render:build` | Prisma generate + compile (Render build) |
| `npm run render:start` | `db push` + start (Render start) |

## Deploy to Render

1. Create **Web Service** with root directory `projects/payroll-api`.
2. Build: `npm ci && npm run render:build` · Start: `npm run render:start`.
3. Add **Render PostgreSQL**; set `DATABASE_URL` to the internal connection string.
4. Set `JWT_SECRET`, `FRONTEND_ORIGIN` (your Vercel URL), and optional Pinata/Saber keys.
5. Health check: `/api/health`.

Or use the repo blueprint: [`render.yaml`](../../render.yaml) (Render Dashboard → New → Blueprint).

**PostgreSQL note:** Local dev uses SQLite (`schema.prisma`). For Render Postgres, change `provider` to `postgresql` before first `db push`, or use a production branch. Details: [DEPLOYMENT.md](../../docs/DEPLOYMENT.md).

## Environment

See [.env.example](./.env.example). Key variables:

- `DATABASE_URL` — `file:./prisma/dev.db` (dev)
- `JWT_SECRET` — wallet auth signing key
- `PINATA_*` — KYC uploads (optional; mocks when unset)
- `FRONTEND_ORIGIN` — extra CORS origins (comma-separated)
- `X402_*` — optional payment-required demo routes

## Architecture

See [../../docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

## x402 demo endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/x402` | Protocol metadata |
| GET | `/api/x402/demo-export` | Returns 402 or JSON with payment proof / dev bypass |

These routes do **not** replace JWT auth on payroll/KYC routes.
