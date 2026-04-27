# Objetivos Financeiros — Tasks

**Design**: `.specs/features/objetivos/design.md`
**Status**: Done

---

## Execution Plan

```
Phase 1 — Foundation (Sequential):
  T1 → T2 → T3

Phase 2 — Core Implementation (Parallel OK):
  T3 complete, então:
    ├── T4 [P]
    ├── T5 [P]
    └── T6 [P]

Phase 3 — Integration (Sequential):
  T4 + T5 + T6 complete, então:
    T7 → T8 → T9
```

---

## Task Breakdown

### T1: Criar modelo `Objective` e atualizar `Transaction`

**What**: Criar `src/app/core/models/objective.model.ts` com interface `Objective`; atualizar `transaction.model.ts` adicionando `'objetivo'` ao `TransactionType` e campo `objectiveId: string | null` à interface `Transaction`
**Where**:
  - `src/app/core/models/objective.model.ts` (novo)
  - `src/app/core/models/transaction.model.ts` (modificar)
**Depends on**: Nenhum
**Reuses**: Padrão de `category.model.ts`
**Requirement**: OBJ-06

**Done when**:
- [ ] Interface `Objective { id, name, color, targetValue }` exportada
- [ ] `TransactionType = 'receita' | 'despesa' | 'objetivo'`
- [ ] `Transaction` tem campo `objectiveId: string | null`
- [ ] Build passa sem erros de TypeScript: `npx ng build --configuration development`

**Gate**: build

---

### T2: Criar `ObjectiveService`

**What**: Criar serviço com CRUD de objetivos persistidos em LocalStorage, seguindo padrão de `CategoryService`
**Where**: `src/app/core/services/objective.service.ts` (novo)
**Depends on**: T1
**Reuses**: Padrão idêntico ao `src/app/core/services/category.service.ts`
**Requirement**: OBJ-01, OBJ-02, OBJ-03, OBJ-04, OBJ-05

**Done when**:
- [ ] `ObjectiveService` com `@Injectable({ providedIn: 'root' })`
- [ ] Signal `objectives: Signal<Objective[]>`
- [ ] Métodos: `add(name, color, targetValue)`, `update(id, name, color, targetValue)`, `remove(id)`, `getById(id)`, `nameExists(name, excludeId?)`
- [ ] Persistência via `StorageService` com chave `'fp_objectives'`
- [ ] Sem objetivos padrão (lista começa vazia)
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

### T3: Atualizar `TransactionService.balance` para subtrair objetivos

**What**: Modificar o `computed` `balance` em `TransactionService` para subtrair lançamentos do tipo `'objetivo'`
**Where**: `src/app/core/services/transaction.service.ts` (modificar)
**Depends on**: T1
**Reuses**: Lógica existente do `balance` computed
**Requirement**: OBJ-08

**Done when**:
- [ ] `balance` computed subtrai quando `t.type === 'objetivo'`
- [ ] Lógica: `if (t.type === 'receita') sum + t.value; else sum - t.value` (cobre despesa + objetivo)
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

### T4: Criar `ObjectiveListComponent` [P]

**What**: Criar tela de CRUD de objetivos com lista, inline edit e formulário de adição — espelho de `CategoryListComponent` com campo extra "Meta (R$)"
**Where**: `src/app/features/objectives/objective-list/` (novo — 3 arquivos: `.ts`, `.html`, `.scss`)
**Depends on**: T2
**Reuses**: Estrutura completa de `category-list.component.{ts,html,scss}` como base
**Requirement**: OBJ-01, OBJ-02, OBJ-03, OBJ-04, OBJ-05

**Done when**:
- [ ] Lista todos os objetivos com nome, cor (dot), meta formatada em BRL
- [ ] Formulário de adição: campos nome, cor (color picker), meta (number)
- [ ] Inline edit: campos nome, cor, meta
- [ ] Validações: nome obrigatório, max 50 chars, nome duplicado, meta > 0
- [ ] Exclusão com diálogo de confirmação (contagem de lançamentos vinculados)
- [ ] Estado vazio quando lista está vazia
- [ ] Snackbar feedback nas ações
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

