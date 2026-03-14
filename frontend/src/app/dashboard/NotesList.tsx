import { NoteCard } from "@/app/dashboard/NoteCard";
import type { Note } from "@/types/note";

export function NotesList({ notes }: { notes: Note[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </ul>
  );
}
