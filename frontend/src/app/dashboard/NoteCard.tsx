import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { lightenColor } from "@/lib/utils/colors";
import { formatNoteDate } from "@/lib/utils/date";
import { truncateMarkdown } from "@/lib/utils/notes";
import type { Note } from "@/types/note";

export function NoteCard({ note }: { note: Note }) {
  const color = note.category.color;
  const bg = lightenColor(color, 0.5);

  return (
    <li>
      <Link
        href={`/dashboard/${note.id}`}
        className="flex min-h-60 flex-col rounded-card p-4 text-black transition-opacity hover:opacity-90"
        style={{
          border: `3px solid ${color}`,
          backgroundColor: bg,
        }}
      >
        <div className="mb-2 flex items-center gap-2 font-sans text-xs leading-[100%] tracking-normal text-black">
          <span className="font-bold">{formatNoteDate(note.updated_at)}</span>
          <span className="font-normal">{note.category.name}</span>
        </div>
        <h2 className="truncate py-1.5 font-heading text-2xl font-bold leading-[100%] tracking-normal text-black">
          {note.title}
        </h2>

        <div className="prose prose-sm min-h-0 max-h-48 max-w-none flex-1 overflow-hidden text-sm text-black">
          <ReactMarkdown>{truncateMarkdown(note.content)}</ReactMarkdown>
        </div>
      </Link>
    </li>
  );
}