### T5: Atualizar `TransactionFormComponent` para suportar tipo Objetivo [P]

**What**: Adicionar `objectiveId` ao form group, getter `isObjetivo`, exibição condicional de dropdown de objetivos no lugar de categorias quando tipo = 'objetivo', e opção "Objetivo" no select de tipo
**Where**: `src/app/features/transactions/transaction-form/transaction-form.component.{ts,html,scss}` (modificar)
**Depends on**: T2
**Reuses**: Padrão existente de `isTransferencia` (removido) — mesmo approach condicional
**Requirement**: OBJ-07, OBJ-10

**Done when**:
- [ ] Select de tipo inclui opção "Objetivo" (ícone: `flag`)
- [ ] Getter `isObjetivo` no componente
- [ ] Quando `isObjetivo`: exibe `<mat-select>` de objetivos (via `ObjectiveService.objectives()`)
- [ ] Quando `isObjetivo` e lista vazia: exibe info com link para `/objectives`
- [ ] Quando não `isObjetivo`: exibe `<mat-select>` de categorias (comportamento atual)
- [ ] No `submit()`: `objectiveId` preenchido se `isObjetivo`, senão `null`; `categoryId` preenchido se não `isObjetivo`, senão `null`
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

### T6: Atualizar `TransactionListComponent` para exibir objetivos [P]

**What**: Injetar `ObjectiveService`, atualizar coluna "Categoria" e chip de tipo para lançamentos do tipo `'objetivo'`
**Where**: `src/app/features/transactions/transaction-list/transaction-list.component.{ts,html,scss}` (modificar); `src/styles.scss` (modificar)
**Depends on**: T2
**Reuses**: Métodos existentes `getCategoryName`, `getCategoryColor`, `typeLabel`
**Requirement**: OBJ-09

**Done when**:
- [ ] `typeLabel` inclui `'objetivo': 'Objetivo'`
- [ ] Coluna "Categoria/Objetivo" exibe nome do objetivo quando `t.type === 'objetivo'` (via `ObjectiveService.getById(t.objectiveId)`)
- [ ] Coluna exibe cor do objetivo (dot colorido) quando tipo objetivo
- [ ] Filtro de tipo na lista inclui opção "Objetivo"
- [ ] `styles.scss` tem `.chip-objetivo { background: #e8eaf6; color: #3949ab; }`
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

### T7: Adicionar rota `/objectives` e item no sidenav

**What**: Registrar rota lazy-loaded para `ObjectiveListComponent` em `app.routes.ts` e adicionar item de navegação em `app.html`
**Where**:
  - `src/app/app.routes.ts` (modificar)
  - `src/app/app.html` (modificar)
**Depends on**: T4
**Requirement**: OBJ-01

**Done when**:
- [ ] Rota `{ path: 'objectives', loadComponent: ... }` registrada
- [ ] Item `routerLink="/objectives"` com ícone `flag` e label "Objetivos" no sidenav
- [ ] Navegação funciona: clicar no link abre a tela de objetivos
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

### T8: Adicionar migração de lançamentos antigos sem `objectiveId`

**What**: No construtor do `TransactionService`, garantir que lançamentos existentes sem campo `objectiveId` recebam `objectiveId: null` (retrocompatibilidade com dados salvos antes desta feature)
**Where**: `src/app/core/services/transaction.service.ts` (modificar)
**Depends on**: T3
**Requirement**: OBJ-06

**Done when**:
- [ ] Lançamentos carregados do LocalStorage que não possuem `objectiveId` recebem `objectiveId: null`
- [ ] Migração é idempotente (executar duas vezes não muda o resultado)
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

### T9: Adicionar seção de progresso de objetivos no Dashboard (P2)

