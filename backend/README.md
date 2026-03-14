# TurboAI Backend

Django backend. You can run it on its own (no Docker) for local development.

## Prerequisites

- **Python 3.12+**
- **PostgreSQL** running locally (default: `localhost:5432`)
- **Redis** running locally (default: `localhost:6379`)

## Setup

1. **Install dependencies** (from the `backend/` directory):

   ```bash
   uv sync
   ```

2. **Environment**

   Copy the example env and adjust if needed:

   ```bash
   cp .env.example .env
   ```

   Ensure Postgres and Redis connection details in `.env` match your local setup.

3. **Database**

   Create the Postgres database if needed (e.g. `createdb turboai`), then run migrations:

   ```bash
   uv run python manage.py migrate
   ```

## Run

Start the dev server:

```bash
uv run python manage.py runserver
```

The API will be at **http://127.0.0.1:8000/**.

For an ASGI server (e.g. WebSockets):

```bash
uv run uvicorn config.asgi:application --reload --host 127.0.0.1 --port 8000
```
