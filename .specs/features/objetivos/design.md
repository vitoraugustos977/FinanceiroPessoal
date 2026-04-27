# Objetivos Financeiros — Design

**Spec**: `.specs/features/objetivos/spec.md`
**Status**: Draft

---

## Architecture Overview

Segue exatamente o mesmo padrão de Categorias já implementado: Model → Service (LocalStorage) → Feature components. O `TransactionType` ganha `'objetivo'`, o formulário de lançamento usa lógica condicional para exibir o dropdown correto (Categorias ou Objetivos), e o dashboard ganha uma nova seção de progresso.

```
ObjectiveModel
     │
ObjectiveService (LocalStorage)
     │
     ├── ObjectiveListComponent   (CRUD — espelho de CategoryListComponent)
     │
     ├── TransactionFormComponent (modificado — dropdown condicional)
     │
     ├── TransactionListComponent (modificado — exibe nome do objetivo)
     │
     └── DashboardComponent       (modificado — seção de progresso P2)
```

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
|---|---|---|
| `CategoryListComponent` | `src/app/features/categories/category-list/` | Template base para `ObjectiveListComponent` — mesma estrutura de lista + inline edit + add form |
| `CategoryService` | `src/app/core/services/category.service.ts` | Padrão idêntico: signal, CRUD, LocalStorage |
| `Category` model | `src/app/core/models/category.model.ts` | Estender com campo `targetValue: number` |
| `ConfirmDialogComponent` | `src/app/shared/components/confirm-dialog/` | Reutilizar para confirmar exclusão de objetivo |
| `TransactionService.getFiltered()` | `transaction.service.ts` | Usar para calcular progresso por objetivo |

### Integration Points

| System | Integration Method |
|---|---|
| `TransactionType` | Adicionar `'objetivo'` ao union type |
| `Transaction` model | Adicionar campo `objectiveId: string \| null` (paralelo ao `categoryId`) |
| `TransactionService.balance` | Objetivo já subtrai — o `computed` soma receitas, subtrai despesas **e objetivos** |
| `TransactionFormComponent` | Exibir `<mat-select>` de objetivos quando `type === 'objetivo'` |
| `TransactionListComponent` | Coluna "Categoria" exibe nome do objetivo quando tipo é `'objetivo'` |
| `DashboardComponent` | Nova seção com cards/barras de progresso dos objetivos |
| `app.routes.ts` | Nova rota `/objectives` lazy-loaded |
| `app.html` (sidenav) | Novo item de navegação "Objetivos" |

---

## Components

### `Objective` model

- **Purpose**: Define a entidade Objetivo com nome, cor e valor-meta
- **Location**: `src/app/core/models/objective.model.ts`
- **Reuses**: Padrão de `Category` model

### `ObjectiveService`

- **Purpose**: CRUD de objetivos persistidos em LocalStorage
- **Location**: `src/app/core/services/objective.service.ts`
- **Interfaces**:
  - `objectives: Signal<Objective[]>`
  - `add(name, color, targetValue): void`
  - `update(id, name, color, targetValue): void`
  - `remove(id): void`
  - `getById(id): Objective | undefined`
  - `nameExists(name, excludeId?): boolean`
- **Reuses**: Padrão idêntico ao `CategoryService`

### `ObjectiveListComponent`

- **Purpose**: Tela de CRUD de objetivos (lista + inline edit + formulário de adição)
- **Location**: `src/app/features/objectives/objective-list/objective-list.component.{ts,html,scss}`
- **Reuses**: Estrutura de `CategoryListComponent` — mesma lógica, acrescenta campo "Meta (R$)"
- **Dependencies**: `ObjectiveService`, `TransactionService`, `ConfirmDialogComponent`, Angular Material

### `TransactionFormComponent` (modificado)

