# AGENTS.md — TurboAI Backend

## Stack

- **Python 3.12** + **Django 5.1** + **Django REST Framework 3.15**
- **SimpleJWT** — HTTP-only cookie-based JWT authentication
- **PostgreSQL 16** — primary database (psycopg with connection pooling)
- **Redis 7** — caching layer via `django-redis`
- **Pydantic v2** — schemas via `drf-pydantic`
- **Ruff** — linter and formatter

## Project Structure

```
backend/
├── config/
│   ├── settings.py      # All Django settings (DB, Redis, JWT, CORS, CSRF)
│   ├── urls.py          # Root URL router
│   ├── asgi.py / wsgi.py
│   └── __init__.py
├── accounts/
│   ├── authentication.py  # CookieJWTAuthentication (reads JWT from cookies)
│   ├── cache.py           # Redis cache helpers (get/set/delete user)
│   ├── models.py          # Custom User model (AbstractUser, unique email)
│   ├── schemas.py         # Pydantic models: UserResponse
│   ├── serializers.py     # DRF RegisterSerializer
│   ├── tokens.py          # get_tokens_for_user, set/clear_auth_cookies
│   ├── views.py           # login, register, refresh, logout, me
│   └── urls.py            # /api/auth/* routes
├── core/
│   ├── views.py           # health_check, hello
│   ├── schemas.py         # HealthResponse, HelloResponse
│   └── urls.py            # / routes
└── pyproject.toml         # Dependencies, ruff config, pytest config
```

## Naming Conventions

| Thing          | Convention  | Example                          |
| -------------- | ----------- | -------------------------------- |
| Files          | snake_case  | `cookie_auth.py`                 |
| Models         | PascalCase  | `class User(AbstractUser)`       |
| Views          | snake_case  | `def login_view(request)`        |
| URLs           | kebab-case  | `/api/auth/me/`                  |
| Schemas        | PascalCase  | `class UserResponse(BaseModel)`  |
| Cache keys     | colon-sep   | `user:{id}:me`                   |

## API Patterns

### Views

Use function-based views with decorators:

```python
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_view(request):
    return Response({"data": ...})
```

### Schemas (Request/Response)

Use `drf_pydantic.BaseModel` in `schemas.py`:

```python
from drf_pydantic import BaseModel

class ItemResponse(BaseModel):
    id: int
    name: str

    @classmethod
    def from_instance(cls, obj) -> dict:
        return cls(id=obj.id, name=obj.name).model_dump()
```

### Caching

Use the helpers in `accounts/cache.py` as a pattern. For new domains, create a similar `cache.py`:

```python
from django.core.cache import cache

def get_cached_thing(thing_id: int) -> dict | None:
    return cache.get(f"thing:{thing_id}:detail")

def set_cached_thing(thing) -> dict:
    data = ThingResponse.from_instance(thing)
    cache.set(f"thing:{thing_id}:detail", data, TTL)
    return data

def delete_cached_thing(thing_id: int) -> None:
    cache.delete(f"thing:{thing_id}:detail")
```

### Authentication

All endpoints require auth by default (`DEFAULT_PERMISSION_CLASSES = [IsAuthenticated]`).
Use `@permission_classes([AllowAny])` to opt out for public endpoints.

JWT is read from cookies by `CookieJWTAuthentication`, not from `Authorization` headers.

## Formatting & Linting

- Ruff with `line-length = 88`, `target-version = "py312"`
- Rules: `E, F, I, UP, B, SIM`
- Import order: stdlib > third-party > first-party (`config`, `core`, `accounts`)
- Migrations are excluded from linting

## Do's and Don'ts

### Do

- Use Pydantic schemas for API input/output validation
- Use `django.conf.settings` for configuration access
- Cache expensive or frequent reads in Redis with appropriate TTL
- Blacklist refresh tokens on rotation and logout
- Run `ruff check . && ruff format .` before committing

### Don't

- Don't use class-based views unless complexity requires it
- Don't return raw querysets or model instances in responses
- Don't hardcode secrets, URLs, or environment-specific values
- Don't use `print()` — use `logging` module
- Don't skip generating migrations for model changes
- Don't use `@csrf_exempt`
- Don't use `Any` type — use specific types
