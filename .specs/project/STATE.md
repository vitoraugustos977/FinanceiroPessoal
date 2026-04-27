# State — Financeiro Pessoal

## Decisions

| Date       | Decision                            | Rationale                                              |
|------------|-------------------------------------|--------------------------------------------------------|
| 2026-04-24 | LocalStorage para persistência      | v1 é uso pessoal/browser, sem necessidade de backend   |
| 2026-04-24 | Angular Material para UI            | Bem documentado, integração nativa com Angular         |
| 2026-04-24 | Chart.js + ng2-charts para gráficos | Mais popular e com boa documentação para Angular       |
| 2026-04-24 | Standalone components (Angular 17+) | Padrão atual do Angular, sem NgModules                 |
| 2026-04-24 | Tipos: Receita, Despesa, Transf.    | Cobre os casos de uso essenciais para v1               |
| 2026-04-24 | Transferência virou categoria       | Semântica mais clara; Receita+Transf. e Despesa+Transf. cobrem entrada/saída |
| 2026-04-24 | Objetivo subtrai do saldo           | Dinheiro alocado para meta sai da carteira geral       |
| 2026-04-24 | Objetivo tem campo `objectiveId` separado de `categoryId` | Semântica limpa; evita conflito entre categorias e objetivos |
| 2026-04-24 | Sem objetivos padrão pré-criados    | Objetivos são pessoais demais para ter padrões fixos   |

## Blockers

_Nenhum no momento._

## Lessons Learned

_Nenhum ainda._

## Deferred Ideas

- Importação de extratos bancários (OFX/CSV)
- Metas financeiras por categoria
- Múltiplas carteiras / contas

## Preferences

_Nenhuma registrada ainda._
