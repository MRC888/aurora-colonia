# Algoritmo v1 — Sistema Inteligente da Colônia Aurora (Fase 3)

**Equipe:** Alice Brenda, Douglas Goltz e Marcelo Santos · FIAP · Ciência da Computação · 2026
**Versão:** 1.2 (05/11/2026). Versão final: descreve o sistema entregue, depois da auditoria.

Este documento descreve **em português, passo a passo**, tudo o que o sistema faz: dados, previsão, energia, decisões, sistema principal e painel visual.
Cada subalgoritmo daqui vira uma função ou um procedimento em Python.
**Regra:** se uma regra mudar, ela muda primeiro neste documento e só depois no código.

As decisões e o motivo de cada uma estão na seção 11.

### O que mudou da versão 1.1 para a 1.2 (auditoria de 05/11/2026)
Nenhuma decisão da reunião mudou. A versão 1.2 corrige falhas e fecha pontos abertos:
1. A validação ficou mais forte: hora inteira de 0 a 23, sem NaN nem infinito, e **nenhum módulo essencial pode começar desligado**.
2. A simulação segue **pela noite até as 6h**, hora a hora, com o sistema decidindo. O amanhecer deixou de ser uma conta fixa.
3. A comparação com a física deixa claro o que é fórmula pura e o que é curva **calibrada**.
4. A regra "e caindo" (`EXIGIR_QUEDA`) foi mantida e agora consta no algoritmo.
5. As saídas explicam o corte preventivo, o alerta sem corte e o motivo de quem não religou.
6. O campo `estado` agora gera **alerta de falha**, e uma medição real de eólica entra no histórico e refaz a reta.

### O que mudou da versão 1 para a 1.1 (debate de 03/11/2026)
1. O consumo de cada módulo passou a variar **por hora** (perfil de uso), em vez de ser um valor fixo.
2. Entrou a **anomalia**: setor consumindo mais de 30% acima do esperado para aquela hora. Ela só **avisa**; não corta sozinha.
3. No corte de cargas, se a anomalia está num setor **não essencial**, **quem causou sai primeiro**.
4. O coração do preditivo virou a **projeção da bateria em 3h**, refeita de 1 em 1 hora: **≥ 70%** libera, **< 70%** corta na hora e explica o motivo.
5. A previsão passou a ser **híbrida**: solar pela **curva do dia** × `fator_poeira`; eólica pela **reta** do enunciado.
6. Na tempestade, o solar cai para cerca de **5%** do normal e o vento sobe a **20 m/s**.
7. O preditivo planeja **com a reta**, que é conservadora; o modelo físico (v³) entra no PDF como comparação.
8. Nova ordem de prioridade: **Energia 1**, **Habitação e Médico 2**, Logística 3, Laboratório 4.
9. Consumo pela **ideia do prédio**: níveis baixo/médio/alto e a jornada (8h–9h chegada, 9h–18h expediente, 18h–20h depois).
10. Noite, bateria e sol dimensionados por conta: 70% às 20h garante a noite; pico solar de 140 kW.
11. **Duas colônias** (A: 440 kWh, B: 1100 kWh; B é a padrão) × **duas tempestades** (manhã e tarde) = 4 simulações.
12. Corte também pela situação (CRÍTICO / ECONOMIA → todos os não essenciais).
13. Religar com histerese híbrida (≥ 2h e ≥ 80%) e "faz de conta" da situação.
14. Sem NumPy.

---

## 1. Objetivo

Manter a colônia em Marte funcionando sozinha. O sistema:
1. **organiza** os dados dos sensores;
2. **prevê** a geração de energia das próximas horas (solar e eólica);
3. **projeta** como a bateria vai estar daqui a 3 horas;
4. **decide** o que fazer, protegendo sempre o suporte à vida e guardando energia para a noite;
5. **explica** cada decisão (entrada → regra → saída).

A ideia que guia tudo: **sair de um sistema reativo** (que age depois que o problema acontece) **para um sistema preditivo** (que age antes de a reserva ficar perigosa).

---

## 2. Visão geral do fluxo

```text
           ENTRADA                     PROCESSAMENTO                           SAÍDA
┌────────────────────────┐   ┌────────────────────────────────┐   ┌──────────────────────────┐
│ Cenário escolhido pelo │   │ 1. Validar dados               │   │ Situação: NORMAL / ALERTA│
│ avaliador (menu)       │   │ 2. Detectar anomalias          │   │  / ECONOMIA / CRÍTICO    │
│  - hora                │──▶│ 3. Prever geração (próx. 3h)   │──▶│ Avisos de anomalia       │
│  - bateria (%)         │   │    solar: curva × poeira       │   │ Bateria projetada em 3h  │
│  - geração solar       │   │    eólica: reta vento→energia  │   │ Ações: módulos desligados│
│  - vento, temperatura  │   │ 4. Projetar a bateria em 3h    │   │ Motivo de cada ação      │
│  - consumo dos módulos │   │ 5. Regras de decisão           │   │ Registro no diário       │
│ Histórico (listas)     │   │ 6. Cortar ou religar cargas    │   │ Dados para o painel      │
└────────────────────────┘   └────────────────────────────────┘   └──────────────────────────┘
```

---

## 3. Estruturas de dados

