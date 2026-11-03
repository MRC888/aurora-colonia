# Aurora Siger · Fase 3 — Sistema Inteligente da Colônia

> **Em construção.** A colônia já opera em Marte. Este sistema organiza os dados dos sensores, decide por regras e **prevê** o que vem a seguir: de um sistema **reativo** para um **preditivo**.

**Equipe:** Alice Brenda (RM 574916), Douglas Goltz (RM 574439) e Marcelo Santos (RM 576131). Ciência da Computação, FIAP, 2026.

## Documentos do projeto

| Arquivo | O que é |
|---|---|
| [ROADMAP.md](ROADMAP.md) | Enunciado detalhado, marcos, divisão de tarefas, matriz requisito → evidência e critérios de avaliação |
| [RECEITA.md](RECEITA.md) | O algoritmo passo a passo ("receita de bolo") que guia o código |
| [docs/VISUAL.md](docs/VISUAL.md) | Proposta de visual do painel HTML, do PDF e da apresentação |

## Fases anteriores

- Fase 1 — Decolagem: [MRC888/Aurora-PBL-FIAP](https://github.com/MRC888/Aurora-PBL-FIAP)
- Fase 2 — Pouso (MGPEB): [Douglasgbm/pouso_aurora](https://github.com/Douglasgbm/pouso_aurora) · [painel online](https://mrc888.github.io/aurora-painel/)

## Como executar

Requer Python 3, sem bibliotecas externas. No macOS, use `python3`.

```text
python colonia.py                              # mostra a árvore da colônia e buscas por chave
python -m unittest discover -s tests -t .      # roda os testes
```

O sistema completo (`main.py`), com exemplo de entrada e saída, chega no marco M5.

## Andamento

| Marco | Situação |
|---|---|
| M0 Documentos | Pronto |
| M1 Dados e estrutura | Pronto (`dados.py`, `colonia.py`, 11 testes) |
| M2 Previsão | Próximo |
