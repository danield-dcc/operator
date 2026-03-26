# tRPC Patterns

## Structure
- Keep the tRPC implementation in `src/trpc/`.
- Use this file layout:
  - `init.ts`: `initTRPC`, context, `baseProcedure`, router helpers
  - `query-client.ts`: `makeQueryClient`
  - `client.tsx`: `TRPCReactProvider`, `useTRPC`
  - `server.tsx`: server-only proxy, `HydrateClient`, `prefetch`
  - `routers/_app.ts`: router composition and `AppRouter` export

## Context
- `createTRPCContext` should expose shared server dependencies such as `{ db }`.
- Use React `cache()` for request-stable context/query client helpers when appropriate.

## Routers
- Create new routers in dedicated files under `src/trpc/routers/`.
- Register every new router in `src/trpc/routers/_app.ts`.
- Keep procedures small, typed, and aligned to the current spec scope.
- Do not add extra mutations, routers, or endpoints proactively.

## App Router integration
- For read flows in Next.js App Router, prefer `prefetch(trpc...queryOptions())` in a Server Component.
- Hydrate prefetched data with `HydrateClient`.
- Consume hydrated query data in client components with `useTRPC` + `useSuspenseQuery`.

## Client/server boundaries
- `client.tsx` must stay client-only.
- `server.tsx` must stay server-only.
- Avoid importing server-only helpers into client components.
