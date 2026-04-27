# Dashboard Feature Specification

## Problem Statement

O usuário precisa de uma visão consolidada da sua situação financeira sem precisar fazer cálculos manuais. Um dashboard com saldo atual e gráficos permite identificar rapidamente padrões de gastos e a saúde financeira do mês.

## Goals

- [ ] Exibir saldo atual calculado a partir de todas as transações
- [ ] Mostrar evolução de receitas vs despesas por mês em gráfico de barras
- [ ] Mostrar distribuição de gastos por categoria em gráfico de rosca

## Out of Scope

| Feature | Reason |
|---------|--------|
| Filtro de período no dashboard | Pós-v1 |
| Projeção futura | Pós-v1 |
| Exportação de gráficos | Pós-v1 |
| Indicadores de metas | Pós-v1 |

---

## User Stories

### P1: Visualizar saldo atual ⭐ MVP

**User Story**: Como usuário, quero ver meu saldo atual calculado automaticamente para saber minha situação financeira de relance.

**Acceptance Criteria**:

1. WHEN dashboard é carregado THEN sistema SHALL calcular e exibir saldo = soma(receitas) - soma(despesas)
2. WHEN saldo é negativo THEN sistema SHALL exibir em vermelho
3. WHEN saldo é positivo THEN sistema SHALL exibir em verde
4. WHEN não há transações THEN sistema SHALL exibir saldo R$ 0,00

**Independent Test**: Lançar R$1000 receita e R$300 despesa → dashboard deve mostrar R$700 em verde.

---

### P1: Gráfico receitas vs despesas por mês ⭐ MVP

**User Story**: Como usuário, quero ver um gráfico de barras com receitas e despesas dos últimos 6 meses para acompanhar tendências.

**Acceptance Criteria**:

1. WHEN dashboard é carregado THEN sistema SHALL renderizar gráfico de barras com os últimos 6 meses
2. WHEN há dados para o mês THEN sistema SHALL exibir barras separadas para receita (verde) e despesa (vermelho)
3. WHEN mês não tem transações THEN sistema SHALL exibir barras zeradas
4. WHEN usuário passa mouse sobre barra THEN sistema SHALL exibir tooltip com valor formatado

**Independent Test**: Lançar transações em 2 meses diferentes → verificar que ambos aparecem no gráfico.

---

### P1: Gráfico de gastos por categoria ⭐ MVP

**User Story**: Como usuário, quero ver um gráfico de rosca com a distribuição das minhas despesas por categoria no mês atual para entender onde estou gastando mais.

**Acceptance Criteria**:

1. WHEN dashboard é carregado THEN sistema SHALL renderizar gráfico de rosca com despesas do mês atual por categoria
2. WHEN categoria tem despesas THEN sistema SHALL exibir fatia proporcional com cor distinta
3. WHEN não há despesas no mês THEN sistema SHALL exibir mensagem "Sem despesas neste mês"
4. WHEN usuário passa mouse sobre fatia THEN sistema SHALL exibir tooltip com categoria, valor e percentual

**Independent Test**: Lançar despesas em 3 categorias diferentes no mês atual → verificar gráfico de rosca.

---

### P2: Cards de resumo

**User Story**: Como usuário, quero ver cards com total de receitas e total de despesas do mês atual para comparação rápida.

**Acceptance Criteria**:

1. WHEN dashboard é carregado THEN sistema SHALL exibir card "Receitas do mês" e card "Despesas do mês"
2. WHEN valores mudam (nova transação) THEN sistema SHALL atualizar automaticamente

---

## Edge Cases

- WHEN há apenas transferências (sem receitas/despesas) THEN gráficos SHALL exibir valores zerados
- WHEN número de categorias é muito grande THEN gráfico de rosca SHALL agrupar menores em "Outros"

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| DASH-01 | P1: Saldo atual | Execute | Pending |
| DASH-02 | P1: Cor por saldo positivo/negativo | Execute | Pending |
| DASH-03 | P1: Gráfico barras 6 meses | Execute | Pending |
| DASH-04 | P1: Gráfico rosca por categoria | Execute | Pending |
| DASH-05 | P2: Cards receitas/despesas do mês | Execute | Pending |

---

## Success Criteria

- [ ] Dashboard carrega em menos de 1 segundo
- [ ] Gráficos refletem dados reais do LocalStorage
- [ ] Saldo atualiza ao adicionar/remover transações
