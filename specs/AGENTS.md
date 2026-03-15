# Specs

Specs sao documentos de especificacao criados **antes** da implementacao de uma feature. Vivem em `specs/` com nome descritivo em kebab-case (ex: `code-editor-feature.md`).

## Quando criar

- Antes de implementar qualquer feature nao-trivial
- Quando ha decisoes de arquitetura, escolha de libs ou modelo de dados a documentar
- Quando a feature envolve pesquisa ou comparacao de alternativas

## Estrutura

```markdown
# Nome da Feature — Especificacao

## Contexto
Problema a resolver e por que esta feature existe.

## Pesquisa (se aplicavel)
Alternativas avaliadas com pros/cons e tabela comparativa.

## Recomendacao (se houve pesquisa)
Opcao escolhida e justificativa.

## Especificacao
Comportamento esperado, componentes, tipos, arquitetura e dados.

## TO-DOs de implementacao
Checklist por fases com items `- [ ]`.
```

## Regras

- Nem toda secao e obrigatoria. Use apenas as que fazem sentido para a feature.
- Mantenha linguagem direta e tecnica — sem floreios.
- Use tabelas para comparacoes e listas de campos/colunas.
- Inclua diagramas ASCII quando ajudar a visualizar (ER, arvore de componentes).
- Blocos de codigo devem ter a linguagem especificada (typescript, bash, yaml, etc.).
- TO-DOs devem ser organizados em fases sequenciais com checkboxes.
