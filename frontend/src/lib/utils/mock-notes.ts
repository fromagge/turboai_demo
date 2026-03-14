import type { Note } from "@/types/note";

export const MOCK_NOTES: Note[] = [
  {
    id: "1",
    title: "Welcome to TurboAI Notes",
    content: `# Getting started

This is **markdown-powered** content. You can use:

- Lists
- *Italics* and **bold**
- \`inline code\`

> Blockquotes work too.`,
    category: "Random Thoughts",
    createdAt: "2025-03-10T09:00:00.000Z",
    updatedAt: "2025-03-12T14:30:00.000Z",
  },
  {
    id: "2",
    title: "Project ideas",
    content: `## Side projects

1. **Note-taking app** — already building it
2. **CLI tool** for daily logs
3. API with \`/api/notes\` endpoint`,
    category: "Personal",
    createdAt: "2025-03-11T11:20:00.000Z",
    updatedAt: "2025-03-11T11:20:00.000Z",
  },
  {
    id: "3",
    title: "Study notes — React",
    content: `# React patterns

- Server Components vs Client Components
- \`use client\` boundary
- Data fetching with TanStack Query`,
    category: "School",
    createdAt: "2025-03-09T16:45:00.000Z",
    updatedAt: "2025-03-13T10:15:00.000Z",
  },
];
