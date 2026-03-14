# CLAUDE.md — TurboAI (Monorepo Root)

## Repository Layout

```
turboai/
├── backend/    # Django REST API (Python 3.12)
├── frontend/   # Next.js App Router (TypeScript)
└── docker-compose.yml
```

## Quick Start

```bash
docker compose up            # Starts postgres, redis, backend, frontend
```

## Infrastructure

- **PostgreSQL 16** — primary database (connection pooling via psycopg)
- **Redis 7** — caching layer (`django-redis`), used for session/user caching

## Cross-Cutting Rules

- Never commit `.env` files. Use environment variables or `.env.example` as reference.
- Backend and frontend are deployed independently — do not introduce cross-directory import dependencies.
- All API endpoints are prefixed with `/api/`.
- Auth uses HTTP-only cookie-based JWT (access + refresh tokens). The frontend proxies API calls through Next.js.

## Commands (from repo root)

- `docker compose up` — full stack dev
- `docker compose up postgres redis` — deps only (for running backend/frontend locally)

## See Also

- `backend/CLAUDE.md` — backend-specific rules
- `frontend/CLAUDE.md` — frontend-specific rules
