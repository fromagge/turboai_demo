from django.contrib import admin
from django.urls import include, path

handler404 = "core.exception_handler.handler404"
handler500 = "core.exception_handler.handler500"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/notes/", include("notes.urls")),
    path("", include("core.urls")),
]
