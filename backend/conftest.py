import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from accounts.tokens import get_tokens_for_user
from notes.models import Category

User = get_user_model()


@pytest.fixture()
def user(db):
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="TestPass123!",
    )


@pytest.fixture()
def other_user(db):
    return User.objects.create_user(
        username="otheruser",
        email="other@example.com",
        password="TestPass123!",
    )


@pytest.fixture()
def api_client():
    return APIClient()


@pytest.fixture()
def auth_client(api_client, user):
    tokens = get_tokens_for_user(user)
    api_client.cookies["access_token"] = tokens["access"]
    api_client.cookies["refresh_token"] = tokens["refresh"]
    return api_client


@pytest.fixture()
def category(user):
    return Category.objects.create(user=user, name="Test Category", color="#FF0000")


@pytest.fixture()
def other_category(other_user):
    return Category.objects.create(
        user=other_user, name="Other Category", color="#00FF00"
    )
