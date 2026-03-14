import type { Category } from "@/types/category";

export interface Note {
  id: number;
  title: string;
  /** Markdown content */
  content: string;
  category: Category;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface NotesResponse {
  notes: Note[];
}

export interface NoteResponse {
  note: Note;
}