### 3.1 Limites (constantes com nome)
| Nome | Valor | Significado |
|---|---|---|
| ENERGIA_CRITICA | 20 % | Abaixo disso, a bateria está em nível crítico |
| ENERGIA_BAIXA | 50 % | Abaixo disso, a bateria está baixa (valor do enunciado) |
| CONSUMO_ALTO | 80 kW | Acima disso, o consumo total é alto |
| RESERVA_MINIMA_PROJETADA | 70 % | A bateria projetada em 3h precisa ficar nesse nível ou acima |
| JANELA_PREVISAO | 3 h | Até onde o preditivo olha para frente |
| LIMITE_ANOMALIA | 30 % | Acima do esperado para a hora, o consumo do setor é anomalia |
| FATOR_POEIRA_TEMPESTADE | 0,05 | Na tempestade, o solar fica em 5% do normal |
| VENTO_TEMPESTADE | 20 m/s | Vento durante a tempestade |
| NASCER_SOL / POR_DO_SOL | 6 h / 18 h | Limites da curva solar |
| PICO_SOLAR | 140 kW | Geração solar ao meio-dia com céu limpo (equilíbrio do dia ≈ 126 kW + folga) |
| MARGEM_RELIGAR | 80 % | Só religa se a projeção com o módulo ligado ficar nesse nível ou acima |
| TEMPO_MINIMO_DESLIGADO | 2 h | Tempo mínimo fora antes de poder religar |
| EXIGIR_QUEDA | verdadeiro | P exige que a projeção, além de ficar abaixo de 70%, esteja abaixo da bateria atual |
| capacidade_kwh | Colônia A: 440 kWh · Colônia B: 1100 kWh | Duas colônias, com piso de 20% e de 50% ao amanhecer (seção 3.3). No texto, CAPACIDADE_BATERIA |
| DENSIDADE_AR_MARTE / AREA_PAS | 0,020 kg/m³ / 120 m² | Usadas na fórmula pura da potência eólica (hipóteses didáticas) |

Por que o consumo alto fica acima de 80: no enunciado, energia 40 com consumo 70 precisa dar `ALERTA: reduzir consumo`, e não modo economia. Então 70 não pode contar como consumo alto.
⚠️ Na versão 1, a soma de todos os módulos dava no máximo 75 kW, e por isso o consumo **nunca** passava de 80. Com o consumo variando por hora, o expediente chega a 91 kW (seção 3.3).

### 3.2 Colônia: dicionário em árvore (tabela hash + hierarquia)
```text
colonia
├── energetico
│   ├── solar    → geracao_kw, pico_kw
│   ├── eolico   → geracao_kw, vento_m_s, area_pas_m2
│   └── bateria  → nivel_pct, capacidade_kwh, piso_pct
├── ambiental    → temp_interna_c, temp_externa_c, vento_m_s, tempestade (sim/não)
└── operacional
    └── modulos
        ├── Energia      prioridade 1 · essencial (mantém os outros vivos)
        ├── Habitação    prioridade 2 · essencial (suporte à vida)
        ├── Médico       prioridade 2 · essencial (suporte à vida)
        ├── Logística    prioridade 3 · não essencial
        └── Laboratório  prioridade 4 · não essencial
    └── alertas_de_falha  lista com os módulos em falha na última leitura
```
Cada módulo guarda:
- `ligado` (verdadeiro/falso), `desligado_desde` e `estado` ("ok" ou "falha"; a falha só avisa, seção 5.7);
- `consumo_atual_kw`: o que o sensor leu agora;
- `perfil_kw`: lista com o consumo **esperado** em cada hora (seção 3.3).

Habitação e Médico têm a **mesma prioridade (2)**. Como os dois são essenciais e nunca são desligados, o empate não muda nenhuma decisão. Só a ordem para **religar** depende disso.
Os cinco módulos são os mesmos que pousaram na Fase 2.

### 3.3 Perfil de consumo por hora
A colônia muda ao longo do dia:
- **de dia**, a Habitação fica mais vazia, porque todos estão nos postos de trabalho;
- **de dia**, Logística, Médico e Laboratório gastam mais.

**A ideia do prédio:** cada módulo é um andar, cada andar tem salas e atividades, e cada atividade soma na conta do prédio. As pessoas estão num lugar de cada vez: quando Laboratório e Logística enchem, a Habitação esvazia, e vice-versa.

**Níveis de uso (kW)** — baixo = só se manter ativo · médio = uso moderado · alto = a todo vapor
| Andar | Baixo | Médio | Alto | Exemplo do que gasta |
|---|---|---|---|---|
| Energia | 5 | 5 | 5 | controle e conversão, sempre igual |
| Habitação | 15 | 22 | 30 | oxigênio e aquecimento (nunca abaixo de 15) / iluminação, cozinha |
| Médico | 10 | 12 | 14 | pouca variação: escalas e atendimento recorrente |
| Logística | 5 | 12 | 22 | sensores / esteiras / veículos e guindastes |
| Laboratório | 5 | 15 | 30 | freezers e amostras / bancadas / experimento grande |

**Jornada da colônia:** dia de trabalho das **8h às 20h**, expediente das **9h às 18h**.
```text
EXPEDIENTE (9h–18h)   Energia 5 + Habitação médio 22 + Médico médio 12 + Logística alto 22 + Laboratório alto 30 = 91 kW
DEPOIS (18h–20h)      Energia 5 + Habitação alto 30  + Médico médio 12 + Logística médio 12 + Laboratório médio 15 = 74 kW
ANTES (8h–9h)         chegada e preparação: Energia 5 + Habitação alto 30 + Médico médio 12 + Logística médio 12 + Laboratório médio 15 = 74 kW
```
- O expediente (91 kW) passa de CONSUMO_ALTO (80): A volta a disparar.
- Depois do expediente, Logística e Laboratório caem para o médio, que é cerca da **metade** do alto.
- "Alto" é **planejado** e não é anomalia. Anomalia é passar 30% do nível esperado da hora (Laboratório em alto: só acima de 39 kW).
- O fim do expediente (18h) coincide com o pôr do sol: a colônia ainda está em 91 kW quando o solar chega a zero.

```text
perfil_kw[modulo] = lista com um valor para cada uma das 24 horas, montada a partir dos níveis acima
```

