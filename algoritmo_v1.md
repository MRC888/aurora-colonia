# Algoritmo v1 — Sistema Inteligente da Colônia Aurora (Fase 3)

**Equipe:** Alice Brenda, Douglas Goltz e Marcelo Santos · FIAP · Ciência da Computação · 2026
**Versão:** 1 (03/11/2026). Rascunho para a equipe revisar antes de codar.

Este documento descreve **em português, passo a passo**, tudo o que o sistema faz: dados, previsão, energia, decisões, sistema principal e painel visual.
Cada subalgoritmo daqui vira uma função ou um procedimento em Python.
**Regra:** se uma regra mudar, ela muda primeiro neste documento e só depois no código.

Os pontos marcados com **[DECIDIR]** estão listados na seção 11, para a reunião da equipe.

---

## 1. Objetivo

Manter a colônia em Marte funcionando sozinha. O sistema:
1. **organiza** os dados dos sensores;
2. **prevê** a geração de energia a partir do histórico;
3. **compara** geração e consumo;
4. **decide** o que fazer, protegendo sempre o suporte à vida;
5. **explica** cada decisão (entrada → regra → saída).

A ideia que guia tudo: **sair de um sistema reativo** (que age depois que o problema acontece) **para um sistema preditivo** (que age antes).

---

## 2. Visão geral do fluxo

```text
           ENTRADA                     PROCESSAMENTO                         SAÍDA
┌────────────────────────┐   ┌──────────────────────────────┐   ┌──────────────────────────┐
│ Sensores (leitura atual)│   │ 1. Validar dados             │   │ Situação: NORMAL / ALERTA│
│  - bateria (%)          │──▶│ 2. Prever geração (regressão)│──▶│  / ECONOMIA / CRÍTICO    │
│  - geração solar/eólica │   │ 3. Balanço geração × consumo │   │ Ações: módulos desligados│
│  - vento, temperatura   │   │ 4. Regras de decisão         │   │ Motivo de cada ação      │
│  - consumo dos módulos  │   │ 5. Cortar cargas (prioridade)│   │ Registro no diário       │
│ Histórico (listas)      │   └──────────────────────────────┘   │ Dados para o painel      │
└────────────────────────┘                                      └──────────────────────────┘
```

---

## 3. Estruturas de dados

### 3.1 Limites (constantes com nome)
| Nome | Valor | Significado |
|---|---|---|
| ENERGIA_CRITICA | 20 % | Abaixo disso, a bateria está em nível crítico |
| ENERGIA_BAIXA | 50 % | Abaixo disso, a bateria está baixa (valor do enunciado) |
| CONSUMO_ALTO | 80 kW | Acima disso, o consumo é alto |
| DENSIDADE_AR_MARTE | 0,020 kg/m³ | Usada na potência eólica (hipótese didática) |

Por que o consumo alto fica acima de 80: no enunciado, energia 40 com consumo 70 precisa dar `ALERTA: reduzir consumo`, e não modo economia. Então 70 não pode contar como consumo alto.

### 3.2 Colônia: dicionário em árvore (tabela hash + hierarquia)
```text
colonia
├── energetico
│   ├── solar    → geracao_kw, irradiancia_w_m2
│   ├── eolico   → geracao_kw, vento_m_s, area_pas_m2
│   └── bateria  → nivel_pct, capacidade_kwh
├── ambiental    → temp_interna_c, temp_externa_c, vento_m_s
└── operacional
    └── modulos
        ├── Habitação    consumo 25 kW · prioridade 1 · essencial (suporte à vida)
        ├── Médico       consumo 10 kW · prioridade 1 · essencial (suporte à vida)
        ├── Energia      consumo  5 kW · prioridade 2 · essencial (mantém os outros vivos)
        ├── Logística    consumo 15 kW · prioridade 3 · não essencial
        └── Laboratório  consumo 20 kW · prioridade 4 · não essencial
```
Cada módulo também guarda `ligado` (verdadeiro/falso) e `estado` ("ok" ou "falha").
Os cinco módulos são os mesmos que pousaram na Fase 2.

