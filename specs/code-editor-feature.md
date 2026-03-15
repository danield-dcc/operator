# Code Editor com Syntax Highlighting — Especificacao

## Contexto

O **devroast** e um app onde usuarios colam codigo e recebem um "roast" (code review brutal). Atualmente o editor e um `<textarea>` simples sem syntax highlighting (`src/components/code-editor.tsx`). Precisamos adicionar:

1. **Syntax highlighting** aplicado automaticamente ao colar/digitar codigo
2. **Deteccao automatica de linguagem** a partir do conteudo colado
3. **Selecao manual de linguagem** como alternativa a auto-deteccao

---

## Pesquisa: Como o ray.so funciona

O repositorio [ray.so](https://github.com/raycast/ray-so) foi analisado em detalhes.

### Arquitetura do editor

O ray.so **nao usa nenhuma biblioteca de editor** (nao usa CodeMirror, Monaco, etc.). A abordagem e um pattern classico de "textarea overlay":

- Um `<textarea>` transparente (`-webkit-text-fill-color: transparent`) captura input do usuario
- Um `<div>` com o HTML highlighted (via Shiki) fica posicionado na mesma celula de CSS Grid
- Um pseudo-elemento `::after` (via `data-value`) faz o auto-sizing do container
- Keyboard handling customizado: Tab/Shift+Tab para indentacao, Enter com auto-indent, etc.

### Syntax highlighting

Usam **duas bibliotecas com propositos diferentes**:

| Biblioteca | Proposito |
|------------|-----------|
| **highlight.js** (v11) | Deteccao automatica de linguagem via `highlightAuto()` |
| **Shiki** (v1) | Renderizacao do syntax highlighting (gramaticas TextMate) |

### Sistema de temas

Usam **CSS Variables como ponte** entre Shiki e os temas:

1. Criam UM unico tema Shiki que gera CSS variables (`--ray-token-keyword`, `--ray-token-string`, etc.)
2. Cada tema visual define os valores dessas variaveis como inline styles
3. Trocar de tema e instantaneo — sem re-tokenizar

### Lazy loading de linguagens

Cada gramatica Shiki e carregada sob demanda: `() => import("shiki/langs/python.mjs")`. Apenas JS, TSX, Swift e Python sao pre-carregados. Isso otimiza o bundle.

### State management

Usam **Jotai** com `atomWithHash` para sincronizar todo o estado do editor na URL hash (codigo em Base64, tema, linguagem, padding, etc.).

### Arquivos-chave do ray.so

| Arquivo | Proposito |
|---------|-----------|
| `app/(navigation)/(code)/components/Editor.tsx` | Textarea overlay + keyboard handling |
| `app/(navigation)/(code)/components/HighlightedCode.tsx` | Renderiza HTML do Shiki |
| `app/(navigation)/(code)/store/code.ts` | Atoms de codigo + deteccao de linguagem |
| `app/(navigation)/(code)/util/languages.ts` | Registry de linguagens com lazy loading |
| `app/(navigation)/(code)/util/theme-css-variables.ts` | Factory de tema Shiki com CSS vars |

---

## Pesquisa: Alternativas avaliadas

### Opcao 1 — Custom textarea + Shiki + highlight.js (abordagem ray.so)

**Arquitetura**: Textarea invisivel sobre div com HTML highlighted.

- **Bundle novo**: ~100-120 KB (highlight.js common subset; Shiki ja esta instalado)
- **Auto-deteccao**: `hljs.highlightAuto()` — padrao do mercado
- **Qualidade**: Excelente (gramaticas TextMate, mesma base do VS Code)
- **Tema**: Reutiliza o `vesper` ja configurado
- **Complexidade**: Media — requer CSS de overlay, sync de scroll, debounce

**Pros**: Shiki ja instalado, melhor qualidade de highlighting, controle total do UI
**Cons**: CSS do overlay nao e trivial, scroll sync pode dar problema, precisa de 2 bibliotecas

### Opcao 2 — CodeMirror 6

**Arquitetura**: Framework completo de editor com DOM, state e highlighting proprios.

- **Bundle novo**: ~250-350 KB
- **Auto-deteccao**: Nao tem — precisaria de highlight.js mesmo assim
- **Qualidade**: Boa (usa Lezer parser, nao TextMate)
- **Tema**: Sistema proprio, diferente de Shiki/Tailwind
- **Complexidade**: Alta para este caso de uso — e um editor completo com features que nao precisamos

**Pros**: Editor de alta qualidade, incremental parsing, acessibilidade
**Cons**: Overkill total, sem auto-deteccao, sem wrapper React oficial, teria 2 sistemas de highlighting (CodeMirror + Shiki existente)

### Opcao 3 — Monaco Editor (VS Code)

**Arquitetura**: O editor completo do VS Code no browser.

- **Bundle novo**: ~900+ KB (via CDN)
- **Auto-deteccao**: Nao tem
- **Qualidade**: Excelente (mesma do VS Code)
- **Tema**: Sistema proprio
- **Complexidade**: Media (drop-in), mas operacionalmente pesado (web workers, CDN)

**Pros**: Melhor experiencia de edicao possivel, IntelliSense, autocomplete
**Cons**: Absurdamente pesado (~900 KB), React 19 ainda em RC, web workers complicam Next.js, overkill total

### Opcao 4 — Shiki + highlight.js (sem overlay, areas separadas)

**Arquitetura**: Textarea simples para input + area separada com Shiki para preview highlighted.

- **Bundle novo**: ~100-120 KB (apenas highlight.js; Shiki ja esta instalado)
- **Auto-deteccao**: `hljs.highlightAuto()`
- **Qualidade**: Excelente (mesma do Opcao 1)
- **Tema**: Reutiliza vesper
- **Complexidade**: Baixa — sem overlay, sem scroll sync

**Pros**: Implementacao mais simples, mesma qualidade, reutiliza Shiki existente
**Cons**: Sem highlighting ao vivo no textarea (usuario ve texto puro enquanto digita)

### Opcao 5 — Prism.js (prism-react-renderer)

**Arquitetura**: Componente React com render props para highlighting.

- **Bundle novo**: ~26 KB (+highlight.js para deteccao)
- **Auto-deteccao**: Nao tem
- **Qualidade**: Boa (regex-based, inferior a TextMate)
- **Tema**: Formato proprio, diferente de Shiki
- **Complexidade**: Baixa-Media

**Pros**: Menor bundle de todos
**Cons**: Qualidade inferior, sem auto-deteccao, tema incompativel com Shiki, criaria inconsistencia com CodeBlock existente

---

## Tabela comparativa

| Criterio | 1: Overlay Shiki+hljs | 2: CodeMirror | 3: Monaco | 4: Separado Shiki+hljs | 5: Prism |
|----------|----------------------|---------------|-----------|----------------------|----------|
| **Bundle novo (gzip)** | ~100-120 KB | ~250-350 KB | ~900+ KB | ~100-120 KB | ~26 KB (+hljs) |
| **Auto-deteccao** | hljs | Nao (precisa hljs) | Nao (precisa hljs) | hljs | Nao (precisa hljs) |
| **Qualidade highlight** | Excelente | Boa | Excelente | Excelente | Boa |
| **Consistencia com tema** | Reutiliza vesper | Sistema separado | Sistema separado | Reutiliza vesper | Sistema separado |
| **React 19 / Next.js 16** | OK | Precisa wrapper | RC apenas | OK | Provavelmente OK |
| **Highlighting ao vivo** | Sim | Sim | Sim | Nao | Possivel (com esforco) |
| **Complexidade** | Media | Alta | Media (mas pesado) | **Baixa** | Baixa-Media |
| **Deps ja instaladas** | Shiki sim | Nada | Nada | Shiki sim | Nada |

---

## Recomendacao

### Abordagem escolhida: Opcao 1 — Custom textarea + Shiki + highlight.js

**Justificativa**:

1. **Shiki ja esta instalado** (v4.0.2) com o tema `vesper` configurado e funcionando no `CodeBlock`. Nao faz sentido trazer outro highlighter.

2. **highlight.js `highlightAuto()` e o padrao do mercado** para deteccao automatica. Todas as opcoes que incluem auto-deteccao precisam dele de qualquer forma.

3. **A abordagem do ray.so prova que funciona** em producao com excelente UX. O pattern de textarea overlay e bem estabelecido e nao requer um framework pesado.

4. **Consistencia visual**: Usando o mesmo Shiki + vesper do `CodeBlock` existente, o highlighting no editor sera identico ao highlighting na exibicao de codigo.

5. **Bundle otimizado**: ~100-120 KB de custo novo (highlight.js common subset). Usando `highlight.js/lib/core` + cherry-pick de ~15 linguagens comuns, pode cair para ~40-60 KB.

6. **Controle total do UI**: Sem dependencia de estilos de terceiros. Funciona perfeitamente com Tailwind CSS v4 e os design tokens existentes.

> **Nota**: Se a complexidade do CSS overlay se mostrar excessiva, podemos simplificar para a Opcao 4 (areas separadas) como fallback — o codigo de deteccao e highlighting e o mesmo, so muda o layout.

---

## Especificacao da feature

### Comportamento esperado

1. **Usuario cola ou digita codigo** no editor
2. **Auto-deteccao**: Apos debounce (~300ms), `hljs.highlightAuto()` identifica a linguagem
3. **Highlighting ao vivo**: O codigo e renderizado com Shiki usando a linguagem detectada
4. **Badge de linguagem**: A linguagem detectada e exibida no header do editor
5. **Selecao manual**: Um dropdown no header permite o usuario escolher outra linguagem, sobrepondo a auto-deteccao
6. **Reset**: Se o usuario limpar a selecao manual, volta para auto-deteccao

### Componentes a criar/modificar

```
src/
  components/
    code-editor.tsx          # MODIFICAR — adicionar overlay highlight + header com language selector
  hooks/
    use-language-detection.ts # CRIAR — hook de auto-deteccao com highlight.js
    use-shiki-highlighter.ts  # CRIAR — hook para instancia Shiki client-side
```

### Arquitetura do editor

```
CodeEditorRoot (div com border/bg)
  CodeEditorHeader (traffic lights + language selector)
    [traffic lights]
    [LanguageSelector dropdown] — mostra linguagem detectada, permite override manual
  CodeEditorBody (container do overlay, CSS Grid)
    CodeEditorLineNumbers (div com numeros de linha, sincronizado com scroll)
    CodeEditorContent (container do overlay textarea+highlight)
      CodeEditorHighlight (div com HTML Shiki, pointer-events: none, z-index: 1)
      CodeEditorTextarea (textarea transparente, z-index: 2)
```

### Hook: `useLanguageDetection`

```typescript
// Recebe o codigo, retorna a linguagem detectada
// Usa debounce para nao rodar em cada keystroke
// Permite override manual que sobrepoe a deteccao
type UseLanguageDetection = {
  detectedLanguage: string | null
  selectedLanguage: string       // manual > detected > "plaintext"
  setManualLanguage: (lang: string | null) => void
  isAutoDetected: boolean
}
```

### Hook: `useShikiHighlighter`

```typescript
// Inicializa Shiki no client-side (lazy)
// Retorna funcao para gerar HTML highlighted
// Gerencia lazy loading de gramaticas
type UseShikiHighlighter = {
  highlight: (code: string, lang: string) => Promise<string>
  isLoading: boolean
}
```

### Linguagens suportadas (subset inicial para highlight.js)

Para manter o bundle leve, vamos registrar apenas as linguagens mais comuns no highlight.js core:

| Linguagem | ID hljs |
|-----------|---------|
| JavaScript | `javascript` |
| TypeScript | `typescript` |
| Python | `python` |
| Java | `java` |
| C | `c` |
| C++ | `cpp` |
| C# | `csharp` |
| Go | `go` |
| Rust | `rust` |
| Ruby | `ruby` |
| PHP | `php` |
| Swift | `swift` |
| Kotlin | `kotlin` |
| HTML | `xml` |
| CSS | `css` |
| SQL | `sql` |
| Shell/Bash | `bash` |
| JSON | `json` |
| YAML | `yaml` |
| Markdown | `markdown` |

> Total: ~20 linguagens. Bundle estimado do hljs com core + 20 langs: ~40-60 KB gzip.

### Tema

Reutilizar o tema `vesper` ja usado no `CodeBlock`. O Shiki client-side sera inicializado com este tema. Os estilos CSS existentes em `globals.css` (`[data-shiki] code`, `[data-shiki] pre`) serao aproveitados/adaptados para o contexto do overlay.

### Detalhes de implementacao do overlay

1. **CSS Grid**: Textarea e highlight div na mesma celula (`grid-area: 1 / 1`)
2. **Textarea**: `caret-color` visivel, `-webkit-text-fill-color: transparent`, `z-index: 2`
3. **Highlight div**: `pointer-events: none`, `z-index: 1`, `overflow: hidden`
4. **Font sync**: Ambos usam `font-mono` (JetBrains Mono), mesmo `font-size`, `line-height`, `padding`
5. **Scroll sync**: `onScroll` do textarea aplica `scrollTop`/`scrollLeft` no highlight div
6. **Debounce**: Re-highlight apos ~150ms de inatividade (nao a cada keystroke)

---

## Decisoes (respondidas)

1. **Line numbers**: Sim, o editor tera line numbers.
2. **Highlighting ao vivo**: Sim, highlighting enquanto o usuario digita (com debounce).
3. **Linguagens no dropdown**: As ~20 principais (mesmas do subset highlight.js).
4. **Auto-indentacao**: Sim, com Tab/Shift+Tab e Enter com auto-indent.

---

## TO-DOs de implementacao

### Fase 1 — Setup e dependencias
- [ ] Instalar `highlight.js` (`pnpm add highlight.js`)
- [ ] Criar `src/lib/hljs.ts` com instancia do highlight.js core + linguagens registradas
- [ ] Criar `src/lib/shiki.ts` com helper para instancia client-side do Shiki

### Fase 2 — Hooks
- [ ] Criar `src/hooks/use-language-detection.ts`
- [ ] Criar `src/hooks/use-shiki-highlighter.ts`
- [ ] Testar deteccao com snippets de diferentes linguagens
- [ ] Testar highlighting client-side com tema vesper

### Fase 3 — Componente do editor
- [ ] Refatorar `src/components/code-editor.tsx` para incluir overlay
- [ ] Implementar CSS Grid overlay (textarea + highlight div)
- [ ] Implementar line numbers sincronizados com o codigo
- [ ] Implementar scroll sync entre textarea e highlight div
- [ ] Adicionar debounce no re-highlight
- [ ] Implementar auto-indentacao (Tab, Shift+Tab, Enter com indent)
- [ ] Adicionar `LanguageSelector` no header com as ~20 linguagens suportadas
- [ ] Mostrar linguagem auto-detectada como default no selector
- [ ] Permitir override manual da linguagem

### Fase 4 — Integracao com a homepage
- [ ] Atualizar `src/app/page.tsx` para usar o editor com highlighting
- [ ] Testar fluxo completo: colar codigo -> detectar linguagem -> highlight -> submeter
- [ ] Verificar performance (debounce, lazy loading de gramaticas)
- [ ] Testar com codigos de diferentes linguagens

### Fase 5 — Polish
- [ ] Placeholder styling quando o editor esta vazio
- [ ] Loading state enquanto Shiki inicializa
- [ ] Fallback para textarea puro se Shiki falhar
- [ ] Testar responsividade
- [ ] Testar acessibilidade (screen reader ve o textarea, nao o overlay)
