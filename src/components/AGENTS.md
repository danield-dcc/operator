# Page Components Patterns

## Responsibility
- `src/components/` is for page-level and feature-level components.
- Keep reusable primitives in `src/components/ui/`.
- Do not move page-specific sections into `ui/`.

## Client components
- Use client components only when hooks, local state, or client-only libraries are required.
- Components that read hydrated tRPC query data on the client should use `useTRPC` + `useSuspenseQuery`.

## Loading states
- Create a separate skeleton component for each async section.
- Keep skeletons simple and based on the existing theme tokens and Tailwind classes.

## Metrics UI
- For animated numeric metrics, use `@number-flow/react`.
- Keep metric formatting explicit, such as integer totals and one decimal place for averages.

## Component boundaries
- Prefer focused section components such as hero, stats, and leaderboard preview.
- Keep data-fetching concerns isolated to the components that actually need the data.
