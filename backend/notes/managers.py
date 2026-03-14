from django.db import transaction
from django.db.models import Count
from django.shortcuts import get_object_or_404

from notes.cache import (
    get_cached_categories,
    get_cached_note,
    get_cached_notes_list,
    invalidate_category_caches,
    invalidate_note_caches,
    set_cached_categories,
    set_cached_note,
    set_cached_notes_list,
)
from notes.models import Category, Note
from notes.schemas import CategoryResponse, NoteResponse


class CategoryHasNotesError(Exception):
    pass


class CategoryManager:
    @staticmethod
    def list_categories(user) -> list[dict]:
        cached = get_cached_categories(user.id)
        if cached is not None:
            return cached
        categories = Category.objects.filter(user=user).annotate(
            note_count=Count("notes")
        )
        data = [CategoryResponse.from_model(c) for c in categories]
        set_cached_categories(user.id, data)
        return data

    @staticmethod
    def get_category(user, category_id: int) -> Category:
        return get_object_or_404(Category, id=category_id, user=user)

    @staticmethod
    def create_category(user, validated_data: dict) -> dict:
        validated_data["user"] = user
        with transaction.atomic():
            category = Category.objects.create(**validated_data)
        transaction.on_commit(lambda: invalidate_category_caches(user.id))
        return CategoryResponse.from_model(category)

    @staticmethod
    def update_category(category: Category, validated_data: dict) -> dict:
        user_id = category.user_id
        with transaction.atomic():
            for field, value in validated_data.items():
                setattr(category, field, value)
            category.save()
        transaction.on_commit(lambda: invalidate_category_caches(user_id))
        return CategoryResponse.from_model(category)

    @staticmethod
    def delete_category(user, category_id: int) -> None:
        category = get_object_or_404(Category, id=category_id, user=user)
        if category.notes.exists():
            raise CategoryHasNotesError("Cannot delete a category that has notes.")
        with transaction.atomic():
            category.delete()
        transaction.on_commit(lambda: invalidate_category_caches(user.id))


class NoteManager:
    @staticmethod
    def list_notes(user) -> list[dict]:
        cached = get_cached_notes_list(user.id)
        if cached is not None:
            return cached
        notes = Note.objects.filter(user=user).select_related("category")
        data = [NoteResponse.from_model(n) for n in notes]
        set_cached_notes_list(user.id, data)
        return data

    @staticmethod
    def get_note(user, note_id: int) -> dict:
        cached = get_cached_note(user.id, note_id)
        if cached is not None:
            return cached
        note = get_object_or_404(
            Note.objects.select_related("category"), id=note_id, user=user
        )
        data = NoteResponse.from_model(note)
        set_cached_note(user.id, note_id, data)
        return data

    @staticmethod
    def get_note_instance(user, note_id: int) -> Note:
        return get_object_or_404(
            Note.objects.select_related("category"), id=note_id, user=user
        )

    @staticmethod
    def create_note(user, validated_data: dict) -> dict:
        validated_data["user"] = user
        with transaction.atomic():
            note = Note.objects.create(**validated_data)
            note.refresh_from_db()
        transaction.on_commit(
            lambda: (
                invalidate_note_caches(user.id),
                invalidate_category_caches(user.id),
            )
        )
        return NoteResponse.from_model(note)

    @staticmethod
    def update_note(note: Note, validated_data: dict) -> dict:
        user_id = note.user_id
        note_id = note.id
        category_changed = "category" in validated_data
        with transaction.atomic():
            for field, value in validated_data.items():
                setattr(note, field, value)
            note.save()
            note.refresh_from_db()
        transaction.on_commit(lambda: invalidate_note_caches(user_id, note_id))
        if category_changed:
            transaction.on_commit(lambda: invalidate_category_caches(user_id))
        return NoteResponse.from_model(note)

    @staticmethod
    def delete_note(user, note_id: int) -> None:
        note = get_object_or_404(Note, id=note_id, user=user)
        with transaction.atomic():
            note.delete()
        transaction.on_commit(
            lambda: (
                invalidate_note_caches(user.id, note_id),
                invalidate_category_caches(user.id),
            )
        )
