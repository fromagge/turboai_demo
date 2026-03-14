from django.contrib import admin
from django.db.models import Count, Sum

from notes.models import Category, Note, TranscriptionUsage


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


@admin.register(TranscriptionUsage)
class TranscriptionUsageAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "estimated_cost_display", "created_at")
    list_filter = ("user", "created_at")
    date_hierarchy = "created_at"
    readonly_fields = ("user", "estimated_cost", "created_at")

    change_list_template = "admin/transcription_usage_changelist.html"

    def estimated_cost_display(self, obj):
        return f"${obj.estimated_cost:.4f}"

    estimated_cost_display.short_description = "Estimated Cost"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}

        summary = (
            TranscriptionUsage.objects.values("user__id", "user__username")
            .annotate(
                total_sessions=Count("id"),
                total_cost=Sum("estimated_cost"),
            )
            .order_by("-total_cost")
        )

        user_summaries = []
        grand_total = 0
        for row in summary:
            cost = row["total_cost"] or 0
            grand_total += cost
            user_summaries.append(
                {
                    "username": row["user__username"],
                    "total_sessions": row["total_sessions"],
                    "total_cost": f"${cost:.4f}",
                }
            )

        extra_context["user_summaries"] = user_summaries
        extra_context["grand_total"] = f"${grand_total:.4f}"

        return super().changelist_view(request, extra_context=extra_context)

    def has_add_permission(self, request):
        return False
