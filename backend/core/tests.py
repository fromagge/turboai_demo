from unittest.mock import patch


class TestHealth:
    def test_health_ok(self, api_client, db):
        resp = api_client.get("/health/")
        assert resp.status_code == 200
        assert resp.data["status"] == "ok"
        assert resp.data["database"] == "ok"
        assert resp.data["cache"] == "ok"

    @patch("core.views.check_database", return_value=False)
    def test_health_db_down(self, mock_db, api_client, db):
        resp = api_client.get("/health/")
        assert resp.status_code == 503
        assert resp.data["status"] == "degraded"
        assert resp.data["database"] == "error"

    @patch("core.views.check_cache", return_value=False)
    def test_health_cache_down(self, mock_cache, api_client, db):
        resp = api_client.get("/health/")
        assert resp.status_code == 503
        assert resp.data["status"] == "degraded"
        assert resp.data["cache"] == "error"


class TestHello:
    def test_hello(self, api_client, db):
        resp = api_client.get("/")
        assert resp.status_code == 200
        assert resp.data["message"] == "Hello, world!"
