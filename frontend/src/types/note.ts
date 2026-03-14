export interface Note {
  id: string;
  title: string;
  /** Markdown content */
  content: string;
  category: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
