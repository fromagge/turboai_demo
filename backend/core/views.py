from django.core.cache import cache
from django.db import connection
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .schemas import HealthResponse, HelloResponse


@api_view(["GET"])
def health(request):
    db_ok = True
    cache_ok = True

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception:
        db_ok = False

    try:
        cache.set("health_check", "ok", timeout=10)
        if cache.get("health_check") != "ok":
            raise ValueError("cache read mismatch")
    except Exception:
        cache_ok = False

    data = {
        "status": "ok" if (db_ok and cache_ok) else "degraded",
        "database": "ok" if db_ok else "error",
        "cache": "ok" if cache_ok else "error",
    }
    serializer = HealthResponse.drf_serializer(data=data)
    serializer.is_valid()
    http_status = status.HTTP_200_OK if (db_ok and cache_ok) else status.HTTP_503_SERVICE_UNAVAILABLE
    return Response(serializer.data, status=http_status)


@api_view(["GET"])
def hello(request):
    data = {"message": "Hello, world!"}
    serializer = HelloResponse.drf_serializer(data=data)
    serializer.is_valid()
    return Response(serializer.data)
