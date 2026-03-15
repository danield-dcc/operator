# tRPC como camada de API — Especificacao

## Contexto
Vamos adotar tRPC como camada de API/backend no Next.js App Router, com suporte a SSR e Server Components. A implementacao deve seguir:
- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://trpc.io/docs/client/tanstack-react-query/setup

## Stack
- Next.js (App Router, Server Components)
- tRPC
- @tanstack/react-query

## Estrutura de arquivos
```
src/
  server/
    trpc/
      init.ts          # createTRPCContext, createCallerFactory, router base
      routers/_app.ts  # appRouter
      query-client.ts  # makeQueryClient
      server.ts        # createHydrationHelpers (RSC)
      client.tsx       # TRPCProvider (Client Components)
  app/
    api/
      trpc/[trpc]/route.ts  # handler
```

## Setup (deps)
```bash
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query
```

## SSR + Server Components (RSC)
- Criar `server.ts` usando `createHydrationHelpers` de `@trpc/react-query/rsc`
- Usar `getQueryClient = cache(makeQueryClient)` (estavel por request)
- Prefetch no Server Component:
```tsx
const queryClient = getQueryClient();
void queryClient.prefetchQuery(trpc.hello.queryOptions({}));
return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <ClientComponent />
  </HydrationBoundary>
);
```

## Client Provider
- `TRPCProvider` em `client.tsx` usando `createTRPCReact`
- `httpBatchLink` apontando para `/api/trpc`
- `QueryClientProvider` + `trpc.Provider`

## API Route Handler
- Criar `app/api/trpc/[trpc]/route.ts` com `fetchRequestHandler`
- Exportar `GET` e `POST`

## TO-DOs de implementacao
### Fase 1 — Setup
- [ ] Instalar deps
- [ ] Criar estrutura `src/server/trpc/*`

### Fase 2 — RSC + Providers
- [ ] Implementar `server.ts` (RSC hydration helpers)
- [ ] Implementar `client.tsx` (TRPCProvider)

### Fase 3 — API Handler
- [ ] Implementar `app/api/trpc/[trpc]/route.ts`
- [ ] Criar `appRouter` base + procedure de exemplo

### Fase 4 — Integracao
- [ ] Prefetch em Server Component
- [ ] Consumir em Client Component
