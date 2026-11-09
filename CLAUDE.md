# CLAUDE.md — aurora-colonia (FIAP Fase 3)

Sistema Inteligente da Colônia Aurora: organiza os dados, prevê com regressão linear, compara geração × consumo e decide por regras.
Equipe: Marcelo e Douglas (código), Alice (painel HTML e PDF).

## Antes de começar
1. Ler no Obsidian `Projetos/FIAP/FIAP — Como funciona o curso.md` e `FIAP — Fase 3.md` (que tem as decisões e o histórico).
2. Ler `algoritmo_v1.md`: ele é a **fonte da verdade**. Se uma regra mudar, ela muda primeiro no algoritmo e só depois no código.
3. `ROADMAP.md` tem os marcos, a matriz requisito → evidência e os critérios de avaliação.

## Regras do projeto
- Usar **só conceitos dos capítulos da Fase 3**: funções e procedimentos, módulos, recursão, dicionário/hash, árvore, listas, `if/elif/else`, álgebra booleana, regressão por mínimos quadrados, R² e P = ½ρAv³.
- **Núcleo em Python puro**, sem bibliotecas externas e sem classes (não foram ensinadas). `unittest`, `json`, `os` e `sys` ficam só nos testes, na exportação e no menu. A lista completa está no README.
- Separar **dados** (`dados.py`), **estrutura** (`colonia.py`), **modelos** (`previsao.py`, `energia.py`), **decisões** (`regras.py`), **sistema** (`sistema.py`), **demonstração** (`simulacao.py`, `cenarios.py`) e **interface** (`main.py`, `painel.py`).
- **Segurança antes de prioridade:** suporte à vida nunca é desligado.
- O painel lê `painel/dados.js` gerado pelo Python e **não recalcula** nada.
- Todo exemplo do enunciado vira um teste. Rodar: `python3 -m unittest discover -s tests -t .`
- Bloco a bloco: fazer, testar, mostrar e registrar no Obsidian.
- No Mac, o repositório tem `core.fileMode false`, porque o OneDrive muda as permissões dos arquivos.

## Agentes do projeto (`.claude/agents/`)
- `revisor-pbl`: confere o código e os documentos contra o enunciado, o `algoritmo_v1.md` e os conceitos permitidos. Usar ao fechar cada marco.
- `verificador-alinhamento`: confere se README, algoritmo, testes, `dados.js` e PDF usam os mesmos números e as mesmas frases. Usar antes de entregar.

## Skills úteis
| Etapa | Skill |
|---|---|
| Código (M2 a M5) | `/code-review` ao fechar cada marco e `/simplify` para limpar |
| Painel (M6) | `frontend-design` (visual) e `dataviz` (gráfico da reta e do balanço) |
| PDF (M7) | `pdf` (gerar e conferir páginas) |
| Fim do dia | `/fim-de-sessao` (Obsidian, commit e push) |

## Estado atual (09/11/2026): projeto entregue
- Tudo na `main`, sem outras branches: sistema, 21 cenários, 4 simulações, 162 testes, painel e relatório (`docs/Relatorio_Aurora_Siger.pdf`).
- Painel publicado: https://mrc888.github.io/aurora-colonia/painel/
