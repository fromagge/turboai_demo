from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.schemas import HealthResponse, HelloResponse
from core.utils import check_cache, check_database


@api_view(["GET"])
def health(request):
    db_ok = check_database()
    cache_ok = check_cache()

    db_status = "ok" if db_ok else "error"
    cache_status = "ok" if cache_ok else "error"
    overall_status = "ok" if (db_ok and cache_ok) else "degraded"

    data = {
        "status": overall_status,
        "database": db_status,
        "cache": cache_status,
    }
    serializer = HealthResponse.drf_serializer(data=data)
    serializer.is_valid(raise_exception=True)

    http_status = (
        status.HTTP_503_SERVICE_UNAVAILABLE
        if not (db_ok and cache_ok)
        else status.HTTP_200_OK
    )
    return Response(serializer.data, status=http_status)


@api_view(["GET"])
def hello(request):
    data = {"message": "Hello, world!"}
    serializer = HelloResponse.drf_serializer(data=data)
    serializer.is_valid()
    return Response(serializer.data)
