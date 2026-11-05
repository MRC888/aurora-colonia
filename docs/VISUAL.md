# Visual e apresentação — Fase 3

Proposta para a Alice (painel HTML + PDF). É um ponto de partida: a Alice tem a palavra final no visual.

---

## 1. A ideia central em uma frase

> **"A colônia que vê o futuro."**
> Mostrar, lado a lado, a mesma colônia vivendo o mesmo dia e a mesma noite em Marte: uma **reage** e (na simulação 9b) chega à madrugada em CRÍTICO, e a outra **prevê** e amanhece com folga.

A Fase 1 foi a sala de **decolagem**, a Fase 2 foi a sala de controle do **pouso**. A Fase 3 é o **Centro de Operações da Colônia**. A mesma família visual segue, agora vista do chão de Marte.

---

## 2. Identidade visual

Continuidade com o painel da Fase 2, mais duas cores novas desta fase.

| Papel | Cor | Origem |
|---|---|---|
| Fundo | `#0c0b1e` | Fase 2 (mantém a família) |
| Telas / cartões | `#06141c` | Fase 2 |
| Dados e linhas | ciano `#46f0ff` | Fase 2 |
| **Sol marciano / solar** | laranja `#ff8a3d` | **novo**: o céu de Marte, a energia solar |
| **Suporte à vida / OK** | verde `#3dffa8` | **novo**: o que nunca pode apagar |
| Crítico | rosa `#ff3d7f` | Fase 2 |

**Estados da decisão (o mesmo código de cor em tudo, do terminal ao PDF):**

| Estado | Cor |
|---|---|
| NORMAL | verde |
| ALERTA | amarelo `#ffd23d` |
| MODO ECONOMIA | laranja |
| CRÍTICO | rosa |

- **Fonte sugerida:** uma monoespaçada para números (parece telemetria) e uma sem serifa para textos.
- **No PDF:** capa escura com a identidade e páginas internas claras (para leitura e impressão), como na Fase 2.

---

## 3. Telas do painel

### Tela 1 — Abertura: "Sol 1 da colônia"
- Linha do tempo das três fases: decolagem → pouso → colônia.
- Uma frase sobre a virada desta fase: **de reativo para preditivo**.
- Um botão: **Iniciar o dia**.

### Tela 2 — Mapa vivo da colônia (estrutura de dados)
- A **árvore** da colônia desenhada: colônia → energético / ambiental / operacional → solar, eólico, bateria, módulos.
- Ao clicar num nó, aparece a **chave e o valor**, por exemplo `energetico/bateria/capacidade_kwh = 1100`. Em `dados.js`, o campo `arvore` traz as linhas com recuo; o caminho completo se monta pelo recuo.
- **Por quê:** mostra o critério "Estruturação de dados" sem precisar explicar. O dicionário aparece de verdade na tela.

### Tela 3 — Painel de energia
- Medidor da bateria (%), geração solar, geração eólica e consumo total.
- Barra de **balanço**: verde quando sobra energia, rosa quando falta.
- Os cinco módulos como "luzes" que acendem e apagam. Suporte à vida tem um cadeado 🔒: não desliga nunca.

### Tela 4 — Previsão
- Gráfico de pontos **vento × energia** com a **reta ajustada** por cima.
- Ao lado: β₀, β₁ e R², cada um com uma frase em português. Exemplo: "a cada 1 m/s de vento, +2,5 kW".
- Um seletor de vento (0 a 25 m/s) mostra a previsão ŷ. Os valores vêm **prontos do Python** em `previsao.seletor_vento`: o painel não refaz a conta.
- Comparação reta × curva v³ calibrada × fórmula pura, em `previsao.reta_x_fisica` (campos `reta_kw`, `fisica_calibrada_kw` e `fisica_pura_kw`). Sempre escrever **calibrada**: a fórmula pura dá só 1,2 kW a 10 m/s.

