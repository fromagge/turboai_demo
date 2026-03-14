# Dev: hot-reload via mounted backend
# Usage: just setup, just up, just down, just deps

setup:
    #!/usr/bin/env bash
    set -e
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Created .env from .env.example"
    fi
    docker compose build
    docker compose run --rm web python manage.py migrate

up:
    docker compose up

down:
    docker compose down

# Postgres + Redis only (e.g. run backend locally with just deps)
deps:
    docker compose -f docker-compose.deps.yml up -d

deps-down:
    docker compose -f docker-compose.deps.yml down
