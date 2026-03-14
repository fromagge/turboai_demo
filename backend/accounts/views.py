import contextlib

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.cache import delete_cached_user, get_cached_user, set_cached_user
from accounts.serializers import RegisterSerializer
from accounts.tokens import clear_auth_cookies, get_tokens_for_user, set_auth_cookies

User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email", "")
    password = request.data.get("password", "")
    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    user = authenticate(request, username=user_obj.username, password=password)
    if user is None:
        return Response(
            {"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )
    tokens = get_tokens_for_user(user)
    user_data = set_cached_user(user)
    response = Response({"user": user_data})
    set_auth_cookies(response, tokens)
    return response


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    tokens = get_tokens_for_user(user)
    user_data = set_cached_user(user)
    response = Response({"user": user_data}, status=status.HTTP_201_CREATED)
    set_auth_cookies(response, tokens)
    return response


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_view(request):
    raw_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
    if not raw_token:
        return Response(
            {"message": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED
        )
    try:
        old_refresh = RefreshToken(raw_token)
        old_refresh.blacklist()
        user = User.objects.get(id=old_refresh["user_id"])
        tokens = get_tokens_for_user(user)
        user_data = set_cached_user(user)
        response = Response({"user": user_data})
        set_auth_cookies(response, tokens)
        return response
    except (TokenError, User.DoesNotExist):
        response = Response(
            {"message": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED
        )
        clear_auth_cookies(response)
        return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    raw_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
    if raw_token:
        with contextlib.suppress(TokenError):
            RefreshToken(raw_token).blacklist()
    delete_cached_user(request.user.id)
    response = Response({"message": "Logged out"})
    clear_auth_cookies(response)
    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    user_data = get_cached_user(request.user.id)
    if user_data is None:
        user_data = set_cached_user(request.user)
    return Response({"user": user_data})
