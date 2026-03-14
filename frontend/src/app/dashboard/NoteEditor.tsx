"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CategoryDropdown } from "@/app/dashboard/new/CategoryDropdown";
import { CloseIcon } from "@/components/ui/CloseIcon";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { useNoteSave } from "@/hooks/useNoteSave";
import { lightenColor } from "@/lib/utils/colors";
import { categoriesQueryOptions } from "@/services/notes";
import type { Note } from "@/types/note";

type NoteEditorProps = {
  note?: Note;
};

export function NoteEditor({ note }: NoteEditorProps) {
  const router = useRouter();
  const { data } = useQuery(categoriesQueryOptions());
  const categories = useMemo(() => data?.categories ?? [], [data]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    note?.category.id ?? null,
  );
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  const { debouncedSave, flush } = useNoteSave(note?.id ?? null);

  const effectiveCategoryId =
    selectedCategoryId ?? (categories.length > 0 ? categories[0].id : null);
  const selectedCategory = categories.find((c) => c.id === effectiveCategoryId);
  const color = selectedCategory?.color ?? "#957139";
  const bg = lightenColor(color, 0.5);

  function handleTitleChange(value: string) {
    setTitle(value);
    debouncedSave(value, content, effectiveCategoryId);
  }

  function handleContentChange(value: string) {
    setContent(value);
    debouncedSave(title, value, effectiveCategoryId);
  }

  function handleCategoryChange(id: number) {
    setSelectedCategoryId(id);
    debouncedSave(title, content, id);
  }

  function handleClose() {
    flush(title, content, effectiveCategoryId);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <CategoryDropdown
          categories={categories}
          selectedCategoryId={effectiveCategoryId}
          onSelect={handleCategoryChange}
        />
        <button
          type="button"
          onClick={handleClose}
          className="flex h-6 w-6 items-center justify-center rounded-full text-foreground transition-colors hover:bg-button-hover"
        >
          <CloseIcon size={24} />
        </button>
      </div>

      <div
        className="flex min-h-[calc(100vh-140px)] flex-col rounded-card p-6"
        style={{
          border: `3px solid ${color}`,
          backgroundColor: bg,
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title"
          className="mb-4 w-full border-0 bg-transparent font-heading text-3xl font-bold text-black outline-none placeholder:text-black/30"
        />
        <MarkdownEditor
          value={content}
          onChange={handleContentChange}
          placeholder="Speak your mind and pour your heart out...."
        />
      </div>
    </div>
  );
}
