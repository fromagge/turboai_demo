"use client";

import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/app/dashboard/EmptyState";
import { ErrorState } from "@/app/dashboard/ErrorState";
import { NewNoteButton } from "@/app/dashboard/NewNoteButton";
import { NotesList } from "@/app/dashboard/NotesList";
import { Loading } from "@/components/ui/Loading";
import { filterNotesByCategory } from "@/lib/utils/notes";
import { sortByUpdatedAt } from "@/lib/utils/sort";
import { notesQueryOptions } from "@/services/notes";
import { useCategoryFilterStore } from "@/stores/category-filter-store";

export function Content() {
  const { data, isError, isLoading, refetch } = useQuery(notesQueryOptions());
  const selectedCategoryIds = useCategoryFilterStore(
    (s) => s.selectedCategoryIds,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Couldn't load notes. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const notes = data?.notes ?? [];
  const filtered = filterNotesByCategory(notes, selectedCategoryIds);
  const sortedNotes = sortByUpdatedAt(filtered);

  return (
    <div className="relative flex w-full flex-1 flex-col pt-24">
      <NewNoteButton />
      {sortedNotes.length > 0 ? (
        <NotesList notes={sortedNotes} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
