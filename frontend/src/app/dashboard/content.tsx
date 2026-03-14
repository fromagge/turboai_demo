"use client";

import { DashboardEmptyState } from "@/app/dashboard/empty";
import { NewNoteButton } from "@/app/dashboard/new-note-button";
import { NotesList } from "@/app/dashboard/notes-list";
import { Loading } from "@/components/ui/loading";
import { MOCK_NOTES } from "@/lib/utils/mock-notes";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardContent() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  const notes = MOCK_NOTES;

  return (
    <div className="relative w-full">
      <NewNoteButton />
      {notes.length > 0 ? <NotesList notes={notes} /> : <DashboardEmptyState />}
    </div>
  );
}
