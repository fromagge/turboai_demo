import { CATEGORY_COLOR_MAP, lightenColor } from "@/lib/utils/colors";
import type { Note } from "@/types/note";

function stripMarkdownPreview(content: string, maxLen: number): string {
  const plain = content.replace(/#{1,6}\s?|\*{1,2}|`/g, "").trim();
  const snippet = plain.slice(0, maxLen);
  return snippet + (plain.length > maxLen ? "…" : "");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NotesList({ notes }: { notes: Note[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => {
        const color = CATEGORY_COLOR_MAP[note.category] ?? "#957139";
        const bg = lightenColor(color, 0.5);

        return (
          <li
            key={note.id}
            className="min-h-60 rounded-card p-4 text-black transition-opacity hover:opacity-90"
            style={{
              border: `3px solid ${color}`,
              backgroundColor: bg,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold leading-tight text-black">
                {note.title}
              </h2>
              <span className="text-xs text-black/60">{note.category}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-black/60">
              {stripMarkdownPreview(note.content, 120)}
            </p>
            <div className="mt-2 flex gap-4 text-xs text-black/60">
              <span>Created {formatDate(note.createdAt)}</span>
              <span>Updated {formatDate(note.updatedAt)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
