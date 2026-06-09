# Security posture (honest assessment)

## Smart contract

- Employer-only mutations via `assert(Txn.sender === this.employer.value)`.
- MBR payments must target the application address.
- CI runs `audit-teal` on compiled TEAL.
- **Not** formally audited for mainnet production.

## API authentication

- Wallet proof-of-possession: signed Algorand transaction + `bytesToSign()` verification (tweetnacl).
- JWT with role claims; company admin routes check `adminAddress` in DB.
- Challenges are **in-memory** (single-instance dev); use Redis with TTL for multi-instance production.

## Known gaps / mitigations

| Issue | Risk | Mitigation |
|-------|------|------------|
| Default `JWT_SECRET` in dev | Forged tokens | Strong secret in production |
| SQLite in dev | Not for multi-instance | PostgreSQL in production |
| CORS localhost + `FRONTEND_ORIGIN` | Misconfiguration in prod | Set explicit origins only |
| Illustrative tax engine | Wrong withholding if treated as legal | Partner payroll / EOR for filings |
| Simulated off-ramp | No real fiat movement | Licensed Saber/Wormhole integration |
| x402 demo | Payment proof not fully validated on-chain | Production would verify settlement before serving resource |
| KYC uploads | PII in IPFS | Private Pinata groups, retention policy |

## Reporting

If you discover a vulnerability during judging, we document it and prioritize: auth bypass > unauthorized pay > data leak.
