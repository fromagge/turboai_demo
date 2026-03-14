from django.urls import path

from notes import views

urlpatterns = [
    path(
        "transcription/token/",
        views.create_transcription_token,
        name="transcription-token",
    ),
    path("categories/", views.list_categories, name="categories-list"),
    path("categories/<int:id>/", views.update_category, name="categories-update"),
    path(
        "categories/<int:id>/delete/", views.delete_category, name="categories-delete"
    ),
    path("", views.list_notes, name="notes-list"),
    path("create/", views.create_note, name="notes-create"),
    path("<int:id>/", views.get_note, name="notes-detail"),
    path("<int:id>/update/", views.update_note, name="notes-update"),
    path("<int:id>/delete/", views.delete_note, name="notes-delete"),
    path("categories/create/", views.create_category, name="categories-create"),
]
