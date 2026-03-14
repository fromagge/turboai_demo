from django.conf import settings
from django.core.cache import cache

from accounts.schemas import UserResponse

CACHE_KEY_PREFIX = "user"
CACHE_TTL = settings.AUTH_COOKIE_ACCESS_MAX_AGE  # matches access token lifetime


def _cache_key(user_id: int) -> str:
    return f"{CACHE_KEY_PREFIX}:{user_id}:me"


def get_cached_user(user_id: int) -> dict | None:
    return cache.get(_cache_key(user_id))


def set_cached_user(user) -> dict:
    data = UserResponse.from_user(user)
    cache.set(_cache_key(user.id), data, CACHE_TTL)
    return data


def delete_cached_user(user_id: int) -> None:
    cache.delete(_cache_key(user_id))
