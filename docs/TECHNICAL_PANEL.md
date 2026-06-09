# Technical panel — quick reference

## Live demo setup

```bash
algokit localnet start
algokit project bootstrap all
algokit project run build

cd projects/payroll-api
cp .env.example .env
npm ci && npx prisma migrate deploy && npm run dev

cd projects/payroll-frontend
cp .env.template .env   # or configure VITE_* for testnet
npm run dev
```

## Tests

```bash
# Contracts (requires LocalNet)
cd projects/payroll-contracts && npm test

# API
cd projects/payroll-api && npm test

# Frontend
cd projects/payroll-frontend && npm test
```

## Code walkthrough (5–10 min)

1. `projects/payroll-contracts/smart_contracts/employer/contract.algo.ts` — `payEmployee`, access control.
2. `projects/payroll-contracts/smart_contracts/employer/contract.e2e.spec.ts` — full payroll E2E.
3. `projects/payroll-api/src/routes/auth.ts` — wallet auth.
4. `projects/payroll-frontend/src/contexts/PayrollContext.tsx` — on-chain pay + API records.

## x402

- `GET /api/x402` — protocol info.
- `GET /api/x402/demo-export` — returns **402** without `X-Payment-Proof`; bypass in dev with `X402_DEV_BYPASS=true`.
- Core payroll routes use **JWT**, not x402.

## 10× users (30 sec answer)

Per-company contracts; horizontal API scaling with Postgres; queued off-ramp; Redis auth challenges; CDN frontend.

## CI

- `validate.yaml` — contracts, frontend, **API** on every PR.
- `payroll-contracts-cd.yaml` — TestNet deploy on release.

## Deployment (Render + Vercel)

| Service | URL env |
|---------|---------|
| Render API | `https://YOUR-SERVICE.onrender.com` |
| Vercel frontend | Set `VITE_API_URL` → Render URL |
| Render CORS | Set `FRONTEND_ORIGIN` → Vercel URL |

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) and repo [`render.yaml`](../../render.yaml).
