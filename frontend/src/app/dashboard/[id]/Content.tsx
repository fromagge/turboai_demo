"use client";

import { useQuery } from "@tanstack/react-query";

import { ErrorState } from "@/app/dashboard/ErrorState";
import { NoteEditor } from "@/app/dashboard/NoteEditor";
import { Loading } from "@/components/ui/Loading";
import { noteQueryOptions } from "@/services/notes";

export function Content({ noteId }: { noteId: number }) {
  const { data, isLoading, isError, refetch } = useQuery(
    noteQueryOptions(noteId),
  );

  if (isLoading) return <Loading />;
  if (isError || !data) {
    return (
      <ErrorState
        message="Couldn't load note. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return <NoteEditor note={data.note} />;
}
