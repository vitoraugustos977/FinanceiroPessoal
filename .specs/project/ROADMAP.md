# Roadmap — Financeiro Pessoal

## v1 — MVP (em desenvolvimento)

### Milestone 1: Fundação
- [ ] Scaffold Angular + Angular Material + Chart.js
- [ ] Modelos de dados (Transaction, Category)
- [ ] Serviço de persistência (LocalStorage)
- [ ] Roteamento principal (Dashboard / Transações / Categorias)

### Milestone 2: Transações
- [ ] Formulário de lançamento (receita, despesa, transferência)
- [ ] Lista de transações com filtros

### Milestone 3: Categorias
- [ ] CRUD de categorias (criar, editar, excluir)
- [ ] Categorias padrão pré-carregadas

### Milestone 4: Dashboard
- [ ] Card de saldo atual
- [ ] Gráfico de barras: receitas vs despesas por mês
- [ ] Gráfico de rosca: gastos por categoria

### Milestone 5: Objetivos Financeiros
- [ ] Modelo `Objective` + campo `objectiveId` em `Transaction`
- [ ] `ObjectiveService` com CRUD e persistência
- [ ] Tela de gerenciamento de objetivos (nome, cor, meta)
- [ ] Tipo de lançamento "Objetivo" no formulário
- [ ] Lista de transações exibe objetivo vinculado
- [ ] Dashboard: seção de progresso dos objetivos (P2)

## v2 — Melhorias futuras (backlog)

- Filtros avançados na lista (por categoria, por valor)
- Edição de transações já lançadas
- Metas de gastos por categoria
- Exportação de dados (CSV)
- Suporte a múltiplas contas/carteiras
