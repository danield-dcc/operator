# App Router Patterns

## Page composition
- When a page needs prefetched tRPC data, keep `page.tsx` as a Server Component.
- Do not mark the whole page with `"use client"` if only part of the tree needs client interactivity.
- Extract interactive sections into focused client components.

## Data loading
- Prefetch query data in the page or parent Server Component.
- Wrap prefetched sections with `HydrateClient`.
- Use `Suspense` close to the async section it serves.
- Provide a dedicated skeleton component for each suspended section.

## Providers
- Global providers belong in `src/app/layout.tsx`.
- `TRPCReactProvider` should be mounted in the root layout.

## Scope discipline
- Keep hardcoded sections hardcoded until a spec explicitly moves them to live data.
- For the homepage, only the metrics section should use tRPC right now.
