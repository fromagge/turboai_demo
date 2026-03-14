from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler as drf_exception_handler


def api_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is None:
        if settings.DEBUG:
            raise exc
        return JsonResponse(
            {"message": "An unexpected error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if not settings.DEBUG:
        status_code = response.status_code

        if status_code == 404:
            response.data = {"message": "Not found."}
        elif status_code == 403:
            response.data = {"message": "Forbidden."}
        elif status_code == 401:
            response.data = {"message": "Authentication required."}
        elif status_code >= 500:
            response.data = {"message": "An unexpected error occurred."}
        elif isinstance(exc, APIException) and status_code not in (400, 409):
            response.data = {"message": "Request could not be processed."}

    return response


def handler404(request, exception=None):
    return JsonResponse({"message": "Not found."}, status=404)


def handler500(request):
    return JsonResponse({"message": "An unexpected error occurred."}, status=500)