**A noite e o tamanho da bateria.** O dia de trabalho acaba às 20h, mas a colônia precisa durar até o sol voltar (≈ 6h), ou seja, 10h só com vento e bateria.
```text
NOITE (20h–6h, dormindo)  Energia 5 + Habitação médio 22 + Médico baixo 10 (plantão) + Logística baixo 5 + Laboratório baixo 5 = 47 kW
eólica (vento 10 m/s pela reta)                                                                                               = 25 kW
falta por hora: 22 kW × 10 h = 220 kWh   →   70% da capacidade = 220 kWh   →   CAPACIDADE_BATERIA ≈ 315 kWh
```
⚠️ **Correção:** essa primeira conta gastava os 70% inteiros e amanhecia com a bateria em ≈ 0% (crítico toda madrugada). A noite precisa gastar só o trecho **entre os 70% e um piso**. Como o piso muda o comportamento do sistema inteiro, são **duas colônias**:

| | Colônia A — bateria pequena | Colônia B — bateria grande |
|---|---|---|
| Piso ao amanhecer | 20% (limite do crítico) | 50% (limite do "baixa") |
| Capacidade | 220 ÷ (0,70 − 0,20) = **440 kWh** | 220 ÷ (0,70 − 0,50) = **1100 kWh** |
| Bateria às 8h (piso + ≈ 39 kWh do sol das 6h às 8h, pela área da curva; valor fixo no código) | ≈ 29% | ≈ 53% |
| Comportamento | **subdimensionada**: vive no limite, ALERTA às 8h e MODO ECONOMIA às 9h mesmo em dia limpo | **bem dimensionada**: manhã normal; o perigo é a projeção furar a linha dos 70% |
| Peso da tempestade (≈ 108 kWh) | ≈ 25% da bateria | ≈ 10% da bateria |

Para o PDF: **o tamanho da bateria muda o comportamento do sistema inteiro.**
**O pico solar.** Num dia limpo, a geração precisa cobrir as 24h:
```text
consumo do dia: noite 20h–8h 12 h × 47 = 564 · chegada 74 · expediente 9 h × 91 = 819 · pós-expediente 2 h × 74 = 148  →  1605 kWh
eólica: 24 h × 25 kW = 600 kWh   →   o solar precisa cobrir 1005 kWh
energia da curva solar no dia = 8 × pico (área da parábola: 12 h de sol rendem o mesmo que 8 h no pico)
equilíbrio: pico ≈ 126 kW   →   escolhido: 140 kW (folga de ≈ 115 kWh por dia limpo)
```
Com a bateria cheia, essa folga não tem onde ficar: é o "possível desperdício" do enunciado (`SUGESTÃO: armazenar energia excedente`).

**Por que 70%:** é o nível que, às 20h, garante a noite inteira. Como a projeção de 3h roda toda hora, a das **17h** já olha até as 20h. Assim, a regra "projeção ≥ 70%" protege a noite sem precisar de uma janela maior.
**Exemplos de anomalia** (consumo acima do perfil + 30%):
- Laboratório: um experimento de grande porte;
- Logística: um deslocamento grande de recursos;
- Médico: muitos atendimentos depois de um acidente.

### 3.4 Histórico: listas paralelas (a mesma posição é a mesma leitura)
```text
vento          = [8, 10, 12]            m/s   (enunciado)
energia_eolica = [20, 25, 30]           kW    (enunciado)
```
Quando uma leitura traz a eólica **medida** (`eolica_medida_kw`), o par entra no histórico e a reta é refeita (cenário 21). A simulação não usa medições, então nela a reta continua a do enunciado.

### 3.5 Diário de decisões: lista
Cada decisão é guardada como um registro com: hora, entrada, anomalias, bateria projetada, regra usada, situação, ações e motivo.

---

## 4. Algoritmo principal

Os parâmetros aqui estão simplificados para facilitar a leitura. Os exatos estão no código, em `sistema.py`.

```text
ALGORITMO ColoniaAurora
INÍCIO
    colonia   ← criar_colonia()
    historico ← criar_historico()
    diario    ← lista vazia

    // 1. ENTRADA — o avaliador escolhe o cenário num menu
    cenario ← escolher_cenario()
    leitura ← cenario.leitura
    SE NÃO validar(leitura) ENTÃO
        ESCREVA "ERRO: leitura inválida —", motivo
        ENCERRE
    FIM SE
    SE a leitura traz eólica medida ENTÃO acrescentar ao historico
    (β0, β1)  ← ajustar_reta(historico.vento, historico.energia_eolica)
    qualidade ← r2(historico.vento, historico.energia_eolica, β0, β1)
    atualizar a colonia com a leitura

    // 2. ANOMALIAS E FALHAS (só avisam)
    anomalias ← detectar_anomalias(colonia.operacional.modulos, leitura.hora)
    falhas    ← detectar_falhas(colonia.operacional.modulos)

    // 3. PREVISÃO HÍBRIDA + PROJEÇÃO
    fator    ← fator_poeira(leitura.geracao_solar, leitura.hora)
    projecao ← projetar_bateria(colonia, leitura, β0, β1, fator)

    // 4. ENERGIA
    geracao ← geracao_total(colonia)
    consumo ← consumo_total(colonia.operacional.modulos)
    mensagem_balanco ← balanco(geracao, consumo)

    // 5. DECISÃO
    situacao ← decidir(leitura.bateria, consumo, projecao)

    // 6. AÇÃO
    SE situacao = "CRÍTICO" OU situacao = "MODO ECONOMIA" ENTÃO
        acoes ← cortar_cargas(colonia, leitura, anomalias, β0, β1, fator, modo = "todos")
    SENÃO SE P ENTÃO                                           // projeção < 70% e caindo
        acoes ← cortar_cargas(colonia, leitura, anomalias, β0, β1, fator, modo = "até 70%")
    SENÃO
        acoes ← religar_cargas(colonia, leitura, β0, β1, fator)   // histerese, seção 8.5
    FIM SE

    // 7. SAÍDA
    observacao ← explicar quando situação e ação parecem discordar (seção 8.7)
    exibir_relatorio(leitura, anomalias, falhas, β0, β1, qualidade, projecao,
                     mensagem_balanco, situacao, observacao, acoes)
    registrar(diario, leitura, anomalias, projecao, situacao, acoes)
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
Exemplo: `buscar(colonia, "energetico/bateria/nivel_pct")` → 53 (Colônia B às 8h).

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
Soma o `consumo_atual_kw` apenas dos módulos com `ligado = verdadeiro`.

### 5.4 geracao_total(colonia) → kW
Geração solar + geração eólica.

### 5.5 validar(leitura) → (verdadeiro/falso, motivo)
```text
SE a leitura não é dicionário          → RETORNE falso
PARA CADA campo obrigatório FAÇA
    SE falta o campo                   → RETORNE falso ("falta o campo")
    SE não é número finito             → RETORNE falso ("não é numérico")   // rejeita NaN e infinito
    SE é negativo (exceto temperatura) → RETORNE falso ("é negativo")