### 3.3 Histórico: listas paralelas (a mesma posição é a mesma leitura)
```text
vento          = [8, 10, 12]            m/s   (enunciado)
energia_eolica = [20, 25, 30]           kW    (enunciado)
hora           = [6, 9, 12, 15, 18, 21]
consumo        = [55, 65, 75, 80, 70, 60]  kW
```

### 3.4 Diário de decisões: lista
Cada decisão é guardada como um registro com: hora, entrada, regra usada, situação, ações e motivo.

---

## 4. Algoritmo principal

```text
ALGORITMO ColoniaAurora
INÍCIO
    colonia   ← criar_colonia()
    historico ← criar_historico()
    diario    ← lista vazia

    // 1. ENTRADA
    leitura ← ler_sensores(cenário escolhido ou digitação)
    SE NÃO validar(leitura) ENTÃO
        ESCREVA "ERRO: leitura inválida —", motivo
        ENCERRE
    FIM SE
    atualizar a colonia com a leitura

    // 2. PREVISÃO
    (β0, β1)          ← ajustar_reta(historico.vento, historico.energia_eolica)
    qualidade         ← r2(historico.vento, historico.energia_eolica, β0, β1)
    eolica_prevista   ← prever(β0, β1, leitura.vento)
    geracao_prevista  ← leitura.geracao_solar + eolica_prevista

    // 3. ENERGIA
    geracao ← geracao_total(colonia)
    consumo ← consumo_total(colonia.operacional.modulos)
    mensagem_balanco ← balanco(geracao, consumo)

    // 4. DECISÃO
    situacao ← decidir(leitura.bateria, consumo, geracao_prevista)

    // 5. AÇÃO
    SE situacao = "CRÍTICO" OU situacao = "MODO ECONOMIA" ENTÃO
        acoes ← cortar_cargas(colonia.operacional.modulos, geracao_prevista)
    SENÃO
        acoes ← lista vazia
    FIM SE

    // 6. SAÍDA
    exibir_relatorio(leitura, β0, β1, qualidade, geracao_prevista,
                     mensagem_balanco, situacao, acoes)
    registrar(diario, leitura, situacao, acoes)
FIM
```

---

## 5. Subalgoritmos de dados e estrutura

### 5.1 buscar(colonia, caminho) → valor
Acesso direto pela chave, nível a nível.
```text
atual ← colonia
PARA CADA chave EM partes do caminho separadas por "/" FAÇA
    SE atual não é dicionário OU chave não existe em atual ENTÃO
        RETORNE nada            // não quebra o programa
    FIM SE
    atual ← atual[chave]
FIM PARA
RETORNE atual
```
Exemplo: `buscar(colonia, "energetico/bateria/nivel_pct")` → 40.

### 5.2 percorrer(no, nivel) → linhas (recursivo)
```text
linhas ← lista vazia
PARA CADA chave EM no FAÇA
    SE no[chave] é dicionário ENTÃO
        adicionar a chave com recuo de "nivel"
        adicionar percorrer(no[chave], nivel + 1)   // chamada recursiva
    SENÃO
        adicionar "chave = valor" com recuo de "nivel"
    FIM SE
FIM PARA
RETORNE linhas
```
Condição de parada: quando o valor não é dicionário, não há nova chamada.

### 5.3 consumo_total(modulos) → kW
Soma o `consumo_kw` apenas dos módulos com `ligado = verdadeiro`.

### 5.4 geracao_total(colonia) → kW
Geração solar + geração eólica.

### 5.5 validar(leitura) → verdadeiro / falso
```text
PARA CADA valor da leitura FAÇA
    SE não é número                    → RETORNE falso ("valor não numérico")
    SE é negativo (exceto temperatura) → RETORNE falso ("valor negativo")
FIM PARA
SE bateria < 0 OU bateria > 100        → RETORNE falso ("bateria fora de 0–100")
RETORNE verdadeiro
```

