# Financeiro Pessoal

**Vision:** Aplicação web para controle de finanças pessoais, permitindo registrar receitas, despesas e transferências, visualizar histórico e analisar gastos por meio de gráficos.

**For:** Uso pessoal — uma única pessoa gerenciando suas próprias finanças.

**Solves:** Falta de visibilidade sobre para onde o dinheiro vai e dificuldade de acompanhar saldo e padrões de gastos ao longo do tempo.

## Goals

- Registrar todos os lançamentos financeiros de forma rápida e sem fricção
- Visualizar saldo atual, receitas vs despesas por mês e gastos por categoria via dashboard
- Manter dados persistentes entre sessões do browser (LocalStorage)

## Tech Stack

**Core:**

- Framework: Angular 17+ (standalone components)
- Language: TypeScript
- Storage: LocalStorage (sem backend)

**Key dependencies:**

- Angular Material — componentes de UI
- Chart.js + ng2-charts — gráficos do dashboard
- Angular Router — navegação entre módulos

## Scope

**v1 includes:**

- Lançamento de transações (Receita, Despesa, Transferência) com valor, data, categoria, descrição
- Lista de transações com filtro por período e tipo
- Gerenciamento de categorias (CRUD)
- Dashboard com: saldo atual, gráfico receitas vs despesas por mês (barra), gastos por categoria (rosca)

**Explicitly out of scope:**

- Autenticação / multi-usuário
- Backend / API / sincronização na nuvem
- Importação de extratos bancários
- Metas financeiras / orçamentos
- Notificações / alertas
- Relatórios exportáveis (PDF/Excel)

## Constraints

- Technical: Dados somente no browser — sem persistência entre dispositivos
- Resources: Projeto pessoal solo
