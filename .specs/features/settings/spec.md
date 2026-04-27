# Settings — Tela de Opções

## Problem Statement

O usuário não possui um ponto centralizado para configurações da aplicação. Falta a possibilidade de definir um saldo inicial (valor de ponto de partida antes do primeiro lançamento) e de limpar todos os dados de uma vez quando necessário.

## Goals

- [ ] Permitir definir um saldo inicial que influencia o saldo exibido no dashboard
- [ ] Permitir excluir todos os lançamentos com confirmação
- [ ] Garantir integridade: saldo inicial bloqueado enquanto existirem lançamentos

## Out of Scope

| Feature | Reason |
|---|---|
| Reset completo (categorias + lançamentos) | Categoria é dado de configuração, não histórico — fora do escopo desta tela |
| Exportação de dados | Roadmap futuro |
| Importação de dados | Roadmap futuro |
| Outras configurações de aparência/tema | Fora do escopo desta tela |

---

## User Stories

### P1: Definir Saldo Inicial ⭐ MVP

**User Story**: Como usuário, quero definir um saldo inicial para que o dashboard reflita meu saldo real desde antes do primeiro lançamento registrado.

**Why P1**: Sem saldo inicial, quem começa a usar com dinheiro já em caixa verá saldo incorreto no dashboard desde o primeiro uso.

**Acceptance Criteria**:

1. WHEN o usuário acessa a tela de Opções THEN sistema SHALL exibir um campo de saldo inicial com o valor atualmente salvo (ou R$ 0,00 se nunca definido)
2. WHEN não há lançamentos cadastrados THEN sistema SHALL exibir o campo de saldo inicial habilitado para edição
3. WHEN há pelo menos um lançamento cadastrado THEN sistema SHALL exibir o campo de saldo inicial desabilitado (bloqueado para edição), com mensagem explicativa
4. WHEN o usuário salva um saldo inicial válido (≥ 0) THEN sistema SHALL persistir o valor no LocalStorage
5. WHEN o saldo inicial é salvo THEN sistema SHALL atualizar o saldo exibido no dashboard (saldo = saldo inicial + receitas − despesas)
6. WHEN o usuário informa um valor negativo THEN sistema SHALL exibir erro de validação e bloquear o salvamento
7. WHEN todos os lançamentos são excluídos THEN sistema SHALL desbloquear o campo de saldo inicial para edição novamente

**Independent Test**: Sem nenhum lançamento, definir R$ 1.000,00 como saldo inicial e verificar que o dashboard exibe R$ 1.000,00 de saldo.

---

### P1: Excluir Todos os Lançamentos ⭐ MVP

**User Story**: Como usuário, quero excluir todos os lançamentos de uma vez para poder reiniciar o histórico sem precisar remover item a item.

**Why P1**: Caso de uso essencial para testes, reinício de uso ou limpeza de dados do período anterior.

**Acceptance Criteria**:

1. WHEN o usuário clica em "Excluir todos os lançamentos" THEN sistema SHALL abrir diálogo de confirmação antes de executar a ação
2. WHEN o usuário confirma a exclusão THEN sistema SHALL remover todos os lançamentos do LocalStorage
3. WHEN o usuário confirma a exclusão THEN sistema SHALL exibir snackbar de confirmação ("Todos os lançamentos foram excluídos")
4. WHEN o usuário cancela no diálogo THEN sistema SHALL fechar o diálogo sem alterar nenhum dado
5. WHEN não há lançamentos cadastrados THEN sistema SHALL exibir o botão de exclusão desabilitado
6. WHEN a exclusão é concluída THEN sistema SHALL desbloquear o campo de saldo inicial para edição

**Independent Test**: Com 3 lançamentos cadastrados, clicar em excluir todos, confirmar, e verificar que a lista de transações fica vazia.

---

## Edge Cases

- WHEN o usuário tenta salvar saldo inicial vazio THEN sistema SHALL tratar como R$ 0,00 ou exibir validação
- WHEN o saldo inicial é R$ 0,00 THEN sistema SHALL salvar normalmente (zero é válido)
- WHEN todos os lançamentos são excluídos THEN saldo do dashboard SHALL exibir apenas o saldo inicial salvo
- WHEN o saldo inicial nunca foi definido E não há lançamentos THEN dashboard SHALL exibir R$ 0,00

---

## Decisions

| Decisão | Escolha |
|---|---|
| Desbloqueio após "excluir todos" | Sim — a condição de bloqueio é existir lançamento; sem lançamentos, o campo fica livre |
| Saldo inicial aceita valor negativo? | Não — valor deve ser ≥ 0 |
| "Excluir todos" afeta categorias? | Não — apenas lançamentos |
| Saldo inicial persiste após "excluir todos"? | Sim — apenas lançamentos são removidos, saldo inicial é configuração separada |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---|---|---|---|
| SET-01 | P1: Saldo Inicial — exibir campo com valor atual | Design | Pending |
| SET-02 | P1: Saldo Inicial — habilitado sem lançamentos | Design | Pending |
| SET-03 | P1: Saldo Inicial — bloqueado com lançamentos | Design | Pending |
| SET-04 | P1: Saldo Inicial — salvar e persistir | Design | Pending |
| SET-05 | P1: Saldo Inicial — refletir no dashboard | Design | Pending |
| SET-06 | P1: Saldo Inicial — validação valor negativo | Design | Pending |
| SET-07 | P1: Saldo Inicial — desbloquear após excluir todos | Design | Pending |
| SET-08 | P1: Excluir Todos — diálogo de confirmação | Design | Pending |
| SET-09 | P1: Excluir Todos — executar exclusão confirmada | Design | Pending |
| SET-10 | P1: Excluir Todos — snackbar de confirmação | Design | Pending |
| SET-11 | P1: Excluir Todos — botão desabilitado sem lançamentos | Design | Pending |

---

## Success Criteria

- [ ] Usuário consegue definir saldo inicial quando não há lançamentos e ver o valor refletido no dashboard
- [ ] Campo de saldo inicial fica bloqueado visualmente com mensagem explicativa quando há lançamentos
- [ ] Usuário consegue excluir todos os lançamentos com confirmação e o campo de saldo inicial é desbloqueado
- [ ] Todos os dados são persistidos corretamente no LocalStorage
