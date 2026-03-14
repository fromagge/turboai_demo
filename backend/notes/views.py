import logging
from decimal import Decimal

import httpx
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notes.managers import CategoryHasNotesError, CategoryManager, NoteManager
from notes.models import TranscriptionUsage
from notes.serializers import CategorySerializer, NoteSerializer

logger = logging.getLogger(__name__)

OPENAI_REALTIME_SESSIONS_URL = "https://api.openai.com/v1/realtime/sessions"
SESSION_ESTIMATED_COST = Decimal("0.003")

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


# --- Transcription ---


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_transcription_token(request):
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        return Response(
            {"message": "Transcription service is not configured."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    try:
        response = httpx.post(
            OPENAI_REALTIME_SESSIONS_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o-mini-transcribe",
                "voice": "alloy",
            },
            timeout=10,
        )
        response.raise_for_status()
    except httpx.HTTPStatusError:
        logger.exception("OpenAI realtime session request failed")
        return Response(
            {"message": "Failed to create transcription session."},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except httpx.RequestError:
        logger.exception("OpenAI realtime session request error")
        return Response(
            {"message": "Failed to reach transcription service."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    data = response.json()
    client_secret = data.get("client_secret", {}).get("value", "")
    if not client_secret:
        return Response(
            {"message": "Invalid response from transcription service."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    TranscriptionUsage.objects.create(
        user=request.user,
        estimated_cost=SESSION_ESTIMATED_COST,
    )

    return Response({"client_secret": client_secret})
