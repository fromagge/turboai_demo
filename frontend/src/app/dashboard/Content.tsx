"use client";

import { EmptyState } from "@/app/dashboard/EmptyState";
import { NewNoteButton } from "@/app/dashboard/NewNoteButton";
import { NotesList } from "@/app/dashboard/NotesList";
import { Loading } from "@/components/ui/Loading";
import { MOCK_NOTES } from "@/lib/utils/mock-notes";
import { useAuthStore } from "@/stores/auth-store";

export function Content() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  const notes = MOCK_NOTES;

  return (
    <div className="relative w-full">
      <NewNoteButton />
      {notes.length > 0 ? <NotesList notes={notes} /> : <EmptyState />}
    </div>
  );
}
