"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CategoryRow } from "@/components/CategoryRow";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Input } from "@/components/ui/Input";
import { DEFAULT_CATEGORY_COLOR } from "@/lib/constants/colors";
import {
  categoriesQueryOptions,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/notes";
import { useCategoryFilterStore } from "@/stores/category-filter-store";

export function Sidebar() {
  const queryClient = useQueryClient();
  const { data } = useQuery(categoriesQueryOptions());
  const categories = data?.categories ?? [];
  const { selectedCategoryIds, toggleCategory, clearAll } =
    useCategoryFilterStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(DEFAULT_CATEGORY_COLOR);
  const inputRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "categories"] });
      setNewName("");
      setNewColor(DEFAULT_CATEGORY_COLOR);
      setIsAdding(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { color?: string } }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["notes", "list"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["notes", "list"] });
    },
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setIsAdding(false);
      setNewName("");
      return;
    }
    createMutation.mutate({ name: trimmed, color: newColor });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewName("");
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-transparent p-6 pt-24">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={clearAll}
          className="mb-2 cursor-pointer text-left text-xs font-bold leading-[100%] tracking-normal text-black"
        >
          All categories
        </button>
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            isSelected={selectedCategoryIds.includes(category.id)}
            onSelect={() => toggleCategory(category.id)}
            onColorChange={(id, color) =>
              updateMutation.mutate({ id, data: { color } })
            }
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        ))}
        {isAdding ? (
          <div className="flex items-center gap-2">
            <ColorPicker value={newColor} onChange={setNewColor} />
            <Input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewName(e.target.value)
              }
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              disabled={createMutation.isPending}
              placeholder="Category name"
              variant="ghost"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="flex cursor-pointer items-center gap-2 opacity-60 hover:opacity-100"
          >
            <Image
              src="/static/assets/icons/plus.svg"
              alt=""
              width={11}
              height={11}
            />
            <span className="text-xs font-normal leading-[100%] tracking-normal text-black">
              Add category
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