**What**: Injetar `ObjectiveService` no `DashboardComponent`, computar progresso por objetivo e exibir seção "Meus Objetivos" com cards de progresso (`mat-progress-bar`)
**Where**: `src/app/features/dashboard/dashboard.component.{ts,html,scss}` (modificar)
**Depends on**: T2, T3, T7
**Reuses**: Padrão de `computed()` já usado para `barChartData`, `doughnutChartData`
**Requirement**: OBJ-11, OBJ-12, OBJ-13

**Done when**:
- [ ] `objectivesProgress` computed retorna `{ objective, accumulated, percentage, isComplete }[]`
- [ ] Seção "Meus Objetivos" aparece no dashboard após os gráficos
- [ ] Cada objetivo: nome, barra de progresso (`mat-progress-bar`), valor acumulado / meta em BRL, percentual
- [ ] Quando `percentage >= 100`: exibe chip/badge "Concluído" com ícone `check_circle`
- [ ] Quando nenhum objetivo cadastrado: estado vazio com link para `/objectives`
- [ ] Build passa: `npx ng build --configuration development`

**Gate**: build

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 ──→ T2 ──→ T3

Phase 2 (Parallel — após T2 e T3 completos):
  ├── T4 [P]  (depende de T2)
  ├── T5 [P]  (depende de T2)
  └── T6 [P]  (depende de T2)
  
  T3 pode iniciar após T1 em paralelo com T2.
  T4, T5, T6 aguardam T2 (e T3 está implicitamente pronto antes dessa fase).

Phase 3 (Sequential):
  (T4 + T5 + T6 completos) ──→ T7 ──→ T8 ──→ T9
```

---

## Granularity Check

| Task | Scope | Status |
|---|---|---|
| T1: Criar modelo Objective + atualizar Transaction | 2 arquivos relacionados (model + model) | ✅ Coeso |
| T2: Criar ObjectiveService | 1 arquivo (service) | ✅ Granular |
| T3: Atualizar balance no TransactionService | 1 função em 1 arquivo | ✅ Granular |
| T4: Criar ObjectiveListComponent | 1 componente (3 arquivos do mesmo componente) | ✅ Granular |
| T5: Atualizar TransactionFormComponent | 1 componente modificado | ✅ Granular |
| T6: Atualizar TransactionListComponent + chip style | 1 componente + 1 style global | ✅ Coeso |
| T7: Rota + sidenav | 2 arquivos de configuração relacionados | ✅ Coeso |
| T8: Migração de dados no TransactionService | 1 função em 1 arquivo | ✅ Granular |
| T9: Dashboard progresso objetivos | 1 componente modificado | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
|---|---|---|---|
| T1 | Nenhum | Início da fase 1 | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T1 | T1 → T3 (paralelo a T2) | ✅ Match |
| T4 | T2 | T2 → T4 [P] | ✅ Match |
| T5 | T2 | T2 → T5 [P] | ✅ Match |
| T6 | T2 | T2 → T6 [P] | ✅ Match |
| T7 | T4 | T4 → T7 | ✅ Match |
| T8 | T3 | T3 → T8 (via fase 3) | ✅ Match |
| T9 | T2, T3, T7 | T7 → T9, T2+T3 já completos | ✅ Match |

---

## Requirement Traceability

| Req ID | Task | Status |
|---|---|---|
| OBJ-01 | T2, T4, T7 | Pending |
| OBJ-02 | T2, T4 | Pending |
| OBJ-03 | T2, T4 | Pending |
| OBJ-04 | T2, T4 | Pending |
| OBJ-05 | T2, T4 | Pending |
| OBJ-06 | T1, T8 | Pending |
| OBJ-07 | T5 | Pending |
| OBJ-08 | T3 | Pending |
| OBJ-09 | T6 | Pending |
| OBJ-10 | T5 | Pending |
| OBJ-11 | T9 | Pending |
| OBJ-12 | T9 | Pending |
| OBJ-13 | T9 | Pending |

**Coverage**: 13 requisitos, todos mapeados ✅
