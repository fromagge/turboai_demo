# CLAUDE.md — TurboAI Frontend

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint (includes import sorting)
- `npm run format` — Prettier format all source files
- `npm run format:check` — Check formatting without writing

## Imports

- Always use `@/` absolute imports — never relative imports.
- Import order is enforced by ESLint (`simple-import-sort`) and must be:
  1. External packages (`react`, `next`, `zustand`, `@tanstack/*`, etc.)
  2. Internal `@/` aliases
  3. Relative imports (avoid — use `@/` instead)
  4. CSS / style imports
- Each category must be separated by a blank line.

## Formatting & Linting

- Pre-commit hook (husky + lint-staged) auto-runs Prettier and ESLint `--fix` on staged files.
- Prettier config: double quotes, semicolons, trailing commas, 80 char width.
- Do not disable or skip ESLint rules — fix the underlying issue.

## Code Style

- TypeScript strict — no `any`.
- **Next.js 16**: Middleware is now called **Proxy** — use `src/proxy.ts` with a named `proxy` export (not `middleware.ts`).
- Default to Server Components. Only add `'use client'` when the component needs hooks, event handlers, or browser APIs. Push `'use client'` to leaf components.
- Use `cn()` from `@/lib/utils` for conditional class names.
- Tailwind v4 CSS-first config in `globals.css` — there is no `tailwind.config` file.
- Zustand v5: `create<T>()()` double-parens, middleware order: immer → devtools → persist.
- TanStack Query v5: `queryOptions()` factories in `src/services/`, use `gcTime` not `cacheTime`.

## Project Structure

```
src/
├── app/              # Routes, layouts, pages (App Router)
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/
│   ├── clients/      # API client, query client, query provider
│   ├── schemas/      # Zod schemas (one file per domain: login.ts, register.ts, etc.)
│   └── utils.ts      # cn() and other small utilities
├── services/         # API functions + queryOptions() factories
├── stores/           # Zustand stores
└── types/            # Shared TypeScript types
```

- When a module grows beyond a single file, convert it to a folder. Import directly from the specific file (e.g. `@/lib/schemas/login`), **never** create `index.ts` barrel exports.
- Create directories as needed — don't add empty placeholder files.
