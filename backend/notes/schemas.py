from drf_pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: int
    name: str
    color: str
    note_count: int

    @classmethod
    def from_model(cls, category) -> dict:
        note_count = (
            category.note_count
            if hasattr(category, "note_count")
            else category.notes.count()
        )
        return cls(
            id=category.id,
            name=category.name,
            color=category.color,
            note_count=note_count,
        ).model_dump()


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    category: CategoryResponse
    created_at: str
    updated_at: str

    @classmethod
    def from_model(cls, note) -> dict:
        return cls(
            id=note.id,
            title=note.title,
            content=note.content,
            category=CategoryResponse.from_model(note.category),
            created_at=note.created_at.isoformat(),
            updated_at=note.updated_at.isoformat(),
        ).model_dump()