FIM PARA
SE hora não é inteira de 0 a 23        → RETORNE falso
SE bateria > 100                       → RETORNE falso ("bateria fora de 0–100")
SE solar > PICO_SOLAR                  → RETORNE falso ("solar acima do pico")
SE consumo_kw, desligados ou estados têm tipo errado ou módulo desconhecido → RETORNE falso
SE desligados contém módulo essencial  → RETORNE falso        // segurança antes de prioridade
SE tempestade não é verdadeiro/falso ou eólica medida é inválida → RETORNE falso
RETORNE verdadeiro
```

### 5.6 detectar_anomalias(modulos, hora) → avisos
```text
avisos ← lista vazia
PARA CADA modulo LIGADO FAÇA
    esperado ← modulo.perfil_kw[hora]
    SE modulo.consumo_atual_kw > esperado × (1 + LIMITE_ANOMALIA) ENTÃO
        adicionar a avisos: "ANOMALIA: <módulo> consumindo X kW (esperado Y kW)"
    FIM SE
FIM PARA
RETORNE avisos
```
A anomalia **não corta nada sozinha**. Exemplo: o Laboratório a 40 kW (esperado 30) num dia de sol forte com a bateria a 90% continua ligado. Quem decide o corte é a projeção (seção 6.7).
Por que porcentagem e não kW fixo: +10 kW é o triplo na Energia (5 kW), mas menos da metade a mais na Habitação (22 kW). A porcentagem acompanha o tamanho de cada setor.

### 5.7 detectar_falhas(modulos) → avisos
Lista os módulos com `estado = "falha"`, grava em `operacional/alertas_de_falha` e mostra `FALHA: <módulo> informou defeito no equipamento`. Como a anomalia, a falha **só avisa**: não muda a situação nem corta nada.

---

## 6. Subalgoritmos de previsão (Cap 7) — modelo híbrido

### 6.1 media(lista) → soma ÷ quantidade

### 6.2 ajustar_reta(x, y) → (β0, β1) — mínimos quadrados
```text
SE tamanho(x) ≠ tamanho(y) OU tamanho(x) < 2 ENTÃO RETORNE nada
x̄ ← media(x);  ȳ ← media(y)
numerador   ← Σ (xi − x̄) · (yi − ȳ)
denominador ← Σ (xi − x̄)²
SE denominador ≈ 0 ENTÃO RETORNE nada    // todos os x iguais: não existe reta
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

### 6.6 Solar: curva do dia × fator de poeira (modelo físico)
Por que não uma reta: a geração solar **sobe de manhã e desce à tarde**. Uma reta ajustada no dia inteiro ficaria quase deitada e erraria justamente no fim da tarde, que é quando a noite precisa ser protegida. A curva reaproveita a parábola da Fase 2.

```text
solar_curva(h):
    SE h ≤ NASCER_SOL OU h ≥ POR_DO_SOL ENTÃO RETORNE 0       // noite
    RETORNE PICO_SOLAR × 4 · (h − NASCER_SOL) · (POR_DO_SOL − h) ÷ (POR_DO_SOL − NASCER_SOL)²
```
Com 6h e 18h, a curva vale 0 às 6h, 0,75 × pico às 9h, 1 × pico às 12h, 0,75 × pico às 15h e 0 às 18h.

A curva conhece o dia **limpo**, mas não conhece a tempestade. Para enxergar a poeira, o sistema compara o que foi medido com o que a curva esperava:
```text
fator_poeira(solar_medido, h):
    esperado ← solar_curva(h)
    SE esperado = 0 ENTÃO RETORNE 1          // à noite não há como medir a poeira
    RETORNE o menor entre 1 e solar_medido ÷ esperado   // 1 = céu limpo · 0,05 = tempestade
```
Hipótese: o fator medido agora **se mantém** pelas próximas 3h.
Base real: em 2018, uma tempestade global derrubou a geração do rover Opportunity em mais de 95%, e a missão terminou. A luz difusa impede que chegue a zero absoluto, por isso o fator da tempestade é 0,05.

### 6.7 projetar_bateria(colonia, leitura, β0, β1, fator) → % daqui a 3h
```text
bateria_kwh ← leitura.bateria ÷ 100 × CAPACIDADE_BATERIA
PARA k DE 0 ATÉ JANELA_PREVISAO − 1 FAÇA        // a hora atual e as duas seguintes (11.3, item 2)
    h        ← leitura.hora + k
    solar_k  ← solar_curva(h) × fator
    eolica_k ← prever(β0, β1, leitura.vento)           // hipótese: o vento atual se mantém por 3h
    consumo_k ← SE k = 0: Σ consumo MEDIDO dos ligados · SENÃO: Σ perfil_kw[h] dos ligados
    bateria_kwh ← bateria_kwh + (solar_k + eolica_k − consumo_k) × 1 h
    limitar bateria_kwh entre 0 e CAPACIDADE_BATERIA
FIM PARA
RETORNE bateria_kwh ÷ CAPACIDADE_BATERIA × 100
```
Hipóteses da projeção: o `fator_poeira` e o vento medidos agora **se mantêm** pelas próximas 3h.
Consequência: o preditivo percebe a tempestade **na primeira hora dela** (pelo fator medido). A partir daí, ele projeta as próximas 3h a cada hora e corta quando a projeção fura 70%: na 1ª hora na 9c, na 2ª na 9b e na 3ª na 9d. O reativo não corta durante a tempestade.

