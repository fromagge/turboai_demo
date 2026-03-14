import re

import nh3
from rest_framework import serializers

from notes.models import Category, Note


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "color")

    def validate_color(self, value: str) -> str:
        if not re.match(r"^#[0-9a-fA-F]{6}$", value):
            raise serializers.ValidationError(
                "Color must be a valid hex (e.g. #FF0000)"
            )
        return value


class NoteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
    )

    class Meta:
        model = Note
        fields = ("id", "title", "content", "category_id")

    def validate_content(self, value: str) -> str:
        return nh3.clean(value, tags=set())

    def validate_category_id(self, value: Category) -> Category:
        request = self.context["request"]
        if value.user != request.user:
            raise serializers.ValidationError("Category not found.")
        return value
