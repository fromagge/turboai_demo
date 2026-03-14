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

export interface NoteHistory {
  id: number;
  title: string;
  content: string;
  changed_by: string | null;
  changed_at: string;
}

export interface NotesResponse {
  notes: Note[];
}

export interface NoteResponse {
  note: Note;
}

export interface NoteHistoryResponse {
  history: NoteHistory[];
}