Esse é o **coração do preditivo**. Ele roda **de 1 em 1 hora**, sempre guardando reserva para quando a noite chegar e não houver recarga suficiente.

---

## 7. Subalgoritmos de energia (Cap 8)

### 7.1 potencia_eolica(ρ, A, v) → P = ½ · ρ · A · v³ — física × reta
A potência cresce com o cubo do vento: com o dobro de vento, há 8 vezes mais potência.

| Vento | Reta (regressão) | Curva v³ calibrada (10 m/s = 25 kW) | Fórmula pura (ρ = 0,020; A = 120 m²) |
|---|---|---|---|
| 10 m/s | 25 kW | 25 kW | 1,2 kW |
| 12 m/s | 30 kW | 43 kW | 2,1 kW |
| 20 m/s (tempestade) | **50 kW** | **200 kW** | 9,6 kW |

**O que cada coluna significa:**
- **Fórmula pura:** com o ar rarefeito de Marte e 120 m² de pás, a geração é pequena. Isso mostra que os 25 kW do enunciado são uma **hipótese didática**.
- **Curva calibrada:** aceita os 25 kW a 10 m/s como ponto de partida e aplica o crescimento com v³. Ela não é a fórmula pura.
- A opção `fis` do menu mostra as três colunas.

**Decisão da equipe:** o preditivo planeja **com a reta**.
- Em relação à curva calibrada, ela é **conservadora** (cresce menos no vento forte): o sistema corta mais cedo e protege a bateria. É a regra "segurança antes de prioridade".
- Com a curva calibrada, sobraria energia na tempestade e não haveria crise para o preditivo resolver.

**Para o PDF:**
- A reta foi ajustada com vento entre 8 e 12 m/s; usá-la a 20 m/s é **extrapolação**, ou seja, prever fora da faixa dos dados conhecidos.
- Sugestão de redação: *"partindo dos 25 kW do enunciado, uma curva proporcional a v³ indica geração maior no vento forte; optamos pela reta por ser conservadora em relação a essa curva, priorizando a segurança da bateria e permitindo simular a crise"*.
- Limitações: turbinas reais têm um teto de potência; e o ar de Marte (≈ 1% do da Terra) torna os valores do enunciado didáticos.
- Base real: há estudos que propõem o vento como complemento ao solar em Marte, justamente à noite e nas tempestades. É o argumento do sistema híbrido.

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
A bateria aparece **separada**: geração de um lado, reserva do outro (decisão da reunião).

---

## 8. Subalgoritmos de decisão (Caps 2 e 3)

### 8.1 Variáveis lógicas
| Letra | Pergunta | Verdadeira quando |
|---|---|---|
| C | A bateria está crítica? | bateria < 20 |
| B | A bateria está baixa? | bateria < 50 |
| A | O consumo total está alto? | consumo > 80 |
| P | A projeção é desfavorável? | bateria projetada em 3h < 70% **e caindo** (ver 11.3, item 1) |

(Na versão 1, P era "geração prevista < consumo". Agora ela usa a projeção da seção 6.7.)

### 8.2 Expressões booleanas
```text
ECONOMIA   = B · A
RISCO      = B · A · P
EMERGÊNCIA = C + RISCO
```
**Simplificação (lei da absorção):** B·A + B·A·P = B·A.
Ou seja, todo caso de RISCO também é um caso de ECONOMIA. Por isso o teste do RISCO precisa vir **antes** no `SE/SENÃO SE`; caso contrário, ele nunca seria alcançado.

### 8.3 decidir(bateria, consumo, projecao) → situação
```text
C ← bateria < ENERGIA_CRITICA
B ← bateria < ENERGIA_BAIXA
A ← consumo > CONSUMO_ALTO
P ← projecao < RESERVA_MINIMA_PROJETADA E projecao < bateria     // abaixo de 70% e caindo

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

### 8.4 cortar_cargas(colonia, leitura, anomalias, β0, β1, fator, modo) → ações
O corte é disparado de dois jeitos (seção 4):
- **pela situação** (CRÍTICO ou MODO ECONOMIA), com `modo = "todos"`: desliga **todos** os não essenciais, como o nome da situação diz;
- **só pela projeção** (P: < 70% e caindo), com `modo = "até 70%"`: desliga um por vez e para assim que a projeção volta a ≥ 70%.

```text
acoes ← lista vazia
fila  ← módulos NÃO essenciais EM ANOMALIA primeiro       // quem causou sai primeiro
         + demais NÃO essenciais da MENOR prioridade para a MAIOR (Laboratório → Logística)
PARA CADA modulo NA fila FAÇA
    SE modo = "até 70%" E projetar_bateria(...) ≥ RESERVA_MINIMA_PROJETADA ENTÃO PARE
    modulo.ligado ← falso
    adicionar a acoes: "Desligado: <módulo> — motivo: <situação, anomalia ou bateria projetada em X%>"
FIM PARA
SE houve corte E o sistema projeta E projetar_bateria(...) < RESERVA_MINIMA_PROJETADA ENTÃO
    adicionar a acoes: "ATENÇÃO: só restou o suporte à vida; reserva projetada em X%"
