# Drizzle ORM + PostgreSQL — Especificacao

## Contexto

O **devroast** precisa de um banco de dados para persistir os roasts de codigo. Atualmente o app e um prototypo frontend-only sem backend. Esta spec define o modelo de dados baseado nas 4 telas do design (Pencil) e nas decisoes do produto.

### Decisoes do produto

- **Roast via IA (LLM)**: O roast sera gerado por um modelo de linguagem (OpenAI, Anthropic, etc.)
- **Anonimo**: Sem autenticacao. Qualquer pessoa pode submeter codigo. Sem tabela de users.
- **URL publica**: Cada roast tem uma URL publica para compartilhamento (ex: `/roast/abc123`)
- **OG Image dinamica**: Gerada no servidor via `next/og` para cada roast

### Stack

- **ORM**: Drizzle ORM (PostgreSQL driver)
- **Banco**: PostgreSQL 16 via Docker Compose
- **Runtime**: Next.js 16 (App Router, Server Actions / Route Handlers)

---

## Modelo de dados

### Analise das telas (Pencil)

O modelo foi derivado das 4 telas do design:

**Screen 1 — Code Input**: O usuario cola codigo, escolhe roast mode (toggle on/off) e submete.
- Dados de entrada: `code`, `language` (auto-detectada ou manual), `roast_mode` (boolean)

**Screen 2 — Roast Results**: Exibe o resultado do roast com score, verdict, analise detalhada e diff.
- Score ring: nota de 0 a 10 (ex: `3.5`)
- Verdict badge: texto como `needs_serious_help` com status `critical`/`warning`/`good`
- Roast quote: frase sarcastica gerada pela IA
- Meta: `lang: javascript`, `7 lines`
- Analysis cards: cada card tem `status` (critical/warning/good), `title` e `description`
- Diff (suggested_fix): codigo original vs codigo melhorado

**Screen 3 — Shame Leaderboard**: Ranking dos piores codigos.
- Cada entry tem: `rank`, `score`, `language`, `line_count`, code preview com syntax highlight
- Stats: `2,847 submissions`, `avg score: 4.2/10`

**Screen 4 — OG Image**: Card de compartilhamento.
- Logo, score grande, verdict, linguagem, line count, roast quote

---

## Enums

```typescript
// Severidade de um issue na analise
export const issueSeverityEnum = pgEnum("issue_severity", [
  "critical",
  "warning",
  "good",
]);

// Tipo de linha no diff
export const diffLineTypeEnum = pgEnum("diff_line_type", [
  "added",
  "removed",
  "context",
]);

// Verdict geral do roast
export const verdictEnum = pgEnum("verdict", [
  "excellent",
  "good",
  "needs_improvement",
  "needs_serious_help",
  "disaster",
]);
```

---

## Tabelas

### `roasts` — Tabela principal

Armazena cada submissao de codigo com o resultado do roast.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | ID unico |
| `share_id` | `text` | UNIQUE, NOT NULL | ID curto para URL publica (ex: `abc123`) |
| `code` | `text` | NOT NULL | Codigo submetido pelo usuario |
| `language` | `text` | NOT NULL | Linguagem detectada/selecionada (ex: `javascript`) |
| `line_count` | `integer` | NOT NULL | Numero de linhas do codigo |
| `roast_mode` | `boolean` | NOT NULL, default `true` | Se o modo roast (sarcasmo maximo) estava ativo |
| `score` | `real` | NOT NULL | Nota de 0.0 a 10.0 |
| `verdict` | `verdict` enum | NOT NULL | Verdict geral (ex: `needs_serious_help`) |
| `roast_quote` | `text` | NOT NULL | Frase sarcastica gerada pela IA |
| `suggested_code` | `text` | | Codigo melhorado sugerido pela IA (para gerar o diff) |
| `ai_model` | `text` | | Modelo de IA usado (ex: `gpt-4o`, `claude-sonnet-4-20250514`) |
| `created_at` | `timestamp with time zone` | NOT NULL, default `now()` | Data de criacao |

```typescript
export const roasts = pgTable("roasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  shareId: text("share_id").unique().notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  lineCount: integer("line_count").notNull(),
  roastMode: boolean("roast_mode").notNull().default(true),
  score: real("score").notNull(),
  verdict: verdictEnum("verdict").notNull(),
  roastQuote: text("roast_quote").notNull(),
  suggestedCode: text("suggested_code"),
  aiModel: text("ai_model"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
```

### `roast_issues` — Issues da analise detalhada

Cada roast tem N issues (os cards da secao `detailed_analysis`).

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | ID unico |
| `roast_id` | `uuid` | FK -> roasts.id, NOT NULL, CASCADE | Referencia ao roast |
| `severity` | `issue_severity` enum | NOT NULL | Severidade: `critical`, `warning`, `good` |
| `title` | `text` | NOT NULL | Titulo do issue (ex: `using var instead of const/let`) |
| `description` | `text` | NOT NULL | Descricao detalhada do issue |
| `order` | `integer` | NOT NULL, default `0` | Ordem de exibicao |

```typescript
export const roastIssues = pgTable("roast_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  roastId: uuid("roast_id")
    .notNull()
    .references(() => roasts.id, { onDelete: "cascade" }),
  severity: issueSeverityEnum("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
});
```

### Relacionamentos (Drizzle relations)

