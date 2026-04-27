# Objetivos Financeiros — Specification

## Problem Statement

O usuário não tem como registrar aportes direcionados a objetivos financeiros de longo prazo (ex: Reserva de Emergência, Quitação de Dívida, Compra de Carro). Atualmente, esses lançamentos são misturados com despesas comuns ou ignorados, impedindo o acompanhamento do progresso em direção a metas.

## Goals

- [ ] Permitir criar, editar e excluir Objetivos (nome, cor, valor-meta)
- [ ] Registrar lançamentos do tipo "Objetivo", vinculados a um objetivo específico
- [ ] Acompanhar o progresso acumulado de cada objetivo (P2)

## Decisões Autônomas (sem resposta do usuário)

| Decisão | Escolha | Justificativa |
|---|---|---|
| Lançamento Objetivo afeta saldo? | Sim, subtrai | Dinheiro alocado para objetivo sai da carteira geral |
| Objetivo tem valor-meta? | Sim | Necessário para calcular progresso e indicar quando está concluído |
| Objetivos padrão pré-criados? | Não | Objetivos são pessoais demais para ter padrões; usuário cria os seus |

## Out of Scope

| Feature | Reason |
|---|---|
| Aportes automáticos / recorrentes | Pós-v1 |
| Prazo (deadline) para o objetivo | Pós-v1 |
| Saques do objetivo de volta ao saldo | Pós-v1 |
| Múltiplas contas/carteiras | Pós-v1 |
| Notificações de progresso | Pós-v1 |

---

## User Stories

### P1: Gerenciar Objetivos ⭐ MVP

**User Story**: Como usuário, quero criar, editar e excluir objetivos financeiros com nome, cor e valor-meta, para organizar minhas metas pessoais.

**Why P1**: Objetivos precisam existir antes que qualquer lançamento do tipo Objetivo possa ser feito.

**Acceptance Criteria**:

1. WHEN usuário acessa tela de objetivos THEN sistema SHALL listar todos os objetivos cadastrados
2. WHEN usuário cria objetivo com nome, cor e valor-meta válidos THEN sistema SHALL persistir e exibir na lista
3. WHEN nome do objetivo está vazio THEN sistema SHALL exibir erro de validação
4. WHEN valor-meta for zero ou negativo THEN sistema SHALL exibir erro de validação
5. WHEN nome duplicado é inserido THEN sistema SHALL exibir erro de duplicidade
6. WHEN usuário edita um objetivo THEN sistema SHALL atualizar nome/cor/meta e refletir nos lançamentos vinculados
7. WHEN usuário exclui objetivo com lançamentos vinculados THEN sistema SHALL alertar com contagem e pedir confirmação
8. WHEN usuário exclui objetivo THEN sistema SHALL apenas remover o vínculo nos lançamentos (categoryId → null), não excluir os lançamentos

**Independent Test**: Criar objetivo "Carro" com meta R$30.000 → verificar que aparece na lista com cor e meta → editar nome → confirmar atualização.

---

### P1: Lançar Aporte em Objetivo ⭐ MVP

**User Story**: Como usuário, quero registrar um lançamento do tipo "Objetivo" para registrar dinheiro que estou alocando para uma meta específica.

**Why P1**: Sem lançamentos, a feature de objetivos não tem utilidade.

**Acceptance Criteria**:

1. WHEN usuário seleciona tipo "Objetivo" no formulário de lançamento THEN sistema SHALL exibir dropdown de Objetivos no lugar do dropdown de Categorias
2. WHEN usuário salva lançamento do tipo Objetivo THEN sistema SHALL subtrair valor do saldo geral
3. WHEN usuário salva lançamento do tipo Objetivo THEN sistema SHALL associar o lançamento ao objetivo selecionado via `objectiveId`
4. WHEN nenhum objetivo está cadastrado e usuário seleciona tipo Objetivo THEN sistema SHALL exibir mensagem orientando a criar um objetivo
5. WHEN lançamento do tipo Objetivo aparece na lista de transações THEN sistema SHALL exibir chip "Objetivo" e nome do objetivo na coluna de categoria

**Independent Test**: Criar objetivo "Emergência" → fazer lançamento tipo Objetivo de R$500 → verificar saldo diminuiu R$500 → verificar que na lista aparece o nome do objetivo.

---

### P2: Acompanhar Progresso dos Objetivos

**User Story**: Como usuário, quero ver no dashboard o progresso de cada objetivo (valor acumulado vs meta), para saber o quanto já alcancei de cada meta.

**Why P2**: Muito útil, mas o app funciona sem isso — progresso é adorno. MVP é registrar o dado.

**Acceptance Criteria**:

1. WHEN dashboard é aberto THEN sistema SHALL exibir seção "Meus Objetivos" listando todos os objetivos ativos
2. WHEN objetivo tem lançamentos THEN sistema SHALL calcular total acumulado somando todos os lançamentos do tipo Objetivo vinculados a ele
3. WHEN objetivo é exibido THEN sistema SHALL mostrar: nome, valor acumulado, valor-meta, percentual e barra de progresso
4. WHEN nenhum objetivo está cadastrado THEN sistema SHALL exibir estado vazio com link para criar objetivos
5. WHEN objetivo atinge ou supera a meta THEN sistema SHALL exibir indicador de "Concluído" na barra de progresso

**Independent Test**: Criar objetivo com meta R$1.000, fazer 2 aportes de R$400 → dashboard mostra 80% de progresso.

---

## Edge Cases

- WHEN usuário tenta excluir último objetivo e há lançamentos vinculados THEN sistema SHALL permitir (sem restrição de mínimo de objetivos)
- WHEN nome do objetivo tem mais de 50 caracteres THEN sistema SHALL bloquear com mensagem de limite
- WHEN valor-meta tem mais de 2 casas decimais THEN sistema SHALL arredondar para 2 decimais
- WHEN objetivo é excluído THEN lançamentos anteriores vinculados ficam com `objectiveId: null` (sem categoria exibida)
- WHEN dashboard soma progresso THEN sistema SHALL ignorar lançamentos cujo objetivo foi excluído (objectiveId não encontrado)

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---|---|---|---|
| OBJ-01 | P1: Listar objetivos | Execute | Pending |
| OBJ-02 | P1: Criar objetivo | Execute | Pending |
| OBJ-03 | P1: Editar objetivo | Execute | Pending |
| OBJ-04 | P1: Excluir objetivo | Execute | Pending |
| OBJ-05 | P1: Validações | Execute | Pending |
| OBJ-06 | P1: Tipo Objetivo no modelo | Execute | Pending |
| OBJ-07 | P1: Formulário mostra dropdown de objetivos | Execute | Pending |
| OBJ-08 | P1: Lançamento subtrai saldo | Execute | Pending |
| OBJ-09 | P1: Lista de transações exibe objetivo | Execute | Pending |
| OBJ-10 | P1: Estado vazio no formulário (sem objetivos) | Execute | Pending |
| OBJ-11 | P2: Seção de progresso no dashboard | Execute | Pending |
| OBJ-12 | P2: Cálculo de progresso por objetivo | Execute | Pending |
| OBJ-13 | P2: Indicador "Concluído" | Execute | Pending |

---

## Success Criteria

- [ ] Usuário consegue criar um objetivo e fazer um aporte em menos de 30 segundos
- [ ] Saldo reflete corretamente a subtração do aporte
- [ ] Progresso no dashboard mostra percentual correto após aportes
