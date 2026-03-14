from django.contrib import admin

from notes.models import Category, Note


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "color")
    list_filter = ("user",)
    search_fields = ("name",)


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "category", "created_at", "updated_at")
    list_filter = ("user", "category", "created_at")
    search_fields = ("title", "content")