```typescript
export const roastsRelations = relations(roasts, ({ many }) => ({
  issues: many(roastIssues),
}));

export const roastIssuesRelations = relations(roastIssues, ({ one }) => ({
  roast: one(roasts, {
    fields: [roastIssues.roastId],
    references: [roasts.id],
  }),
}));
```

---

## Indices

```typescript
// Para busca rapida por share_id (pagina publica do roast)
// Ja coberto pelo UNIQUE constraint em share_id

// Para o leaderboard (ordenado por score ASC, paginado)
export const roastsScoreIdx = index("roasts_score_idx").on(roasts.score);

// Para filtrar por linguagem no leaderboard
export const roastsLanguageIdx = index("roasts_language_idx").on(roasts.language);

// Para ordenar por data (mais recentes)
export const roastsCreatedAtIdx = index("roasts_created_at_idx").on(roasts.createdAt);
```

---

## Diagrama ER

```
┌─────────────────────────────────────────────┐
│                   roasts                     │
├─────────────────────────────────────────────┤
│ id           UUID PK                        │
│ share_id     TEXT UNIQUE NOT NULL            │
│ code         TEXT NOT NULL                   │
│ language     TEXT NOT NULL                   │
│ line_count   INTEGER NOT NULL               │
│ roast_mode   BOOLEAN NOT NULL DEFAULT true   │
│ score        REAL NOT NULL                   │
│ verdict      verdict ENUM NOT NULL           │
│ roast_quote  TEXT NOT NULL                   │
│ suggested_code TEXT                          │
│ ai_model     TEXT                            │
│ created_at   TIMESTAMPTZ NOT NULL DEFAULT now│
└──────────────────────┬──────────────────────┘
                       │ 1:N
                       ▼
┌─────────────────────────────────────────────┐
│               roast_issues                   │
├─────────────────────────────────────────────┤
│ id           UUID PK                        │
│ roast_id     UUID FK -> roasts.id CASCADE    │
│ severity     issue_severity ENUM NOT NULL    │
│ title        TEXT NOT NULL                   │
│ description  TEXT NOT NULL                   │
│ order        INTEGER NOT NULL DEFAULT 0      │
└─────────────────────────────────────────────┘
```

---

## Docker Compose

```yaml
# docker-compose.yml (raiz do projeto)
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## Variaveis de ambiente

```env
# .env.local
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## Estrutura de arquivos

```
operator/
  docker-compose.yml          # CRIAR — PostgreSQL via Docker
  drizzle.config.ts            # CRIAR — Config do Drizzle Kit
  .env.local                   # CRIAR — DATABASE_URL
  src/
    db/
      index.ts                 # CRIAR — Instancia do Drizzle client
      schema.ts                # CRIAR — Tabelas, enums, relations
      migrate.ts               # CRIAR — Script de migracao (opcional)
  drizzle/                     # GERADO — Pasta de migracoes (pelo drizzle-kit)
```

---

## Dependencias a instalar

```bash
# Runtime
pnpm add drizzle-orm postgres

# Dev
pnpm add -D drizzle-kit @types/pg
```

> **Nota**: Usamos o driver `postgres` (postgres.js) que e o recomendado pelo Drizzle para PostgreSQL em ambientes serverless/edge. Alternativa: `pg` + `@neondatabase/serverless` se for usar Neon em producao.

---

## Configuracao do Drizzle Kit

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## TO-DOs de implementacao

### Fase 1 — Infraestrutura
- [ ] Criar `docker-compose.yml` na raiz do projeto
- [ ] Criar `.env.local` com `DATABASE_URL`
- [ ] Adicionar `.env.local` ao `.gitignore` (verificar se ja esta)
- [ ] Subir o container: `docker compose up -d`
- [ ] Testar conexao ao PostgreSQL

### Fase 2 — Drizzle ORM setup
- [ ] Instalar dependencias: `pnpm add drizzle-orm postgres` e `pnpm add -D drizzle-kit`
- [ ] Criar `drizzle.config.ts` na raiz
- [ ] Criar `src/db/schema.ts` com enums, tabelas e relations
- [ ] Criar `src/db/index.ts` com a instancia do Drizzle client
- [ ] Gerar a primeira migracao: `npx drizzle-kit generate`
- [ ] Aplicar migracao: `npx drizzle-kit migrate`
- [ ] Verificar tabelas no banco com `npx drizzle-kit studio`

### Fase 3 — Validacao
- [ ] Testar insert de um roast via script ou Drizzle Studio
- [ ] Testar insert de roast_issues vinculados
- [ ] Testar query do leaderboard (ordenado por score ASC)
- [ ] Testar query por share_id (pagina publica)
- [ ] Verificar cascade delete (deletar roast deve deletar issues)

### Fase 4 — Integracao com o app
- [ ] Criar Server Action ou Route Handler para submeter roast
- [ ] Criar rota `/roast/[shareId]` para pagina publica do roast
- [ ] Criar rota `/leaderboard` com query paginada
- [ ] Gerar `share_id` unico (nanoid ou similar) ao criar roast
- [ ] Integrar com a IA para gerar o roast (fase separada)

### Fase 5 — OG Image
- [ ] Criar rota `GET /roast/[shareId]/og` com `next/og` (ImageResponse)
- [ ] Renderizar score, verdict, linguagem, roast_quote no card
- [ ] Adicionar meta tags `og:image` na pagina `/roast/[shareId]`
