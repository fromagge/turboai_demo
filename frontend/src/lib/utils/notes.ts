import type { Note } from "@/types/note";

export function truncateMarkdown(
  content: string,
  maxLines = 5,
  maxChars = 500,
): string {
  const lines = content.split("\n").slice(0, maxLines);
  let result = lines.join("\n");
  if (result.length > maxChars) {
    result = result.slice(0, maxChars) + "...";
  } else if (
    content.split("\n").length > maxLines ||
    content.length > maxChars
  ) {
    result += "...";
  }
  return result;
}

export function filterNotesByCategory(
  notes: Note[],
  categoryIds: number[],
): Note[] {
  if (categoryIds.length === 0) return notes;
  const set = new Set(categoryIds);
  return notes.filter((n) => set.has(n.category.id));
}
