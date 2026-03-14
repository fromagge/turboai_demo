# AGENTS.md — TurboAI Frontend

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **SWC**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config`)
- **Zustand v5** (global client state)
- **TanStack Query v5** (server state / data fetching)

## Project Structure

```
src/
├── app/              # Routes, layouts, pages (App Router)
├── components/ui/    # Reusable UI primitives
├── hooks/            # Custom React hooks
├── lib/              # Framework utilities (query-client, cn(), etc.)
├── services/         # API functions + queryOptions() factories
├── stores/           # Zustand stores
└── types/            # Shared TypeScript types
```

## Naming Conventions

| Thing            | Convention | Example                     |
| ---------------- | ---------- | --------------------------- |
| Files            | kebab-case | `app-store.ts`              |
| Components       | PascalCase | `export function DataTable` |
| Hooks            | camelCase  | `useAuth`                   |
| Stores           | camelCase  | `useAppStore`               |
| Types/Interfaces | PascalCase | `PaginatedResponse<T>`      |

## Server vs Client Components

- **Default to Server Components.** Only add `'use client'` when the component needs hooks, event handlers, or browser APIs.
- Push `'use client'` to the leaf components — keep parent layouts as Server Components.
- Data fetching belongs in Server Components or via TanStack Query in client components.

## Tailwind CSS v4 Patterns

- Config lives in `src/app/globals.css` via `@theme` blocks — there is no `tailwind.config` file.
- Use the `cn()` utility from `@/lib/utils` to merge class names: `cn("base-class", conditional && "active")`.
- Never use `@apply` unless absolutely necessary.

## Zustand v5 Patterns

- **Double-parens creation:** `create<T>()(middleware(...))`
- **Middleware order:** immer → devtools → persist (outermost to innermost)
- **Multi-selectors:** Use `useShallow` from `zustand/react/shallow` when selecting multiple fields
- **Slices pattern:** For large stores, split into slices and combine with `...a, ...b`
- Stores go in `src/stores/` with barrel export from `index.ts`

```ts
// Correct
const useStore = create<State>()(
  immer(
    devtools(
      persist(
        (set) => ({ ... }),
        { name: "store-name" },
      ),
    ),
  ),
);
```

## TanStack Query v5 Patterns

- Use `queryOptions()` factories in `src/services/` — never inline query keys.
- SSR prefetching: use `prefetchQuery` in Server Components + `HydrationBoundary` + `dehydrate`.
- Streaming: wrap data-dependent UI in `<Suspense>` with `useSuspenseQuery`.
- Use `gcTime` (not the removed `cacheTime`).
- Mutations follow the pattern: `useMutation` + `onSuccess` invalidation.

```ts
// Service factory
export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
  });
```

## Import Alias

Use `@/*` for all imports from `src/`: `import { cn } from "@/lib/utils"`.

## Do's and Don'ts

### Do

- Keep components small and focused
- Co-locate related files (component + its types + its styles)
- Use TypeScript strict mode — no `any`
- Validate API responses at the boundary
- Use `next/image` for images, `next/link` for navigation

### Don't

- Don't use `tailwind.config.ts` — Tailwind v4 uses CSS-first config
- Don't use `cacheTime` — it's `gcTime` in TanStack Query v5
- Don't use `create(...)` with single parens in Zustand v5 — use `create<T>()()`
- Don't put `'use client'` on layout or page files unless required
- Don't use `useEffect` for data fetching — use TanStack Query
- Don't commit `.env` files — use `.env.example` as a template (duh)