---

## 6. Subalgoritmos de previsão (regressão linear, Cap 7)

### 6.1 media(lista) → soma ÷ quantidade

### 6.2 ajustar_reta(x, y) → (β0, β1) — mínimos quadrados
```text
SE tamanho(x) ≠ tamanho(y) OU tamanho(x) < 2 ENTÃO RETORNE erro
x̄ ← media(x);  ȳ ← media(y)
numerador   ← Σ (xi − x̄) · (yi − ȳ)
denominador ← Σ (xi − x̄)²
SE denominador = 0 ENTÃO RETORNE erro    // todos os x iguais: não existe reta
β1 ← numerador ÷ denominador      // inclinação: quanto y muda quando x sobe 1
β0 ← ȳ − β1 · x̄                   // intercepto: valor de y quando x = 0
RETORNE (β0, β1)
```

### 6.3 prever(β0, β1, x) → ŷ = β0 + β1 · x

### 6.4 r2(x, y, β0, β1) → R²
R² = 1 − Σ(yi − ŷi)² ÷ Σ(yi − ȳ)². Quanto mais perto de 1, melhor a reta explica os dados.

### 6.5 Teste de mesa (exemplo do enunciado)
| i | x (vento) | y (energia) | x − x̄ | y − ȳ | (x − x̄)(y − ȳ) | (x − x̄)² |
|---|---|---|---|---|---|---|
| 1 | 8 | 20 | −2 | −5 | 10 | 4 |
| 2 | 10 | 25 | 0 | 0 | 0 | 0 |
| 3 | 12 | 30 | 2 | 5 | 10 | 4 |
| **Σ** | x̄ = 10 | ȳ = 25 | | | **20** | **8** |

β1 = 20 ÷ 8 = **2,5** · β0 = 25 − 2,5 × 10 = **0** · vento 11 → ŷ = **27,5 kW** (o enunciado diz "≈ 27") · **R² = 1**

---

## 7. Subalgoritmos de energia (Cap 8)

### 7.1 potencia_eolica(ρ, A, v) → P = ½ · ρ · A · v³
A potência cresce com o cubo do vento: com o dobro de vento, há 8 vezes mais potência.
No PDF, essa fórmula é comparada com a reta da regressão (modelo físico × modelo estatístico).

### 7.2 balanco(geracao, consumo) → mensagem
```text
SE consumo > geracao ENTÃO
    RETORNE "ALERTA: consumo maior que geração"
SENÃO SE geracao > consumo ENTÃO
    RETORNE "SUGESTÃO: armazenar energia excedente"
SENÃO
    RETORNE "OK: geração e consumo em equilíbrio"
FIM SE
```

---

## 8. Subalgoritmos de decisão (Caps 2 e 3)

### 8.1 Variáveis lógicas
| Letra | Pergunta | Verdadeira quando |
|---|---|---|
| C | A bateria está crítica? | bateria < 20 |
| B | A bateria está baixa? | bateria < 50 |
| A | O consumo está alto? | consumo > 80 |
| P | A previsão é desfavorável? | geração prevista < consumo |

### 8.2 Expressões booleanas
```text
ECONOMIA   = B · A
RISCO      = B · A · P
EMERGÊNCIA = C + RISCO
```
**Simplificação (lei da absorção):** B·A + B·A·P = B·A.
Ou seja, todo caso de RISCO também é um caso de ECONOMIA. Por isso o teste do RISCO precisa vir **antes** no `SE/SENÃO SE`; caso contrário, ele nunca seria alcançado.

