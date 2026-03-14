import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote, updateNote } from "@/services/notes";

const DEBOUNCE_MS = 1000;

export function useNoteSave(initialNoteId: number | null) {
  const queryClient = useQueryClient();
  const noteIdRef = useRef<number | null>(initialNoteId);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      noteIdRef.current = data.note.id;
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to save note");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      title?: string;
      content?: string;
      category_id?: number;
    }) => updateNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to save changes");
    },
  });

  const save = useCallback(
    (title: string, content: string, categoryId: number | null) => {
      if (!categoryId || !title.trim()) return;

      if (noteIdRef.current) {
        updateMutation.mutate({
          id: noteIdRef.current,
          title: title.trim(),
          content,
          category_id: categoryId,
        });
      } else {
        createMutation.mutate({
          title: title.trim(),
          content,
          category_id: categoryId,
        });
      }
    },
    [createMutation, updateMutation],
  );

  const debouncedSave = useCallback(
    (title: string, content: string, categoryId: number | null) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(
        () => save(title, content, categoryId),
        DEBOUNCE_MS,
      );
    },
    [save],
  );

  const flush = useCallback(
    (title: string, content: string, categoryId: number | null) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
        save(title, content, categoryId);
      }
    },
    [save],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return { debouncedSave, flush };
}
