from notes.models import Category, Note

DEFAULT_CATEGORIES = [
    {"name": "Random Thoughts", "color": "#78ABA8"},
    {"name": "School", "color": "#FCDC94"},
    {"name": "Personal", "color": "#EF9C66"},
]

DEFAULT_NOTES = [
    {
        "title": "Welcome to TurboAI Notes",
        "content": (
            "# Getting started\n\n"
            "This is **markdown-powered** content. You can use:\n\n"
            "- Lists\n"
            "- *Italics* and **bold**\n"
            "- `inline code`\n\n"
            "> Blockquotes work too."
        ),
        "category_name": "Random Thoughts",
    },
    {
        "title": "Project ideas",
        "content": (
            "## Side projects\n\n"
            "1. **Note-taking app** — already building it\n"
            "2. **CLI tool** for daily logs\n"
            "3. API with `/api/notes` endpoint"
        ),
        "category_name": "Personal",
    },
    {
        "title": "Study notes — React",
        "content": (
            "# React patterns\n\n"
            "- Server Components vs Client Components\n"
            "- `use client` boundary\n"
            "- Data fetching with TanStack Query"
        ),
        "category_name": "School",
    },
]


def create_default_notes(user) -> None:
    categories = Category.objects.bulk_create(
        [Category(user=user, **cat) for cat in DEFAULT_CATEGORIES]
    )
    category_map = {cat.name: cat for cat in categories}

    Note.objects.bulk_create(
        [
            Note(
                user=user,
                title=note["title"],
                content=note["content"],
                category=category_map.get(note["category_name"]),
            )
            for note in DEFAULT_NOTES
        ]
    )
