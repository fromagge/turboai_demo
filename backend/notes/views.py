from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
from notes.schemas import CategoryResponse, NoteHistoryResponse, NoteResponse
from notes.serializers import CategorySerializer, NoteSerializer

# --- Categories ---


@api_view(["GET"])
def list_categories(request):
    cached = get_cached_categories(request.user.id)
    if cached is not None:
        return Response({"categories": cached})
    categories = Category.objects.filter(user=request.user).annotate(
        note_count=Count("notes")
    )
    data = [CategoryResponse.from_model(c) for c in categories]
    set_cached_categories(request.user.id, data)
    return Response({"categories": data})


@api_view(["POST"])
def create_category(request):
    serializer = CategorySerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    category = serializer.save()
    invalidate_category_caches(request.user.id)
    return Response(
        {"category": CategoryResponse.from_model(category)},
        status=status.HTTP_201_CREATED,
    )


@api_view(["PATCH"])
def update_category(request, id):
    category = get_object_or_404(Category, id=id, user=request.user)
    serializer = CategorySerializer(
        category, data=request.data, partial=True, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    category = serializer.save()
    invalidate_category_caches(request.user.id)
    return Response({"category": CategoryResponse.from_model(category)})


@api_view(["DELETE"])
def delete_category(request, id):
    category = get_object_or_404(Category, id=id, user=request.user)
    if category.notes.exists():
        return Response(
            {"message": "Cannot delete a category that has notes."},
            status=status.HTTP_409_CONFLICT,
        )
    category.delete()
    invalidate_category_caches(request.user.id)
    return Response(status=status.HTTP_204_NO_CONTENT)


# --- Notes ---


@api_view(["GET"])
def list_notes(request):
    cached = get_cached_notes_list(request.user.id)
    if cached is not None:
        return Response({"notes": cached})
    notes = Note.objects.filter(user=request.user).select_related("category")
    data = [NoteResponse.from_model(n) for n in notes]
    set_cached_notes_list(request.user.id, data)
    return Response({"notes": data})


@api_view(["POST"])
def create_note(request):
    serializer = NoteSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    note = serializer.save()
    note.refresh_from_db()
    invalidate_note_caches(request.user.id)
    invalidate_category_caches(request.user.id)
    return Response(
        {"note": NoteResponse.from_model(note)},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def get_note(request, id):
    cached = get_cached_note(request.user.id, id)
    if cached is not None:
        return Response({"note": cached})
    note = get_object_or_404(
        Note.objects.select_related("category"), id=id, user=request.user
    )
    data = NoteResponse.from_model(note)
    set_cached_note(request.user.id, id, data)
    return Response({"note": data})


@api_view(["PATCH"])
def update_note(request, id):
    note = get_object_or_404(
        Note.objects.select_related("category"), id=id, user=request.user
    )
    serializer = NoteSerializer(
        note, data=request.data, partial=True, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    note = serializer.save()
    note.refresh_from_db()
    invalidate_note_caches(request.user.id, id)
    if "category" in serializer.validated_data:
        invalidate_category_caches(request.user.id)
    return Response({"note": NoteResponse.from_model(note)})


@api_view(["DELETE"])
def delete_note(request, id):
    note = get_object_or_404(Note, id=id, user=request.user)
    note.delete()
    invalidate_note_caches(request.user.id, id)
    invalidate_category_caches(request.user.id)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def get_note_history(request, id):
    note = get_object_or_404(Note, id=id, user=request.user)
    history = note.history.select_related("changed_by").all()
    data = [NoteHistoryResponse.from_model(h) for h in history]
    return Response({"history": data})
