import type { Note } from "@/types/note";

export function filterNotesByCategory(
  notes: Note[],
  categoryIds: number[],
): Note[] {
  if (categoryIds.length === 0) return notes;
  const set = new Set(categoryIds);
  return notes.filter((n) => set.has(n.category.id));
}
