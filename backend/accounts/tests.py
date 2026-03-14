from django.contrib.auth import get_user_model

from accounts.cache import delete_cached_user, get_cached_user, set_cached_user
from accounts.tokens import get_tokens_for_user

User = get_user_model()

LOGIN_URL = "/api/auth/login/"
REGISTER_URL = "/api/auth/register/"
REFRESH_URL = "/api/auth/refresh/"
LOGOUT_URL = "/api/auth/logout/"
ME_URL = "/api/auth/me/"


# --- Registration ---


class TestRegister:
    def test_register_success(self, api_client, db):
        resp = api_client.post(
            REGISTER_URL,
            {"email": "new@example.com", "password": "StrongPass123!"},
            format="json",
        )
        assert resp.status_code == 201
        assert resp.data["user"]["email"] == "new@example.com"
        assert "access_token" in resp.cookies
        assert "refresh_token" in resp.cookies

    def test_register_auto_username(self, api_client, db):
        resp = api_client.post(
            REGISTER_URL,
            {"email": "auto@example.com", "password": "StrongPass123!"},
            format="json",
        )
        assert resp.status_code == 201
        assert resp.data["user"]["username"] == "auto@example.com"

    def test_register_with_username(self, api_client, db):
        resp = api_client.post(
            REGISTER_URL,
            {
                "email": "named@example.com",
                "password": "StrongPass123!",
                "username": "myname",
            },
            format="json",
        )
        assert resp.status_code == 201
        assert resp.data["user"]["username"] == "myname"

    def test_register_duplicate_email(self, api_client, user):
        resp = api_client.post(
            REGISTER_URL,
            {"email": user.email, "password": "StrongPass123!"},
            format="json",
        )
        assert resp.status_code == 400

    def test_register_weak_password(self, api_client, db):
        resp = api_client.post(
            REGISTER_URL,
            {"email": "weak@example.com", "password": "123"},
            format="json",
        )
        assert resp.status_code == 400

    def test_register_missing_fields(self, api_client, db):
        resp = api_client.post(REGISTER_URL, {}, format="json")
        assert resp.status_code == 400


# --- Login ---


class TestLogin:
    def test_login_success(self, api_client, user):
        resp = api_client.post(
            LOGIN_URL,
            {"email": user.email, "password": "TestPass123!"},
            format="json",
        )
        assert resp.status_code == 200
        assert resp.data["user"]["email"] == user.email
        assert "access_token" in resp.cookies

    def test_login_wrong_password(self, api_client, user):
        resp = api_client.post(
            LOGIN_URL,
            {"email": user.email, "password": "wrong"},
            format="json",
        )
        assert resp.status_code == 401
        assert resp.data["message"] == "Invalid credentials"

    def test_login_nonexistent_email(self, api_client, db):
        resp = api_client.post(
            LOGIN_URL,
            {"email": "nobody@example.com", "password": "whatever"},
            format="json",
        )
        assert resp.status_code == 401


# --- Me ---


class TestMe:
    def test_me_authenticated(self, auth_client, user):
        resp = auth_client.get(ME_URL)
        assert resp.status_code == 200
        assert resp.data["user"]["id"] == user.id
        assert resp.data["user"]["email"] == user.email

    def test_me_unauthenticated(self, api_client, db):
        resp = api_client.get(ME_URL)
        assert resp.status_code == 401

    def test_me_uses_cache(self, auth_client, user):
        set_cached_user(user)
        resp = auth_client.get(ME_URL)
        assert resp.status_code == 200
        assert resp.data["user"]["email"] == user.email


# --- Refresh ---


class TestRefresh:
    def test_refresh_success(self, auth_client, user):
        resp = auth_client.post(REFRESH_URL)
        assert resp.status_code == 200
        assert "access_token" in resp.cookies

    def test_refresh_no_cookie(self, api_client, db):
        resp = api_client.post(REFRESH_URL)
        assert resp.status_code == 401
        assert resp.data["message"] == "No refresh token"

    def test_refresh_invalid_token(self, api_client, db):
        api_client.cookies["refresh_token"] = "invalid-token"
        resp = api_client.post(REFRESH_URL)
        assert resp.status_code == 401

    def test_refresh_blacklists_old_token(self, auth_client, user):
        old_refresh = auth_client.cookies["refresh_token"].value
        auth_client.post(REFRESH_URL)
        # Using the old token again should fail
        auth_client.cookies["refresh_token"] = old_refresh
        resp = auth_client.post(REFRESH_URL)
        assert resp.status_code == 401


# --- Logout ---


class TestLogout:
    def test_logout_success(self, auth_client, user):
        resp = auth_client.post(LOGOUT_URL)
        assert resp.status_code == 200
        assert resp.data["message"] == "Logged out"

    def test_logout_clears_cache(self, auth_client, user):
        set_cached_user(user)
        auth_client.post(LOGOUT_URL)
        assert get_cached_user(user.id) is None

    def test_logout_unauthenticated(self, api_client, db):
        resp = api_client.post(LOGOUT_URL)
        assert resp.status_code == 401


# --- Tokens ---


class TestTokens:
    def test_get_tokens_for_user(self, user):
        tokens = get_tokens_for_user(user)
        assert "access" in tokens
        assert "refresh" in tokens


# --- User Cache ---


class TestUserCache:
    def test_set_and_get_cached_user(self, user):
        data = set_cached_user(user)
        assert data["id"] == user.id
        cached = get_cached_user(user.id)
        assert cached == data

    def test_delete_cached_user(self, user):
        set_cached_user(user)
        delete_cached_user(user.id)
        assert get_cached_user(user.id) is None

    def test_get_cached_user_miss(self, user):
        assert get_cached_user(user.id) is None