### 8.3 decidir(bateria, consumo, geracao_prevista) → situação
```text
C ← bateria < ENERGIA_CRITICA
B ← bateria < ENERGIA_BAIXA
A ← consumo > CONSUMO_ALTO
P ← geracao_prevista < consumo

SE C OU (B E A E P) ENTÃO
    RETORNE "CRÍTICO: modo emergência — só suporte à vida"
SENÃO SE B E A ENTÃO
    RETORNE "MODO ECONOMIA: desligar sistemas não essenciais"
SENÃO SE B ENTÃO
    RETORNE "ALERTA: reduzir consumo"
SENÃO
    RETORNE "NORMAL: operação padrão"
FIM SE
```

### 8.4 cortar_cargas(modulos, energia_disponivel) → ações
```text
acoes ← lista vazia
ordenar os módulos da MENOR prioridade para a MAIOR (Laboratório primeiro)
PARA CADA modulo NESSA ORDEM FAÇA
    SE consumo_total(modulos) ≤ energia_disponivel ENTÃO PARE
    SE modulo é essencial ENTÃO CONTINUE      // suporte à vida nunca desliga
    modulo.ligado ← falso
    adicionar a acoes: "Desligado: <módulo> — motivo: <situação>"
FIM PARA
SE consumo_total(modulos) > energia_disponivel ENTÃO
    adicionar a acoes: "ATENÇÃO: só restou o suporte à vida; usando a bateria"
FIM SE
RETORNE acoes
```
Regra herdada das Fases 1 e 2: **segurança antes de prioridade**.

### 8.5 Tabela-verdade resumida
| C | B | A | P | Situação |
|---|---|---|---|---|
| 1 | – | – | – | CRÍTICO |
| 0 | 1 | 1 | 1 | CRÍTICO |
| 0 | 1 | 1 | 0 | MODO ECONOMIA |
| 0 | 1 | 0 | – | ALERTA |
| 0 | 0 | – | – | NORMAL |

---

## 9. Reativo × preditivo (o cenário que mostra o valor do sistema)

Simulação de um dia marciano com uma **tempestade de poeira**: a geração solar cai hora a hora.

```text
PARA CADA hora DO dia FAÇA
    REATIVO:   situacao_r ← decidir(bateria_r, consumo_r, geracao_ATUAL)
    PREDITIVO: situacao_p ← decidir(bateria_p, consumo_p, geracao_PREVISTA)
    aplicar as ações de cada um na sua própria colônia
    atualizar cada bateria: bateria ← bateria + (geração − consumo) ÷ capacidade × 100
    guardar as duas linhas para o painel
FIM PARA
comparar: horas em estado crítico, menor nível de bateria, módulos desligados
```
Resultado esperado: o preditivo desliga o Laboratório **antes**, e a bateria não chega ao nível crítico. O reativo só age quando já é tarde.
**[DECIDIR]** como calcular a geração prevista neste cenário (ver seção 11).

---

## 10. Visual: painel HTML e PDF

### 10.1 Algoritmo do painel (contrato entre o código e o visual)
```text
1. Python roda todos os cenários (seção 12) e a simulação da seção 9.
2. exportar_painel grava tudo em painel/dados.js.
3. O HTML lê dados.js e SÓ MOSTRA, sem recalcular nada.
4. README, PDF e painel usam os mesmos números.
```

### 10.2 Ideia: "A colônia que vê o futuro"
É o Centro de Operações da Colônia, continuação visual das salas de controle das Fases 1 e 2.

| Tela | Conteúdo | Critério que mostra |
|---|---|---|
| 1. Abertura | Linha do tempo: decolagem → pouso → colônia; frase "de reativo para preditivo" | História |
| 2. Mapa vivo | A árvore da seção 3.2 desenhada; ao clicar num nó, mostra a chave e o valor | Estruturação de dados |
| 3. Energia | Medidor da bateria, geração solar e eólica, consumo e barra de balanço; módulos como luzes, suporte à vida com cadeado 🔒 | Uso de energia |
| 4. Previsão | Gráfico vento × energia com a reta, β0, β1 e R² explicados em português, seletor de vento mostrando ŷ | Modelagem e previsão |
| 5. Reativo × Preditivo | Tela dividida, mesma tempestade nas duas metades; placar no fim | O "uau" da apresentação |
| 6. Diário | Cada decisão com hora, entrada, regra usada e motivo | Lógica de decisão |

