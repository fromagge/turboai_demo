from django.core.cache import cache

CACHE_TTL = 60 * 15  # 15 minutes


def _notes_list_key(user_id: int) -> str:
    return f"notes:{user_id}:list"


def _note_detail_key(user_id: int, note_id: int) -> str:
    return f"notes:{user_id}:{note_id}"


def _categories_list_key(user_id: int) -> str:
    return f"categories:{user_id}:list"


def get_cached_notes_list(user_id: int) -> list | None:
    return cache.get(_notes_list_key(user_id))


def set_cached_notes_list(user_id: int, data: list) -> None:
    cache.set(_notes_list_key(user_id), data, CACHE_TTL)


def get_cached_note(user_id: int, note_id: int) -> dict | None:
    return cache.get(_note_detail_key(user_id, note_id))


def set_cached_note(user_id: int, note_id: int, data: dict) -> None:
    cache.set(_note_detail_key(user_id, note_id), data, CACHE_TTL)


def get_cached_categories(user_id: int) -> list | None:
    return cache.get(_categories_list_key(user_id))


def set_cached_categories(user_id: int, data: list) -> None:
    cache.set(_categories_list_key(user_id), data, CACHE_TTL)


def invalidate_note_caches(user_id: int, note_id: int | None = None) -> None:
    cache.delete(_notes_list_key(user_id))
    if note_id is not None:
        cache.delete(_note_detail_key(user_id, note_id))


def invalidate_category_caches(user_id: int) -> None:
    cache.delete(_categories_list_key(user_id))
    # Notes embed category data, so invalidate notes list too
    cache.delete(_notes_list_key(user_id))
