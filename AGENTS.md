# Project Rules (devroast)

## Core UI patterns
- Composition over props: use Root/Title/Description/etc subcomponents (named exports, no dot notation).
- Tailwind only for styling; use theme tokens from `src/app/globals.css`.
- Prefer `tailwind-variants` (`tv`) for variants; pass `className` through `tv`.
- Avoid template-string class interpolation; use `twMerge` when combining classes manually.

## Layout + structure
- Navbar is global in `src/app/layout.tsx` and uses composed `Navbar*` components.
- Homepage lives in `src/app/page.tsx` and uses composed UI pieces.

## Data + API
- Use tRPC v11 with `@trpc/tanstack-react-query` as the API layer.
- Prefer Server Components for read flows that can prefetch data on the server.
- Use `Suspense` with dedicated skeleton components for async loading states.
- Do not implement API routes, routers, or frontend data flows beyond the active spec scope.
- On the homepage, only the metrics section should read from tRPC for now; the rest of the page stays as-is until a new spec says otherwise.
- For animated metric values, use `@number-flow/react`.
- When a tRPC procedure needs to run multiple independent DB queries, execute them with `Promise.all` to avoid sequential round-trips. Example: `getShameLeaderboard` in `src/trpc/routers/metrics.ts` fetches the total count and the worst roasts in parallel.

## Components
- UI components live in `src/components/ui/`.
- Named exports only; extend `ComponentProps<"tag">` for each subcomponent.

## Content
- Keep text concise and product-focused (roast tone).