### 10.3 Identidade visual
| Papel | Cor |
|---|---|
| Fundo / cartões | `#0c0b1e` / `#06141c` (os mesmos da Fase 2) |
| Dados | ciano `#46f0ff` |
| Sol marciano, energia solar | laranja `#ff8a3d` (novo) |
| Suporte à vida, NORMAL | verde `#3dffa8` (novo) |
| ALERTA | amarelo `#ffd23d` |
| MODO ECONOMIA | laranja `#ff8a3d` |
| CRÍTICO | rosa `#ff3d7f` |

- A mesma cor significa a mesma situação em todo lugar: terminal, painel e PDF.
- Números em fonte monoespaçada, que lembra telemetria.

### 10.4 PDF (6 a 8 páginas, objetivo)
1. Capa com equipe, RMs e links do GitHub e do painel.
2. A história e a virada reativo → preditivo.
3. Como os dados foram organizados (árvore + trecho do dicionário).
4. Regras de decisão (seção 8: variáveis, simplificação e tabela).
5. Modelo de previsão (teste de mesa da seção 6.5, gráfico e R²).
6. Como o sistema melhora o uso de energia (resultado da seção 9).
7. Exemplos reais de entrada e saída e limites do protótipo.

### 10.5 Apresentação (cerca de 3 minutos)
Problema (a Terra está longe, a colônia decide sozinha) → mapa vivo → diário de decisões → reta de previsão → clímax reativo × preditivo.

**Divisão:** Marcelo e Douglas fazem o código (seções 4 a 9). Alice faz o painel e o PDF (seção 10).

---

## 11. Pontos para decidir na reunião

1. **Geração prevista na simulação da seção 9.**
   - Opção A: geração solar atual + eólica estimada pela reta (vento → energia).
   - Opção B: tendência da geração solar ao longo das horas (uma segunda regressão, hora → geração).
2. **Duração da simulação:** quantas horas e quais valores a tempestade terá.
3. **Prioridades dos módulos:** Logística (3) acima de Laboratório (4)? A Energia conta como essencial?
4. **Bateria no balanço:** só mostrar a bateria, ou somar a reserva disponível à "energia disponível" no corte de cargas?
5. **Religar módulos:** quando a energia voltar, o sistema religa sozinho, do mais importante para o menos?
6. **Entrada:** só cenários prontos, ou também digitar os valores no terminal (como na Fase 1)?
7. **NumPy:** não usar no núcleo, ou usar só para conferir a regressão nos testes?

---

## 12. Cenários de teste (o que cada caso precisa mostrar)

| # | Entrada | Saída esperada | Origem |
|---|---|---|---|
| 1 | bateria 40, consumo 70 | `ALERTA: reduzir consumo` | Enunciado |
| 2 | geração 40, consumo 70 | `ALERTA: consumo maior que geração` | Enunciado |
| 3 | geração 80, consumo 30 | `SUGESTÃO: armazenar energia excedente` | Enunciado |
| 4 | vento 11 | ŷ = 27,5 (β1 = 2,5; β0 = 0; R² = 1) | Enunciado |
| 5 | bateria 40, consumo 90, geração prevista 95 | `MODO ECONOMIA` + Laboratório desligado | Equipe |
| 6 | bateria 40, consumo 90, geração prevista 60 | `CRÍTICO` (B·A·P) | Equipe |
| 7 | bateria 15 | `CRÍTICO`; só o suporte à vida fica ligado | Equipe |
| 8 | bateria 85, consumo 50 | `NORMAL` | Equipe |
| 9 | tempestade de poeira | o preditivo age antes do reativo | Equipe |
| 10 | bateria −5 ou "abc" | Mensagem de erro, sem quebrar | Equipe |

Cada linha vira um teste automático. Nada é entregue com teste falhando.
