from django.conf import settings
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User

TokenDict = dict[str, str]


def get_tokens_for_user(user: User) -> TokenDict:
    refresh = RefreshToken.for_user(user)
    refresh["username"] = user.username
    refresh["email"] = user.email
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def set_auth_cookies(response: Response, tokens: TokenDict) -> None:
    response.set_cookie(
        key=settings.AUTH_COOKIE_ACCESS,
        value=tokens["access"],
        max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        key=settings.AUTH_COOKIE_REFRESH,
        value=tokens["refresh"],
        max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path=settings.AUTH_COOKIE_REFRESH_PATH,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(
        key=settings.AUTH_COOKIE_ACCESS,
        path="/",
    )
    response.delete_cookie(
        key=settings.AUTH_COOKIE_REFRESH,
        path=settings.AUTH_COOKIE_REFRESH_PATH,
    )