- **Purpose**: Exibir dropdown de objetivos quando `type === 'objetivo'`; limpar `categoryId` quando tipo muda
- **Location**: `src/app/features/transactions/transaction-form/transaction-form.component.ts`
- **Changes**:
  - Adicionar `objectiveId` ao form group
  - `isObjetivo` computed getter
  - Condicional no template: se `isObjetivo` → mostra `<mat-select>` de objetivos + mensagem se vazio
  - No `submit()`: preencher `objectiveId` quando `isObjetivo`, caso contrário `null`

### `TransactionListComponent` (modificado)

- **Purpose**: Exibir nome do objetivo na coluna "Categoria" para lançamentos do tipo objetivo
- **Location**: `src/app/features/transactions/transaction-list/transaction-list.component.ts`
- **Changes**:
  - Injetar `ObjectiveService`
  - `getCategoryOrObjectiveName(t)` — helper que decide qual serviço consultar
  - Atualizar `typeLabel` map para incluir `'objetivo'`
  - Atualizar chip de tipo no SCSS/styles

### `DashboardComponent` (modificado — P2)

- **Purpose**: Exibir seção "Meus Objetivos" com progresso de cada objetivo
- **Location**: `src/app/features/dashboard/dashboard.component.ts`
- **Changes**:
  - Injetar `ObjectiveService` e `TransactionService`
  - `objectivesProgress` computed: para cada objetivo, somar lançamentos do tipo `'objetivo'` com `objectiveId` correspondente
  - Template: nova seção com cards de progresso (barra Material ou CSS)

---

## Data Models

### `Objective`

```typescript
export interface Objective {
  id: string;
  name: string;
  color: string;
  targetValue: number;
}
```

**Relationships**: `Transaction.objectiveId` → `Objective.id`

### `Transaction` (modificado)

```typescript
export interface Transaction {
  id: string;
  type: TransactionType;        // 'receita' | 'despesa' | 'objetivo'
  value: number;
  date: string;
  categoryId: string | null;    // preenchido quando type ∈ {receita, despesa}
  objectiveId: string | null;   // preenchido quando type === 'objetivo'
  description: string;
  createdAt: string;
}
```

### `TransactionType` (modificado)

```typescript
export type TransactionType = 'receita' | 'despesa' | 'objetivo';
```

### `ObjectiveProgress` (tipo auxiliar no dashboard)

```typescript
interface ObjectiveProgress {
  objective: Objective;
  accumulated: number;
  percentage: number;
  isComplete: boolean;
}
```

---

## Balance Calculation

`TransactionService.balance` atual:
- `receita` → soma
- `despesa` → subtrai
- Qualquer outro tipo → ignorado

Após a mudança, `'objetivo'` subtrai do saldo — o `computed` no service já lida com isso via:

```typescript
if (t.type === 'receita') return sum + t.value;
if (t.type === 'despesa' || t.type === 'objetivo') return sum - t.value;
```

---

## Error Handling Strategy

| Error Scenario | Handling | User Impact |
|---|---|---|
| Criar objetivo sem nome | Validação inline | Mensagem "Nome obrigatório" |
| Meta ≤ 0 | Validação inline | Mensagem "Meta deve ser maior que zero" |
| Nome duplicado | Verificação no service | Mensagem "Objetivo já existe" |
| Excluir objetivo vinculado | Diálogo de confirmação com contagem | Usuário confirma ciente |
| Selecionar tipo Objetivo sem objetivos cadastrados | Info inline no formulário | Mensagem + link para criar objetivo |

---

## Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Campo separado `objectiveId` vs reusar `categoryId` | Campo separado | Semântica limpa; evita conflito entre categorias e objetivos; facilita queries |
| Progresso calculado on-the-fly vs armazenado | On-the-fly (computed) | Consistente com padrão do app; LocalStorage é pequeno |
| Barra de progresso | CSS nativo (`<progress>` + estilo) ou `mat-progress-bar` | Usar `MatProgressBarModule` — já no projeto via Angular Material |