### Tela 5 — Reativo × Preditivo (o "uau")
- Tela dividida: **a mesma tempestade de poeira** nas duas metades, do dia até as 6h.
  - **Esquerda (reativo):** não corta durante a tempestade. Na 9b, a bateria desce pela noite, entra em CRÍTICO às 2h e amanhece com 7,1%.
  - **Direita (preditivo):** na 9b, a projeção fura 70%, o Laboratório sai durante a tempestade, e a bateria amanhece com 50,7%, em NORMAL.
- Seletores de **colônia** (A/B) e de **tempestade** (manhã/tarde): escolhem entre as simulações 9a a 9d.
- No fim, um placar com os campos de `resumo`: bateria às 20h, amanhecer, horas em CRÍTICO, menor bateria e módulo-horas desligados.
- **Importante:** de dia ninguém chega ao CRÍTICO, e o preditivo mantém módulos parados por mais tempo. O placar deve mostrar esse custo. Usar "age durante a tempestade", e não "age antes" ou "na primeira hora": isso só vale na 9c.

### Tela 6 — Diário de decisões
- Lista de cada decisão com **hora, entrada, regra usada e motivo**. Exemplo: "B·A verdadeiro → MODO ECONOMIA → Laboratório e Logística desligados".
- **Por quê:** mostra o critério "Lógica de decisão" e deixa o sistema explicável.

---

## 4. Contrato entre o código e o visual

```text
Python (Marcelo e Douglas)  →  painel.py  →  painel/dados.js  →  HTML (Alice)
```
- O HTML **só mostra**, não calcula. Assim, painel, README e PDF sempre têm os mesmos números.
- O `painel/dados.js` real já existe no repositório. Para atualizar: `python painel.py`.
- Campos principais: `arvore`, `colonias`, `tempestades`, `previsao`, `simulacoes` (9a a 9d, cada uma com `reativo` e `preditivo`, e dentro `linhas`, `diario` e `resumo`) e `cenarios`.
- Deve funcionar abrindo o `index.html` direto no navegador (sem servidor) e ser publicado no GitHub Pages, como na Fase 2.

---

## 5. PDF (objetivo: entendimento, não volume)

Sugestão: **6 a 8 páginas**. O enunciado não fixa um limite e pede objetividade.

| Página | Conteúdo | Item do enunciado |
|---|---|---|
| 1 | Capa: equipe, RMs, link do GitHub e do painel | link do repositório |
| 2 | A história e a virada reativo → preditivo (1 diagrama) | contexto |
| 3 | **Como os dados foram organizados**: desenho da árvore + trecho do dicionário | dados |
| 4 | **Regras de decisão**: tabela B / A / P, expressão simplificada e tabela do `if/elif` | regras |
| 5 | **Modelo de previsão**: curva solar, conta à mão (β₁ = 2,5; β₀ = 0; ŷ = 27,5), gráfico, R² e limites (3 pontos alinhados sempre dão R² = 1) | previsão |
| 6 | **Como melhora o uso de energia**: o cenário reativo × preditivo com números | energia |
| 7 | Exemplos de entrada e saída reais (print do terminal) + limites do protótipo | evidência |

Regra da equipe: todo número do PDF vem de uma execução real do código.

---

## 6. Apresentação (se houver vídeo ou fala)

Cinco atos, cerca de 3 minutos:
1. **O problema:** a Terra está a até 22 minutos-luz; a colônia precisa decidir sozinha.
2. **Os dados:** o mapa vivo (Tela 2).
3. **As regras:** o diário de decisões (Tela 6).
4. **A previsão:** a reta (Tela 4).
5. **O clímax:** reativo × preditivo na tempestade (Tela 5), e a frase "a colônia que vê o futuro".

---

## 7. Checklist da Alice

- [ ] Escolher e validar a paleta (seção 2).
- [ ] Rascunho das 6 telas (papel, Figma ou HTML direto).
- [ ] Montar o painel lendo o `painel/dados.js` real (M6).
- [ ] Conferir os números da tela 5 com a saída de `python main.py`, opções `9a` a `9d`.
- [ ] PDF com a estrutura da seção 5 (M7).
- [ ] Testar no celular e no computador.
