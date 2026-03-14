import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/clients/api";
import type { CategoriesResponse, CategoryResponse } from "@/types/category";
import type { NoteResponse, NotesResponse } from "@/types/note";

// --- Categories ---

export function getCategories() {
  return apiClient<CategoriesResponse>("/api/notes/categories/");
}

export function createCategory(data: { name: string; color: string }) {
  return apiClient<CategoryResponse>("/api/notes/categories/create/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCategory(
  id: number,
  data: { name?: string; color?: string },
) {
  return apiClient<CategoryResponse>(`/api/notes/categories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: number) {
  return apiClient<void>(`/api/notes/categories/${id}/delete/`, {
    method: "DELETE",
  });
}

// --- Notes ---

export function getNotes() {
  return apiClient<NotesResponse>("/api/notes/");
}

export function getNote(id: number) {
  return apiClient<NoteResponse>(`/api/notes/${id}/`);
}

export function createNote(data: {
  title: string;
  content: string;
  category_id: number;
}) {
  return apiClient<NoteResponse>("/api/notes/create/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateNote(
  id: number,
  data: {
    title?: string;
    content?: string;
    category_id?: number;
  },
) {
  return apiClient<NoteResponse>(`/api/notes/${id}/update/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteNote(id: number) {
  return apiClient<void>(`/api/notes/${id}/delete/`, {
    method: "DELETE",
  });
}

// --- Query Options ---

export function notesQueryOptions() {
  return queryOptions({
    queryKey: ["notes", "list"],
    queryFn: getNotes,
    staleTime: 30_000,
  });
}

export function noteQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["notes", "detail", id],
    queryFn: () => getNote(id),
    staleTime: 30_000,
  });
}

export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: ["notes", "categories"],
    queryFn: getCategories,
    staleTime: 30_000,
  });
}