FIM SE
RETORNE acoes
```
- Energia, Habitação e Médico são **essenciais** e **nunca** entram na fila.
- Anomalia no **Médico** (essencial): ele não pode ser cortado, então vale a ordem de prioridade (Laboratório → Logística).
- Anomalia na **Logística**: ela sai antes do Laboratório, que estava gastando normalmente.
- No modo "até 70%", o corte para assim que a projeção volta a ≥ 70%.

Regra herdada das Fases 1 e 2: **segurança antes de prioridade**.

### 8.5 religar_cargas(...) → ações
Quando a energia voltar, o sistema religa sozinho, **do mais importante para o menos importante** (Logística → Laboratório).
**Histerese híbrida**, para o módulo não ficar ligando e desligando toda hora em volta da linha dos 70%:
```text
PARA CADA modulo desligado, DO MAIS importante PARA O MENOS FAÇA
    SE modulo está desligado há ≥ 2 h                                  // tempo mínimo
       E projetar_bateria(com o modulo ligado) ≥ 80%                   // margem: zona morta entre 70% e 80%
       E situacao_se_religar não é CRÍTICO nem MODO ECONOMIA           // "faz de conta" que religou
    ENTÃO
        modulo.ligado ← verdadeiro
        adicionar a acoes: "Religado: <módulo> — projeção em X%"
    FIM SE
FIM PARA

onde:
    consumo_se_religar  ← consumo atual + consumo do módulo
    situacao_se_religar ← decidir(bateria, consumo_se_religar, projeção com o módulo ligado)
```
O "faz de conta" liga o módulo, mede e **desfaz tudo** se alguma condição falhar. Ele evita o pisca-pisca pela situação (ECONOMIA desliga → consumo cai abaixo de 80 → ALERTA → religa → ECONOMIA de novo). O cenário 18 mostra isso: a Logística religa, e o Laboratório, que faria voltar o MODO ECONOMIA, fica fora.

### 8.6 Tabela-verdade resumida
| C | B | A | P | Situação |
|---|---|---|---|---|
| 1 | – | – | – | CRÍTICO |
| 0 | 1 | 1 | 1 | CRÍTICO |
| 0 | 1 | 1 | 0 | MODO ECONOMIA |
| 0 | 1 | 0 | – | ALERTA |
| 0 | 0 | – | – | NORMAL |

### 8.7 Quando a situação e a ação parecem discordar
A situação olha o **agora**; a projeção olha as próximas 3 horas. Por isso a saída traz uma observação em dois casos:
- **NORMAL com corte:** `CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia`.
- **ALERTA sem corte:** `Sem corte agora: a projeção de X% não pede corte`, ou `Sem corte agora: os módulos não essenciais já estão desligados` (no reativo: `Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA`).

Nos cenários, quando o sistema tenta religar e não consegue, a saída mostra `Aguardando: <módulo> — <motivo>`.

---

## 9. Reativo × preditivo (o cenário que mostra o valor do sistema)

Simulação de um dia marciano (8h às 20h) com uma **tempestade de poeira de 3 horas**, seguida da **noite até as 6h**, hora a hora, com o sistema ainda decidindo.
Durante a tempestade: solar a **5%** do normal (`fator_poeira` = 0,05) e vento a **20 m/s**.
Na tempestade, faltam ≈ 36 kW por hora (solar ≈ 5 + eólica 50 = 55 kW contra 91 kW do expediente), o que dá ≈ 108 kWh em 3h.

São **duas tempestades**:
| Tempestade | Horário | Depois dela | O que mostra |
|---|---|---|---|
| Manhã | 10h–13h | ainda há sol forte à tarde para recarregar | a colônia apanha e se **recupera**; o religar entra em cena |
| Tarde | 14h–17h | o sol se põe às 18h, sem tempo de recarregar | chegar às 20h com 70% para **sobreviver à noite**: o teste mais duro do preditivo |

Elas são cruzadas com as **duas colônias** da seção 3.3, o que dá **4 simulações**, cada uma com reativo × preditivo:
| Simulação | Colônia | Tempestade |
|---|---|---|
| 9a | A (440 kWh) | Manhã |
| 9b | A (440 kWh) | Tarde |
| 9c | B (1100 kWh) | Manhã |
| 9d | B (1100 kWh) | Tarde |

```text
PARA CADA hora DA simulação FAÇA
    REATIVO:   olha só a hora ATUAL (bateria, geração e consumo de agora)
    PREDITIVO: projeta a bateria nas próximas 3h (seção 6.7) e corta se a projeção < 70% e caindo
    aplicar as ações de cada um na sua própria colônia
    atualizar cada bateria: bateria ← bateria + (geração − consumo) ÷ capacidade × 100
    guardar as duas linhas para o painel
