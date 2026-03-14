from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from notes.managers import CategoryHasNotesError, CategoryManager, NoteManager
from notes.serializers import CategorySerializer, NoteSerializer

# --- Categories ---


@api_view(["GET"])
def list_categories(request):
    data = CategoryManager.list_categories(request.user)
    return Response({"categories": data})


@api_view(["POST"])
def create_category(request):
    serializer = CategorySerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    data = CategoryManager.create_category(request.user, serializer.validated_data)
    return Response({"category": data}, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
def update_category(request, id):
    category = CategoryManager.get_category(request.user, id)
    serializer = CategorySerializer(
        category, data=request.data, partial=True, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    data = CategoryManager.update_category(category, serializer.validated_data)
    return Response({"category": data})


@api_view(["DELETE"])
def delete_category(request, id):
    try:
        CategoryManager.delete_category(request.user, id)
    except CategoryHasNotesError:
        return Response(
            {"message": "Cannot delete a category that has notes."},
            status=status.HTTP_409_CONFLICT,
        )
    return Response(status=status.HTTP_204_NO_CONTENT)


# --- Notes ---


@api_view(["GET"])
def list_notes(request):
    data = NoteManager.list_notes(request.user)
    return Response({"notes": data})


@api_view(["POST"])
def create_note(request):
    serializer = NoteSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    data = NoteManager.create_note(request.user, serializer.validated_data)
    return Response({"note": data}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def get_note(request, id):
    data = NoteManager.get_note(request.user, id)
    return Response({"note": data})


@api_view(["PATCH"])
def update_note(request, id):
    note = NoteManager.get_note_instance(request.user, id)
    serializer = NoteSerializer(
        note, data=request.data, partial=True, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    data = NoteManager.update_note(note, serializer.validated_data)
    return Response({"note": data})


@api_view(["DELETE"])
def delete_note(request, id):
    NoteManager.delete_note(request.user, id)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def get_note_history(request, id):
    data = NoteManager.get_note_history(request.user, id)
    return Response({"history": data})
