import type { Note } from "@/types/note";

export function stripMarkdownPreview(content: string, maxLen: number): string {
  const plain = content.replace(/#{1,6}\s?|\*{1,2}|`/g, "").trim();
  const snippet = plain.slice(0, maxLen);
  return snippet + (plain.length > maxLen ? "…" : "");
}

export function filterNotesByCategory(
  notes: Note[],
  categoryIds: number[],
): Note[] {
  if (categoryIds.length === 0) return notes;
  const set = new Set(categoryIds);
  return notes.filter((n) => set.has(n.category.id));
}
