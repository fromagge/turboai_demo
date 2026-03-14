import pytest

from notes.models import Category, Note

CATEGORIES_URL = "/api/notes/categories/"
CATEGORIES_CREATE_URL = "/api/notes/categories/create/"
NOTES_URL = "/api/notes/"
NOTES_CREATE_URL = "/api/notes/create/"


# --- Categories ---


class TestListCategories:
    def test_list_empty(self, auth_client):
        resp = auth_client.get(CATEGORIES_URL)
        assert resp.status_code == 200
        # Default categories created by signal
        assert isinstance(resp.data["categories"], list)

    def test_list_includes_note_count(self, auth_client, user, category):
        Note.objects.create(user=user, title="t", content="c", category=category)
        resp = auth_client.get(CATEGORIES_URL)
        cats = resp.data["categories"]
        target = next(c for c in cats if c["id"] == category.id)
        assert target["note_count"] == 1

    def test_list_unauthenticated(self, api_client, db):
        resp = api_client.get(CATEGORIES_URL)
        assert resp.status_code == 401


class TestCreateCategory:
    def test_create_success(self, auth_client):
        resp = auth_client.post(
            CATEGORIES_CREATE_URL,
            {"name": "New Cat", "color": "#ABCDEF"},
            format="json",
        )
        assert resp.status_code == 201
        assert resp.data["category"]["name"] == "New Cat"
        assert resp.data["category"]["color"] == "#ABCDEF"

    def test_create_invalid_color(self, auth_client):
        resp = auth_client.post(
            CATEGORIES_CREATE_URL,
            {"name": "Bad", "color": "not-hex"},
            format="json",
        )
        assert resp.status_code == 400

    def test_create_duplicate_name(self, auth_client, category):
        from django.db import IntegrityError

        with pytest.raises(IntegrityError):
            auth_client.post(
                CATEGORIES_CREATE_URL,
                {"name": category.name, "color": "#000000"},
                format="json",
            )


class TestUpdateCategory:
    def test_update_name(self, auth_client, category):
        url = f"/api/notes/categories/{category.id}/"
        resp = auth_client.patch(url, {"name": "Renamed"}, format="json")
        assert resp.status_code == 200
        assert resp.data["category"]["name"] == "Renamed"

    def test_update_color(self, auth_client, category):
        url = f"/api/notes/categories/{category.id}/"
        resp = auth_client.patch(url, {"color": "#00FF00"}, format="json")
        assert resp.status_code == 200
        assert resp.data["category"]["color"] == "#00FF00"

    def test_update_other_users_category(self, auth_client, other_category):
        url = f"/api/notes/categories/{other_category.id}/"
        resp = auth_client.patch(url, {"name": "Hack"}, format="json")
        assert resp.status_code == 404


class TestDeleteCategory:
    def test_delete_empty_category(self, auth_client, category):
        url = f"/api/notes/categories/{category.id}/delete/"
        resp = auth_client.delete(url)
        assert resp.status_code == 204
        assert not Category.objects.filter(id=category.id).exists()

    def test_delete_category_with_notes(self, auth_client, user, category):
        Note.objects.create(user=user, title="t", content="c", category=category)
        url = f"/api/notes/categories/{category.id}/delete/"
        resp = auth_client.delete(url)
        assert resp.status_code == 409

    def test_delete_other_users_category(self, auth_client, other_category):
        url = f"/api/notes/categories/{other_category.id}/delete/"
        resp = auth_client.delete(url)
        assert resp.status_code == 404


# --- Notes ---


@pytest.fixture()
def note(user, category):
    return Note.objects.create(
        user=user, title="Test Note", content="Test content", category=category
    )


@pytest.fixture()
def other_note(other_user, other_category):
    return Note.objects.create(
        user=other_user,
        title="Other Note",
        content="Other content",
        category=other_category,
    )


class TestListNotes:
    def test_list_notes(self, auth_client, note):
        resp = auth_client.get(NOTES_URL)
        assert resp.status_code == 200
        assert isinstance(resp.data["notes"], list)
        ids = [n["id"] for n in resp.data["notes"]]
        assert note.id in ids

    def test_list_excludes_other_users_notes(self, auth_client, note, other_note):
        resp = auth_client.get(NOTES_URL)
        ids = [n["id"] for n in resp.data["notes"]]
        assert other_note.id not in ids


class TestCreateNote:
    def test_create_success(self, auth_client, category):
        resp = auth_client.post(
            NOTES_CREATE_URL,
            {"title": "New", "content": "Body", "category_id": category.id},
            format="json",
        )
        assert resp.status_code == 201
        assert resp.data["note"]["title"] == "New"

    def test_create_sanitizes_html(self, auth_client, category):
        resp = auth_client.post(
            NOTES_CREATE_URL,
            {
                "title": "XSS",
                "content": '<script>alert("xss")</script>Hello',
                "category_id": category.id,
            },
            format="json",
        )
        assert resp.status_code == 201
        assert "<script>" not in resp.data["note"]["content"]
        assert "Hello" in resp.data["note"]["content"]

    def test_create_other_users_category(self, auth_client, other_category):
        resp = auth_client.post(
            NOTES_CREATE_URL,
            {"title": "Hack", "content": "x", "category_id": other_category.id},
            format="json",
        )
        assert resp.status_code == 400


class TestGetNote:
    def test_get_success(self, auth_client, note):
        resp = auth_client.get(f"/api/notes/{note.id}/")
        assert resp.status_code == 200
        assert resp.data["note"]["id"] == note.id

    def test_get_other_users_note(self, auth_client, other_note):
        resp = auth_client.get(f"/api/notes/{other_note.id}/")
        assert resp.status_code == 404

    def test_get_nonexistent(self, auth_client):
        resp = auth_client.get("/api/notes/99999/")
        assert resp.status_code == 404


class TestUpdateNote:
    def test_update_title(self, auth_client, note):
        resp = auth_client.patch(
            f"/api/notes/{note.id}/update/",
            {"title": "Updated Title"},
            format="json",
        )
        assert resp.status_code == 200
        assert resp.data["note"]["title"] == "Updated Title"

    def test_update_other_users_note(self, auth_client, other_note):
        resp = auth_client.patch(
            f"/api/notes/{other_note.id}/update/",
            {"title": "Hack"},
            format="json",
        )
        assert resp.status_code == 404


class TestDeleteNote:
    def test_delete_success(self, auth_client, note):
        resp = auth_client.delete(f"/api/notes/{note.id}/delete/")
        assert resp.status_code == 204
        assert not Note.objects.filter(id=note.id).exists()

    def test_delete_other_users_note(self, auth_client, other_note):
        resp = auth_client.delete(f"/api/notes/{other_note.id}/delete/")
        assert resp.status_code == 404


# --- Default Notes Signal ---


class TestDefaultNotes:
    def test_new_user_gets_default_notes(self, db):
        from django.contrib.auth import get_user_model

        User = get_user_model()
        user = User.objects.create_user(
            username="fresh", email="fresh@example.com", password="StrongPass123!"
        )
        assert Category.objects.filter(user=user).count() == 3
        assert Note.objects.filter(user=user).count() == 3
