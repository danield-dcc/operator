# tRPC API Layer — Especificacao

## Contexto

O **devroast** e um app Next.js 16 (App Router) com banco PostgreSQL via Drizzle ORM. O frontend esta completo com componentes UI, code editor e paginas — tudo usando dados hardcoded. O banco existe, tem seed com 100 roasts, mas nenhuma pagina consulta o banco.

Esta spec define a camada de API usando **tRPC v11** com o novo client `@trpc/tanstack-react-query`, integrando com React Server Components (RSC) para prefetch de dados no servidor e streaming via `Suspense`.

### Decisoes

- **tRPC v11** com `@trpc/tanstack-react-query` (novo pattern baseado em `queryOptions`)
- **Server Components** fazem prefetch via `createTRPCOptionsProxy` + `HydrationBoundary`
- **Client Components** consomem dados via `useSuspenseQuery` + `Suspense` boundaries
- **Skeleton components** como fallback nos `Suspense` boundaries
- **Sem superjson** — o schema nao usa `Date` objects no client
- **Primeira procedure**: `metrics.getHomepageStats` — retorna `totalRoasts` e `avgScore`

---

## Arquitetura

### Fluxo de dados (Server Component + Prefetch)

```
┌────────────────────────────────────────────────────────┐
│  Server Component (page.tsx)                           │
│                                                        │
│  1. getQueryClient()                                   │
│  2. prefetch(trpc.metrics.getHomepageStats.queryOptions())│
│  3. <HydrateClient>                                    │
│       <Suspense fallback={<Skeleton />}>               │
│         <ClientComponent />  ← useSuspenseQuery        │
│       </Suspense>                                      │
│     </HydrateClient>                                   │
└────────────────────────────────────────────────────────┘
```

---

## Estrutura de arquivos

```
src/
  trpc/
    init.ts              # initTRPC, context, baseProcedure, createTRPCRouter
    client.tsx           # 'use client' — TRPCProvider, useTRPC, TRPCReactProvider
    server.tsx           # 'server-only' — createTRPCOptionsProxy, HydrateClient, prefetch
    query-client.ts      # makeQueryClient factory
    routers/
      _app.ts            # appRouter (merge), export type AppRouter
      metrics.ts         # metricsRouter — getHomepageStats
  app/
    api/trpc/[trpc]/route.ts   # fetchRequestHandler (GET + POST)
    page.tsx                   # Server Component com prefetch + HydrateClient
    layout.tsx                 # TRPCReactProvider wrapping children
  components/
    homepage-hero.tsx              # Client Component (code editor + actions)
    homepage-stats.tsx             # Client Component (useSuspenseQuery + NumberFlow)
    homepage-stats-skeleton.tsx    # Skeleton para Suspense fallback
    leaderboard-preview.tsx        # Client Component (leaderboard hardcoded)
```

---

## Dependencias

```bash
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod server-only client-only
pnpm add @number-flow/react
```

| Pacote | Versao | Proposito |
|--------|--------|-----------|
| `@trpc/server` | ^11.x | Backend — routers, procedures, context |
| `@trpc/client` | ^11.x | Client — createTRPCClient, httpBatchLink |
| `@trpc/tanstack-react-query` | ^11.x | Integracao React — createTRPCContext, createTRPCOptionsProxy |
| `@tanstack/react-query` | ^5.x | Cache, prefetch, dehydration, Suspense |
| `zod` | ^4.x | Validacao de input nas procedures |
| `server-only` | ^0.x | Garantir que server.tsx nao e importado no client |
| `client-only` | ^0.x | Garantir que client.tsx nao e importado no server |
| `@number-flow/react` | ^0.x | Animacao de numeros (zero → valor real) |

---

## Especificacao dos arquivos

### `src/trpc/init.ts`

- `createTRPCContext` com `cache()` do React, injeta `{ db }` no context
- `initTRPC.context<ContextType>().create()` sem transformer
- Exports: `createTRPCRouter`, `createCallerFactory`, `baseProcedure`

