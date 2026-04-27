# Categories Feature Specification

## Problem Statement

Para classificar e analisar gastos por área da vida (alimentação, transporte, lazer etc.), o usuário precisa gerenciar suas próprias categorias personalizadas em vez de depender de listas fixas.

## Goals

- [ ] Permitir criação, edição e exclusão de categorias personalizadas
- [ ] Fornecer categorias padrão pré-carregadas para uso imediato

## Out of Scope

| Feature | Reason |
|---------|--------|
| Subcategorias | Complexidade desnecessária para v1 |
| Ícones personalizados | Pós-v1 |
| Limites de gastos por categoria | Pós-v1 |

---

## User Stories

### P1: Gerenciar categorias ⭐ MVP

**User Story**: Como usuário, quero criar, editar e excluir categorias para organizar meus lançamentos da forma que faz sentido para mim.

**Why P1**: Categorias são necessárias para o formulário de transações e para o dashboard.

**Acceptance Criteria**:

1. WHEN usuário acessa gerenciador THEN sistema SHALL listar todas as categorias existentes
2. WHEN usuário cria nova categoria com nome válido THEN sistema SHALL persistir e exibir na lista
3. WHEN nome da categoria está vazio THEN sistema SHALL exibir erro de validação
4. WHEN nome duplicado é inserido THEN sistema SHALL exibir erro de duplicidade
5. WHEN usuário edita uma categoria THEN sistema SHALL atualizar em todas as transações existentes
6. WHEN usuário exclui uma categoria com transações vinculadas THEN sistema SHALL alertar e pedir confirmação
7. WHEN app é inicializado pela primeira vez THEN sistema SHALL carregar categorias padrão

**Categorias padrão:** Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, Vestuário, Outros

**Independent Test**: Abrir gerenciador → criar categoria "Pets" → verificar que aparece no formulário de transações.

---

## Edge Cases

- WHEN usuário tenta excluir última categoria restante THEN sistema SHALL impedir (mínimo 1 categoria)
- WHEN nome tem mais de 50 caracteres THEN sistema SHALL bloquear com mensagem de limite

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| CAT-01 | P1: Listar categorias | Execute | Pending |
| CAT-02 | P1: Criar categoria | Execute | Pending |
| CAT-03 | P1: Editar categoria | Execute | Pending |
| CAT-04 | P1: Excluir categoria | Execute | Pending |
| CAT-05 | P1: Categorias padrão | Execute | Pending |
| CAT-06 | P1: Validações | Execute | Pending |

---

## Success Criteria

- [ ] Categorias padrão disponíveis no primeiro uso sem ação do usuário
- [ ] Nova categoria aparece imediatamente no formulário de transações
