# Transactions Feature Specification

## Problem Statement

O usuário precisa registrar entradas e saídas de dinheiro (receitas, despesas e transferências) com informações suficientes para análise posterior. Sem esse registro, não é possível saber o saldo atual nem analisar padrões de gastos.

## Goals

- [ ] Permitir lançamento rápido de transações com campos essenciais
- [ ] Listar todas as transações com possibilidade de filtrar por período e tipo

## Out of Scope

| Feature | Reason |
|---------|--------|
| Edição de transações existentes | Pós-v1 |
| Importação via arquivo (OFX/CSV) | Pós-v1 |
| Transações recorrentes | Pós-v1 |
| Anexo de comprovantes | Pós-v1 |

---

## User Stories

### P1: Lançar transação ⭐ MVP

**User Story**: Como usuário, quero lançar uma transação (receita, despesa ou transferência) para manter meu registro financeiro atualizado.

**Why P1**: Sem isso, nada mais funciona.

**Acceptance Criteria**:

1. WHEN usuário preenche tipo, valor, data, categoria e salva THEN sistema SHALL persistir a transação no LocalStorage
2. WHEN valor é zero ou negativo THEN sistema SHALL exibir erro de validação
3. WHEN data não é preenchida THEN sistema SHALL usar a data atual como padrão
4. WHEN formulário é submetido com sucesso THEN sistema SHALL limpar o formulário e exibir mensagem de sucesso
5. WHEN tipo é "Transferência" THEN sistema SHALL não exigir categoria

**Independent Test**: Abrir formulário → preencher campos → salvar → verificar que aparece na lista.

---

### P1: Listar transações ⭐ MVP

**User Story**: Como usuário, quero ver todas as transações lançadas em uma lista ordenada por data para consultar meu histórico.

**Why P1**: Essencial para visualização e controle.

**Acceptance Criteria**:

1. WHEN página de lista é carregada THEN sistema SHALL exibir todas as transações ordenadas por data (mais recente primeiro)
2. WHEN usuário filtra por tipo (Receita/Despesa/Transferência) THEN sistema SHALL exibir somente transações do tipo selecionado
3. WHEN usuário filtra por período (mês/ano) THEN sistema SHALL exibir somente transações do período
4. WHEN não há transações THEN sistema SHALL exibir mensagem "Nenhuma transação encontrada"
5. WHEN usuário clica em excluir uma transação THEN sistema SHALL remover do LocalStorage após confirmação

**Independent Test**: Lançar 3 transações de tipos diferentes → verificar lista → aplicar filtro de tipo → verificar resultado.

---

### P2: Excluir transação

**User Story**: Como usuário, quero excluir uma transação lançada por engano para manter meu histórico correto.

**Why P2**: Importante mas não bloqueia o MVP.

**Acceptance Criteria**:

1. WHEN usuário clica em excluir THEN sistema SHALL exibir confirmação antes de remover
2. WHEN confirmado THEN sistema SHALL remover a transação e atualizar a lista imediatamente

**Independent Test**: Criar transação → excluir → confirmar → verificar que sumiu da lista.

---

## Edge Cases

- WHEN LocalStorage está cheio THEN sistema SHALL exibir erro amigável
- WHEN valor tem mais de 2 casas decimais THEN sistema SHALL arredondar para 2 casas
- WHEN descrição não é preenchida THEN sistema SHALL aceitar como opcional

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| TRX-01 | P1: Lançar transação | Execute | Pending |
| TRX-02 | P1: Validação de formulário | Execute | Pending |
| TRX-03 | P1: Listar transações | Execute | Pending |
| TRX-04 | P1: Filtro por tipo | Execute | Pending |
| TRX-05 | P1: Filtro por período | Execute | Pending |
| TRX-06 | P2: Excluir transação | Execute | Pending |

---

## Success Criteria

- [ ] Usuário consegue lançar uma transação em menos de 30 segundos
- [ ] Lista exibe corretamente após filtros
- [ ] Dados persistem após fechar e reabrir o browser
