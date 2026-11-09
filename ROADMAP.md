# Roadmap — Aurora Siger · Fase 3 · Sistema Inteligente da Colônia

**Equipe:** Alice Brenda (RM 574916), Douglas Goltz (RM 574439) e Marcelo Santos (RM 576131).
**Curso:** Ciência da Computação, FIAP, 2026.
**Fonte:** Cap 1 da Fase 3, *"A Aurora Estabelece os Primeiros Sistemas da Colônia"*.

> Este documento resume o enunciado com nossas palavras e o transforma em plano de trabalho.
> Em caso de dúvida, o enunciado original sempre prevalece.

---

## 1. A história até aqui

| Fase | Etapa da missão | O que construímos | Repositório |
|---|---|---|---|
| 1 | Decolagem | Verificação de pré-decolagem (ÓTIMO / MÉDIO / HORRÍVEL) | [Aurora-PBL-FIAP](https://github.com/MRC888/Aurora-PBL-FIAP) |
| 2 | Pouso | MGPEB: fila de pouso e ativação dos módulos da base | [pouso_aurora](https://github.com/Douglasgbm/pouso_aurora) · [painel](https://mrc888.github.io/aurora-painel/) |
| **3** | **Colônia em operação** | **Sistema que organiza dados, decide e prevê** | este repositório |

Os cinco módulos que pousaram na Fase 2 (Energia, Habitação, Logística, Médico e Laboratório) agora operam todos os dias.
Os sensores geram dados o tempo todo. A Terra está longe demais para responder em tempo real, então **a colônia precisa decidir sozinha**.

**A virada desta fase:** sair de um sistema **reativo** (que só responde ao que já aconteceu) para um sistema **preditivo** (que antecipa o que vai acontecer).

---

## 2. Enunciado detalhado

### 2.1 Organizar os dados da colônia
- Guardar energia, consumo e clima em **listas** e em **chave-valor** (dicionário, que é a tabela hash do Python).
- Representar os sistemas de forma **hierárquica**, por exemplo: sistema energético → solar / eólico.
- Agrupar por sistema energético, ambiental e operacional.
- Dar acesso rápido aos dados críticos: nível de energia e alertas de falha.
- Guardar **séries históricas**, porque elas alimentam a previsão.

### 2.2 Tomar decisões automaticamente
- **Regra simples:** se energia < 50 → reduzir consumo.
- **Condições combinadas:** se energia < 50 **E** consumo alto → ativar modo economia.
- **Prioridade:** manter o suporte à vida ligado e desligar o que não é essencial.
- **Saída clara:** entrada energia = 40 e consumo = 70 → `ALERTA: reduzir consumo`.
- **Risco combinado** (do contexto do desafio): energia baixa **E** consumo alto **E** previsão desfavorável.

### 2.3 Prever comportamentos com regressão linear
- Exemplo: usar o vento para estimar a energia eólica.
- Dados: vento = [8, 10, 12] e energia = [20, 25, 30].
- Ajustar uma reta aos dados e usá-la para estimar valores futuros.
- Resultado esperado: vento = 11 → energia ≈ 27.
  - Pela fórmula de mínimos quadrados: β₁ = 2,5 e β₀ = 0, então ŷ = **27,5**.

### 2.4 Analisar o uso de energia
- Comparar geração, consumo e reserva (quando houver).
- Consumo > geração → risco. Exemplo: geração 40 e consumo 70 → `ALERTA: consumo maior que geração`.
- Geração > consumo → possível desperdício. Exemplo: geração 80 e consumo 30 → `SUGESTÃO: armazenar energia excedente`.

### 2.5 Fluxo obrigatório
**Entrada → processamento → saída**, com dados, lógica e decisões em partes separadas do código.

---

## 3. Entregáveis obrigatórios

### 3.1 Repositório GitHub público
- [x] **Um único sistema funcionando.**
- [x] Código Python **organizado em funções**.
- [x] Separação clara entre **dados**, **lógica** e **decisões**.
- [x] `README.md` com explicação simples e **exemplo de entrada e saída**.

### 3.2 Relatório em PDF (objetivo: mostrar entendimento, não volume)
- [ ] Como os dados foram organizados.
- [ ] Quais regras de decisão foram usadas.
- [ ] Qual modelo de previsão foi aplicado.
- [ ] Como o sistema melhora o uso de energia da colônia.
- [ ] Link deste repositório.

### 3.3 Observações do enunciado
- Usar **apenas conceitos dos capítulos** da fase.
- **Não** é necessário usar bibliotecas avançadas.
- O foco é **lógica, organização e interpretação**.

---

## 4. Cada capítulo dentro do trabalho

| Cap | Matéria | Onde entra no sistema |
|---|---|---|
| 2 | Álgebra booleana e simplificação | Regras combinadas (AND/OR/NOT), com a simplificação mostrada no PDF |
| 3 | Subalgoritmos: funções e procedimentos | Código em funções, separado em módulos `.py`; recursão para percorrer a hierarquia |
| 4 | Árvores e tabelas hash | Dicionário (hash) para acesso rápido; árvore de sistemas → subsistemas |
| 5 | Vetores e matrizes | Séries históricas e perfis de 24 horas como vetores (listas). Sem NumPy, por decisão da equipe |
| 6 | Computadores, SO e CPU | Sensores IoT como camada de entrada; limites de hardware (contexto no PDF) |
| 7 | Regressão linear simples | β₀ e β₁ por mínimos quadrados, previsão ŷ e R² |
| 8 | Energia solar e eólica | Geração solar e eólica, P = ½·ρ·A·v³, excedente × déficit |

---

## 5. Marcos

| # | Marco | Responsável | Critério de pronto |
|---|---|---|---|
| M0 | Repositório, roadmap, algoritmo e visual | Marcelo | Repositório público com os 4 documentos |
| M1 | **Dados**: dicionário da colônia + históricos | Marcelo e Douglas | Navega a hierarquia e busca qualquer sensor por chave |
| M2 | **Previsão**: regressão feita à mão | Marcelo e Douglas | Exemplo do enunciado dá β₁ = 2,5, β₀ = 0 e ŷ(11) = 27,5 |
| M3 | **Energia**: balanço geração × consumo | Marcelo e Douglas | Os dois exemplos do enunciado geram as frases exatas |
| M4 | **Decisões**: regras e prioridades | Marcelo e Douglas | 40/70 → `ALERTA: reduzir consumo`; o suporte à vida nunca é desligado |
| M5 | **Sistema único** (`main.py`) + cenários + testes | Marcelo e Douglas | `python main.py` roda de ponta a ponta; testes passam |
| M6 | **Painel HTML** (extra) a partir de `dados.js` | Alice (Douglas apoia os dados) | Mostra os mesmos números que o Python |
| M7 | **PDF** final | Alice | Responde aos 5 itens da seção 3.2 e tem o link do repositório |
| M8 | Fechamento | Equipe | Matriz requisito → evidência toda marcada como atendida |

**Divisão:** Marcelo e Douglas fazem o código. Alice faz o visual (painel) e o PDF.
**Contrato entre as partes:** o Python gera os dados (`painel/dados.js`) e o painel só **mostra**, sem recalcular nada. Assim, README, PDF e painel nunca divergem.

---

**Situação em 09/11/2026:** M0 a M8 prontos. Projeto entregue.

---

## 6. Matriz requisito → evidência

| ID | Requisito | Arquivo / seção | Evidência | Situação |
|---|---|---|---|---|
| D1 | Listas e chave-valor | `dados.py` | `criar_colonia()` (dicionários), `criar_historico()` e perfis (listas); `tests/test_dados_estrutura.py` | Atendido |
| D2 | Hierarquia (energético → solar / eólico) | `dados.py`, `colonia.py` | Árvore de dicionários; `percorrer()` recursiva; opções `arv` e `todos` do menu | Atendido |
| D3 | Acesso rápido a dados críticos e alertas de falha | `colonia.py`, `energia.py` | `buscar(colonia, "energetico/bateria/nivel_pct")` → 53; `operacional/alertas_de_falha` (cenário 20) | Atendido |
| D4 | Séries históricas | `dados.py`, `sistema.py` | `historico`; medição entra e refaz a reta (cenário 21) | Atendido |
| L1 | Regra simples (energia < 50) | `regras.py` | `decidir()`, variável B; `tests/test_regras.py` | Atendido |
| L2 | Condição combinada (E) | `regras.py` | ECONOMIA = B·A e RISCO = B·A·P; cenários 5 e 6 | Atendido |
| L3 | Prioridade (suporte à vida) | `regras.py`, `colonia.py` | `fila_de_corte()`; `validar()` recusa essencial desligado; cenários 7, 12 e 13 | Atendido |
| L4 | Saída clara (40/70 → ALERTA) | `tests/` | Cenário 1: `ALERTA: reduzir consumo` | Atendido |
| P1 | Reta ajustada aos dados históricos | `previsao.py` | `ajustar_reta()`: β₁ = 2,5 e β₀ = 0; teste de mesa | Atendido |
| P2 | Vento 11 → ≈ 27 | `tests/` | Cenário 4: 27,5 kW | Atendido |
| P3 | Antecipar comportamentos | `energia.py`, `simulacao.py` | `projetar_bateria()`; simulações 9a a 9d | Atendido |
| E1 | Consumo > geração → ALERTA | `energia.py` | Cenário 2: `ALERTA: consumo maior que geração` | Atendido |
| E2 | Geração > consumo → SUGESTÃO | `energia.py` | Cenário 3: `SUGESTÃO: armazenar energia excedente` | Atendido |
| I1 | Código em funções, sistema único | `main.py`, `sistema.py` | `python main.py`, opção `todos`; testes em `tests/` | Atendido |
| I2 | Separação dados / lógica / decisões | estrutura de arquivos | `dados.py`, `colonia.py`, `previsao.py`, `energia.py`, `regras.py`, `sistema.py` | Atendido |
| V1 | Painel visual (extra) com os mesmos números do Python | `painel/` | `index.html` lê `dados.js`; 176 estados conferidos contra o Python; online em https://mrc888.github.io/aurora-colonia/painel/ | Atendido |
| R1 | README com exemplo de entrada e saída | `README.md` | Seção "Exemplo de entrada e saída", igual à saída real | Atendido |
| R2 | PDF com os 5 itens + link | `docs/Relatorio_Aurora_Siger.pdf` | Dados (p. 4), regras (p. 5), previsão (p. 6), uso de energia (p. 7 e 9), link e QR (p. 11) | Atendido |

---

## 7. Critérios de avaliação (enunciado)

| Critério | Peso | O que vamos mostrar |
|---|---|---|
| Estruturação de dados | 2 | Dicionário hierárquico, históricos em listas, busca por chave |
| Lógica de decisão | 2 | Regras simples, combinadas e com prioridade; expressão booleana simplificada |
| Modelagem e previsão | 2 | Regressão por mínimos quadrados com β₀, β₁, ŷ e R²; curva solar; projeção da bateria; comparação com a física |
| Implementação em Python | 2 | Funções pequenas, módulos separados, sistema único que roda, testes |
| Documentação e organização | 2 | README com entrada e saída, PDF objetivo, painel alinhado aos dados |
| **Total** | **10** | |

**Objetivo final:** organizar dados com eficiência, decidir com lógica, prever com modelos matemáticos, integrar tudo em uma solução e **evoluir de um sistema reativo para um sistema preditivo**.
