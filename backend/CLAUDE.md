# CLAUDE.md — TurboAI Backend

## Commands

- `python manage.py runserver` — Start dev server (port 8000)
- `python manage.py migrate` — Apply migrations
- `python manage.py makemigrations` — Generate migrations
- `ruff check .` — Lint
- `ruff format .` — Format
- `pytest` — Run tests

## Stack

- **Python 3.12** + **Django 5.1** + **Django REST Framework**
- **SimpleJWT** — cookie-based JWT auth (access: 10min, refresh: 14d)
- **PostgreSQL 16** — primary DB with `psycopg[pool]` connection pooling
- **Redis 7** — caching via `django-redis` (user session cache, future rate limiting)
- **Pydantic v2** — request/response schemas via `drf-pydantic`
- **uv** — package manager (`uv.lock`)

## Project Structure

```
backend/
├── config/          # Settings, URLs, ASGI/WSGI
├── accounts/        # Auth: login, register, logout, refresh, /me
│   ├── authentication.py  # CookieJWTAuthentication
│   ├── cache.py           # Redis user cache (get/set/delete)
│   ├── models.py          # Custom User (AbstractUser, email unique)
│   ├── schemas.py         # Pydantic request/response models
│   ├── serializers.py     # DRF serializers (registration)
│   ├── tokens.py          # JWT helpers + cookie management
│   └── views.py           # Auth endpoints
├── core/            # Health check, hello world
└── pyproject.toml   # Dependencies + ruff + pytest config
```

## Code Style & Conventions

- **Formatter/linter**: Ruff (`line-length = 88`, target `py312`).
- **Lint rules**: `E, F, I, UP, B, SIM`. Migrations are excluded.
- **Import order** (enforced by ruff isort): stdlib → third-party → first-party (`config`, `core`, `accounts`).
- **Schemas**: Use `drf_pydantic.BaseModel` for request/response models in `schemas.py`. Use DRF serializers only when you need `create()`/`update()` logic.
- **Views**: Use function-based views with `@api_view` + `@permission_classes` decorators. No class-based views unless complexity demands it.
- **No `any` equivalent**: Use strict typing — `dict`, `list`, generics. Avoid `Any`.

## Auth Architecture

- JWT stored in HTTP-only cookies (not Authorization headers).
- `CookieJWTAuthentication` reads the access token from the `access_token` cookie.
- Refresh token is scoped to `/api/auth/` path only.
- Token rotation: on refresh, the old refresh token is blacklisted.
- `/me` responses are cached in Redis (key: `user:{id}:me`, TTL: 600s = access token lifetime).
- On logout, the Redis cache entry is deleted and cookies are cleared.

## Caching Pattern

Use `accounts/cache.py` helpers for user-related caching:

```python
from accounts.cache import get_cached_user, set_cached_user, delete_cached_user
```

- `set_cached_user(user)` — serialize + cache, returns the dict (use on login/register/refresh)
- `get_cached_user(user_id)` — returns cached dict or `None`
- `delete_cached_user(user_id)` — evict on logout or profile changes

Cache keys follow the pattern `{prefix}:{id}:{scope}`. TTL should match the relevant token lifetime.

## Do's and Don'ts

### Do

- Keep views thin — push logic to models, services, or utility modules.
- Use `django.conf.settings` for all config values (never hardcode secrets or URLs).
- Add new apps to `INSTALLED_APPS` and register URL patterns in `config/urls.py`.
- Run `ruff check . && ruff format .` before committing.
- Invalidate relevant cache entries when mutating user data.

### Don't

- Don't use `@csrf_exempt` — the cookie-based auth handles CSRF via SameSite.
- Don't return raw querysets — always serialize through Pydantic schemas or DRF serializers.
- Don't add `print()` statements — use `logging` if needed.
- Don't skip migrations — always generate and commit them.
- Don't install packages manually — use `uv add <package>`.
