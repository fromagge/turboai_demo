from django.conf import settings
from django.db import models


class Category(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
    )
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)  # hex color e.g. #78ABA8

    class Meta:
        db_table = "notes_category"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_category_per_user",
            ),
        ]

    def __str__(self) -> str:
        return self.name


class Note(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="notes",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notes_note"
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return self.title


class TranscriptionUsage(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transcription_usages",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    estimated_cost = models.DecimalField(
        max_digits=10,
        decimal_places=6,
        default=0,
        help_text="Estimated cost in USD for this transcription session",
    )

    class Meta:
        db_table = "notes_transcription_usage"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user} – ${self.estimated_cost} @ {self.created_at}"