### `src/trpc/query-client.ts`

- `makeQueryClient()` com `staleTime: 30s`
- `shouldDehydrateQuery` extendido para incluir queries `pending` (permite streaming)

### `src/trpc/client.tsx`

- `"use client"` directive
- `createTRPCContext<AppRouter>()` → exports `TRPCProvider`, `useTRPC`
- `TRPCReactProvider` wraps `QueryClientProvider` + `TRPCProvider`
- Singleton `browserQueryClient` no browser
- `httpBatchLink` apontando para `/api/trpc`

### `src/trpc/server.tsx`

- `import "server-only"`
- `createTRPCOptionsProxy` com `ctx`, `router`, `queryClient`
- Helpers: `HydrateClient` (HydrationBoundary wrapper), `prefetch` (generic prefetch helper)
- `getQueryClient` com `cache(makeQueryClient)`

### `src/trpc/routers/_app.ts`

- Merge `metricsRouter` como `metrics` namespace
- Export `AppRouter` type

### `src/trpc/routers/metrics.ts`

- `getHomepageStats` — query sem input
- Usa Drizzle: `count(roasts.id)` + `avg(roasts.score)`
- Retorna `{ totalRoasts: number, avgScore: number }`

### `src/app/api/trpc/[trpc]/route.ts`

- `fetchRequestHandler` com `endpoint: "/api/trpc"`
- Exports `GET` e `POST`

---

## Refatoracao da Homepage

### Arvore de componentes

```
page.tsx (Server Component)
├── prefetch(trpc.metrics.getHomepageStats)
├── <HydrateClient>
│   ├── <HomepageHero />                  ← "use client" (editor + toggle + button)
│   ├── <Suspense fallback={<Skeleton />}>
│   │   └── <HomepageStats />             ← "use client" (useSuspenseQuery + NumberFlow)
│   └── <LeaderboardPreview />            ← "use client" (hardcoded por agora)
```

### `HomepageStats` — numeros animados

- `useSuspenseQuery` → suspende ate dados chegarem
- `NumberFlow` de `@number-flow/react` → anima 0 → valor real
- `totalRoasts` formatado como inteiro com separador de milhar
- `avgScore` formatado com 1 casa decimal

### `HomepageStatsSkeleton`

- Barra cinza animada (`animate-pulse`) no lugar do texto de stats

---

## TO-DOs de implementacao

### Fase 1 — Setup tRPC
- [x] Instalar dependencias
- [x] Criar `src/trpc/init.ts`
- [x] Criar `src/trpc/query-client.ts`
- [x] Criar `src/trpc/client.tsx`
- [x] Criar `src/trpc/server.tsx`
- [x] Criar `src/trpc/routers/_app.ts`
- [x] Criar `src/app/api/trpc/[trpc]/route.ts`
- [x] Remover `src/server/trpc/`

### Fase 2 — Procedure de metricas
- [x] Criar `src/trpc/routers/metrics.ts` com `getHomepageStats`
- [x] Registrar no `appRouter`

### Fase 3 — Instalar number-flow
- [x] Instalar `@number-flow/react`

### Fase 4 — Refatorar homepage
- [x] Editar `src/app/layout.tsx` — `<TRPCReactProvider>`
- [x] Criar `src/components/homepage-hero.tsx`
- [x] Criar `src/components/leaderboard-preview.tsx`
- [x] Criar `src/components/homepage-stats.tsx` (useSuspenseQuery + NumberFlow)
- [x] Criar `src/components/homepage-stats-skeleton.tsx`
- [x] Refatorar `src/app/page.tsx` (Server Component + prefetch + Suspense)

### Fase 5 — Validacao
- [x] Dev server inicia sem erros
- [x] Metricas carregam do banco
- [x] Skeleton aparece durante loading
- [x] Numeros animam de 0 → valor real
- [x] Code editor funciona sem regressoes
- [x] Rota `/api/trpc/metrics.getHomepageStats` retorna JSON correto
