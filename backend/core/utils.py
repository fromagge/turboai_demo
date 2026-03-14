from django.core.cache import cache
from django.db import connection

HEALTH_CHECK_CACHE_KEY = "core:health_check"
HEALTH_CHECK_CACHE_TIMEOUT = 10


def check_database() -> bool:
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return True
    except Exception:
        return False


def check_cache() -> bool:
    try:
        cache.set(HEALTH_CHECK_CACHE_KEY, "ok", timeout=HEALTH_CHECK_CACHE_TIMEOUT)
        if cache.get(HEALTH_CHECK_CACHE_KEY) != "ok":
            raise ValueError("cache read mismatch")
        return True
    except Exception:
        return False