FIM PARA
comparar: bateria às 20h e ao amanhecer, horas em CRÍTICO, menor bateria, módulo-horas desligados
```
**Resultados reais** (bateria às 20h e às 6h; módulo-horas = módulos desligados × horas, de 8h a 6h):
| Simulação | Reativo 20h → 6h | Preditivo 20h → 6h | Horas em CRÍTICO (reat. × pred.) | Módulo-horas (reat. × pred.) |
|---|---|---|---|---|
| 9a | 72,4% → 22,4% | 79,3% → 52,0% | 0 × 0 | 8 × 30 |
| 9b | 48,0% → **7,1%** | 78,0% → 50,7% | **4** × 0 | 12 × 30 |
| 9c | 64,5% → 44,5% (abaixo do piso) | 74,7% → 63,4% | 0 × 0 | 4 × 28 |
| 9d | 63,1% → 43,1% (abaixo do piso) | 73,5% → 62,6% | 0 × 0 | 0 × 26 |

Como ler:
- O preditivo age **durante** a tempestade, assim que a projeção fura 70%: na 1ª hora na 9c, na 2ª na 9b e na 3ª na 9d. Na 9a os módulos já estavam fora desde as 9h, por MODO ECONOMIA.
- De dia, nenhum sistema chega ao CRÍTICO. A diferença aparece à **noite**: na 9b o reativo entra em CRÍTICO às 2h.
- O preditivo paga um preço: mantém módulos desligados por mais tempo.
- A conta de 220 kWh (seção 3.3) é só o **dimensionamento** da bateria. O amanhecer vem da simulação.
- À noite a bateria cai por projeto, então a regra dos 70% segue valendo e o preditivo mantém os não essenciais desligados. Por isso a maior parte dos módulo-horas dele é de madrugada, quando eles gastam só 5 kW cada.

---

## 10. Visual: painel HTML e PDF

### 10.1 Algoritmo do painel (contrato entre o código e o visual)
```text
1. Python roda todos os cenários (seção 12) e a simulação da seção 9.
2. painel.py grava tudo em painel/dados.js.
3. O HTML lê dados.js e SÓ MOSTRA, sem recalcular nada.
4. README, PDF e painel usam os mesmos números.
```

### 10.2 Ideia: "A colônia que vê o futuro"
É o Centro de Operações da Colônia, continuação visual das salas de controle das Fases 1 e 2.

| Tela | Conteúdo | Critério que mostra |
|---|---|---|
| 1. Abertura | Linha do tempo: decolagem → pouso → colônia; frase "de reativo para preditivo" | História |
| 2. Mapa vivo | A árvore da seção 3.2 desenhada; ao clicar num nó, mostra a chave e o valor | Estruturação de dados |
| 3. Energia | Medidor da bateria (atual e projetada em 3h), solar e eólica, consumo e barra de balanço; módulos como luzes, anomalias piscando, suporte à vida com cadeado 🔒 | Uso de energia |
| 4. Previsão | Curva solar com a poeira; gráfico vento × energia com a reta, β0, β1 e R²; comparação reta × física; seletor de vento mostrando ŷ | Modelagem e previsão |
| 5. Reativo × Preditivo | Tela dividida, mesma tempestade nas duas metades, do dia à madrugada; seletor de tempestade (manhã/tarde) e de colônia (A/B); placar no fim | O "uau" da apresentação |
| 6. Diário | Cada decisão com hora, entrada, anomalias, projeção, regra usada e motivo | Lógica de decisão |

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
3. Como os dados foram organizados (árvore, perfis por hora e trecho do dicionário).
4. Regras de decisão (seção 8: variáveis, simplificação, tabela, anomalia e corte).
5. Modelo de previsão: híbrido (curva solar × poeira + reta eólica), teste de mesa da 6.5, R² e **física × reta** (seção 7.1).
6. Como o sistema melhora o uso de energia (resultado da seção 9).
7. Exemplos reais de entrada e saída e limites do protótipo (extrapolação, ar rarefeito, poeira constante em 3h).

### 10.5 Apresentação (cerca de 3 minutos)
Problema (a Terra está longe, a colônia decide sozinha) → mapa vivo → diário de decisões → previsão híbrida → clímax reativo × preditivo.

**Divisão:** Marcelo e Douglas fazem o código (seções 4 a 9). Alice faz o painel e o PDF (seção 10).

---

## 11. Pontos de decisão

### 11.1 Já decididos
| # | Ponto | Decisão |
|---|---|---|
| 1 | Geração prevista | Híbrida: solar pela curva × `fator_poeira`; eólica pela reta (seções 6.6 e 6.7) |
| 2 | Duração da simulação | Dia de 12h (8h às 20h) com tempestade de 3h; na 1.2, a simulação segue pela noite até as 6h |
| 3 | Prioridades | Energia 1 · Habitação e Médico 2 · Logística 3 · Laboratório 4 |
| 4 | Bateria no balanço | Entra como reserva, **separada** da geração |
| 5 | Religar módulos | Sim, sozinho, do mais importante para o menos |
| 6 | Entrada | Cenários prontos; o avaliador escolhe num menu |
| 8 | Consumo | Varia por hora (perfil); anomalia = > 30% acima do esperado, só avisa |
| 9 | Corte | Não essencial em anomalia sai primeiro; depois a ordem de prioridade |
| 10 | Preditivo | Projeção de 3h, de 1 em 1h; ≥ 70% libera, < 70% e caindo corta e explica |
| 11 | Tempestade | Solar a 5%, vento a 20 m/s |
| 12 | Física × reta | Planeja com a reta (conservadora em relação à curva v³ calibrada); a comparação entra no PDF |
| 13 | Gatilho do corte | Pela situação (CRÍTICO / ECONOMIA → todos os não essenciais) **ou** pela projeção (< 70% e caindo → até voltar a 70%) |
| 14 | Vento na projeção | O vento atual se mantém pelas próximas 3h |
| 15 | Jornada | Dia de trabalho 8h–20h; chegada 8h–9h (74 kW), expediente 9h–18h (91 kW), depois 18h–20h (74 kW) |
| 16 | Noite | Perfil dormindo 47 kW; 70% às 20h garante até as 6h (primeira conta deu 315 kWh; corrigida pelo item 19) |
| 17 | Pico solar | 140 kW (equilíbrio ≈ 126 kW + folga) |
| 18 | Tempestades | Duas: manhã (10h–13h) e tarde (14h–17h) |
| 19 | Colônias | A (440 kWh, piso 20%) e B (1100 kWh, piso 50%) → 4 simulações (9a–9d) |
| 20 | Colônia padrão | **B** em todos os cenários, exceto o 18 (com a A, a bateria baixa de toda manhã contaminaria os testes) |
| 21 | Histerese | Religa só depois de ≥ 2h desligado **e** com a projeção ≥ 80% com o módulo ligado |
| 22 | Religar × situação | Antes de religar, simula a situação com o módulo ligado; se der CRÍTICO / ECONOMIA, não religa |
| 7 | NumPy | **Não usar em lugar nenhum.** Regressão à mão (Cap 7); os testes comparam com o teste de mesa da 6.5; roda com Python puro |

### 11.2 Em aberto
Nenhum ponto em aberto.

### 11.3 Decisões técnicas tomadas ao codar (04/11/2026), mantidas em 05/11/2026
O código foi montado em 04/11 a pedido do Douglas. Estes pontos não estavam fechados e precisaram de uma escolha. Na auditoria, Marcelo pediu para manter as decisões do Douglas:

1. **P = projeção < 70% E bateria caindo** (`EXIGIR_QUEDA = True` em `dados.py`). Pela regra literal (só "< 70%"), a Colônia B, que começa às 8h com 53% por projeto, cortaria o Laboratório **toda manhã de céu limpo**, com a bateria subindo. A frase original da reunião ("caso **abaixe** ele corta") sustenta essa leitura. Com `False`, vale a regra literal, mas 10 testes supõem `True` e precisam mudar junto.
2. **Janela de 3h = a hora atual + as duas seguintes.** É o que faz a projeção das 17h cobrir 17h–20h, como a seção 3.3 promete.
3. **Na hora atual, a projeção usa o consumo MEDIDO**; nas seguintes, o perfil. Sem isso, uma anomalia acontecendo agora nunca entraria na conta da bateria.
4. **O reativo** usa as mesmas regras, mas sem projeção: o P dele é "geração atual < consumo atual". Ele corta só pela situação (CRÍTICO/ECONOMIA) e religa com tempo mínimo e "faz de conta" da situação.
5. **Depois das 20h vale o perfil da noite** (47 kW), para a projeção das 18h e das 19h olhar para dentro da noite.
6. **O "mundo" da simulação usa a reta** para a eólica (a mesma do planejamento). Com a curva calibrada, não haveria crise (seção 7.1).
7. **Fim do dia:** o resumo diz com quanto a bateria **amanhece** às 6h e se fica acima do piso da colônia. Na 1.2, esse valor vem da simulação da noite, e não mais de uma conta fixa.
8. **Cenários ajustados** para caber nos números reais: no 5, a previsão favorável é "bateria subindo"; no 6, a desfavorável é "tempestade, caindo". No 18, o correto é religar **só a Logística**: ela sozinha dá 61 kW, abaixo de 80; com o Laboratório junto daria 91 kW e voltaria o MODO ECONOMIA. Entrou o cenário 19 (religa quando há folga). Na 1.2 entraram o 20 (falha) e o 21 (medição no histórico).

---

## 12. Cenários de teste (o que cada caso precisa mostrar)

| # | Entrada | Saída esperada | Origem |
|---|---|---|---|
| 1 | bateria 40, consumo 70 | `ALERTA: reduzir consumo` | Enunciado |
| 2 | geração 40, consumo 70 | `ALERTA: consumo maior que geração` | Enunciado |
| 3 | geração 80, consumo 30 | `SUGESTÃO: armazenar energia excedente` | Enunciado |
| 4 | vento 11 | ŷ = 27,5 (β1 = 2,5; β0 = 0; R² = 1) | Enunciado |
| 5 | bateria 40, consumo 91, bateria subindo (projeção 59,4%) | `MODO ECONOMIA` + Laboratório **e** Logística desligados (corte pela situação) | Equipe |
| 6 | bateria 40, consumo 91, tempestade, bateria caindo | `CRÍTICO` (B·A·P) | Equipe |
| 7 | bateria 15 | `CRÍTICO`; só o suporte à vida fica ligado | Equipe |
| 8 | bateria 85, consumo 50 | `NORMAL` | Equipe |
| 9a | Colônia A, tempestade da manhã | módulos já fora desde as 9h (ECONOMIA); recarrega à tarde, religa às 13h | Equipe |
| 9b | Colônia A, tempestade da tarde | o preditivo corta às 15h e chega às 20h com ≥ 70%; o reativo entra em CRÍTICO de madrugada | Equipe |
| 9c | Colônia B, tempestade da manhã | o preditivo corta às 10h (1ª hora) e amanhece acima do piso; o reativo, não | Equipe |
| 9d | Colônia B, tempestade da tarde | o preditivo corta às 16h e amanhece acima do piso; o reativo, não | Equipe |
| 10a / 10b | bateria −5 / vento "abc" | Mensagem de erro, sem quebrar | Equipe |
| 11 | Laboratório 40 kW (esperado 30), bateria 90%, sol forte | `ANOMALIA` avisada, **nada desligado** | Equipe |
| 12 | Logística em anomalia, projeção < 70% | Logística desligada **antes** do Laboratório | Equipe |
| 13 | Médico em anomalia, projeção < 70% | Médico **segue ligado**; corta Laboratório → Logística | Equipe |
| 14 | sol 12h, tempestade (solar medido = 5% da curva) | `fator_poeira` = 0,05 | Equipe |
| 15 | hora noturna (curva = 0) | `fator_poeira` = 1, sem divisão por zero | Equipe |
| 16 | módulo desligado há 1h, energia sobrando | **não** religa (tempo mínimo de 2h) | Equipe |
| 17 | desligado há 2h, projeção com ele ligado 78,4% | **não** religa (zona morta 70–80%) | Equipe |
| 18 | Colônia A, Laboratório e Logística desligados por ECONOMIA, projeção boa | religa **só a Logística** (61 kW); com o Laboratório, a situação voltaria a ECONOMIA | Equipe |
| 19 | desligado há 2h, energia sobrando | religa | Equipe |
| 20 | Logística com estado "falha" | `FALHA` avisada; situação segue NORMAL | Equipe |
| 21 | medição real: vento 14 m/s rendeu 32 kW | entra no histórico; a reta muda e o R² cai para 0,97 | Equipe |

Todos os cenários usam a Colônia B (padrão), exceto o 18 e as simulações 9a e 9b.
Cada linha é conferida por testes automáticos. Nada é entregue com teste falhando.
