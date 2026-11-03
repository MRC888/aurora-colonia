# Receita do sistema — Colônia Aurora (Fase 3)

Esta é a **receita de bolo** do projeto: o algoritmo em português, passo a passo, antes de virar código.
Toda função do Python nasce de um passo daqui. Se a regra mudar, muda **aqui primeiro** e depois no código.

> Os valores marcados com **[A CONFIRMAR]** são sugestões. A equipe decide antes de codar o marco.

---

## 0. Ingredientes (o que usamos e por quê)

| Ingrediente | Capítulo | Para quê |
|---|---|---|
| Dicionário (`dict`) | Cap 4 | Achar qualquer dado pela chave, rápido (tabela hash) |
| Dicionário dentro de dicionário | Cap 4 | Hierarquia: colônia → sistema → subsistema (uma árvore) |
| Listas | Cap 5 | Séries históricas (vento, geração, consumo ao longo do tempo) |
| Funções e procedimentos | Cap 3 | Cada passo da receita vira uma função pequena |
| Módulos (`import` dos nossos arquivos) | Cap 3 | Separar dados, lógica e decisões |
| Recursão | Cap 3 | Percorrer a árvore da colônia sem saber de antemão quantos níveis ela tem |
| `if / elif / else` + `and / or / not` | Caps 2 e 3 | Regras de decisão |
| Mínimos quadrados | Cap 7 | Reta de previsão (β₀, β₁) e qualidade do ajuste (R²) |
| P = ½·ρ·A·v³ | Cap 8 | Potência eólica teórica (o modelo físico ao lado do modelo estatístico) |

**Sem bibliotecas externas no núcleo.** O enunciado diz que não precisa delas, e fazer a regressão à mão mostra que entendemos a fórmula. Se quisermos usar NumPy, será só para conferir os números nos testes.

---

## 1. Forma do bolo (arquivos)

```text
aurora-colonia/
├── dados.py          # DADOS: limites, colônia inicial, históricos (nada de lógica aqui)
├── colonia.py        # ESTRUTURA: buscar por chave, percorrer a árvore, somar consumo
├── previsao.py       # MODELO: média, ajustar reta, prever, R²
├── energia.py        # MODELO: potência eólica, balanço geração × consumo
├── regras.py         # DECISÕES: condições booleanas, decidir, cortar cargas
├── main.py           # SISTEMA ÚNICO: entrada → processamento → saída
├── exemplos.py       # cenários prontos (inclui todos os exemplos do enunciado)
├── exemplos_saida.txt
├── exportar_painel.py  # gera painel/dados.js para o HTML
├── painel/           # HTML da Alice (só mostra, não recalcula)
└── tests/            # um teste para cada exemplo do enunciado
```

Regra de ouro: **`dados.py` não decide, `regras.py` não guarda dados, `main.py` só costura.**

---

## 2. Passo 1 — Montar a colônia (dados.py)

### 2.1 Limites com nome (nunca número solto no meio do código)
```text
ENERGIA_CRITICA   = 20    # % da bateria
ENERGIA_BAIXA     = 50    # % da bateria (vem do enunciado)
CONSUMO_ALTO      = 80    # kW  [A CONFIRMAR]
DENSIDADE_AR_MARTE = 0.020  # kg/m³ (hipótese didática)
```
Por que `CONSUMO_ALTO = 80`: o enunciado diz que 40/70 gera `ALERTA: reduzir consumo`, e não modo economia. Logo, 70 não pode contar como "consumo alto". O limite precisa ficar acima de 70.

### 2.2 A árvore da colônia (dicionário hierárquico)
```text
colonia
├── energetico
│   ├── solar      → geracao_kw, irradiancia_w_m2
│   ├── eolico     → geracao_kw, vento_m_s, area_pas_m2
│   └── bateria    → nivel_pct, capacidade_kwh
├── ambiental      → temp_interna_c, temp_externa_c, vento_m_s
└── operacional
    └── modulos
        ├── Habitação   → consumo_kw, prioridade 1, essencial SIM (suporte à vida)
        ├── Médico      → consumo_kw, prioridade 1, essencial SIM (suporte à vida)
        ├── Energia     → consumo_kw, prioridade 2, essencial SIM (mantém o resto vivo)
        ├── Logística   → consumo_kw, prioridade 3, essencial NÃO
        └── Laboratório → consumo_kw, prioridade 4, essencial NÃO
```
Cada módulo também tem `ligado` (sim/não) e `estado` ("ok" / "falha").
Os cinco módulos são os mesmos que pousaram na Fase 2: é a continuação da história.

### 2.3 Históricos (listas paralelas, mesmo tamanho)
```text
historico["vento"]          = [8, 10, 12]     # m/s (exemplo do enunciado)
historico["energia_eolica"] = [20, 25, 30]    # kW  (exemplo do enunciado)
historico["hora"]           = [...]           # para consumo × horário
historico["consumo"]        = [...]
```

---

## 3. Passo 2 — Navegar e buscar (colonia.py)

**buscar(colonia, caminho)** — acesso direto pela chave
```text
1. Quebrar o caminho "energetico/eolico/geracao_kw" em partes.
2. Começar no topo (colonia).
3. Para cada parte:
     se a parte existe como chave no nível atual → descer para ela
     senão → devolver "não encontrado" (nunca quebrar o programa)
4. Devolver o valor achado.
```

**percorrer(no, nivel)** — mostrar a árvore inteira (recursão)
```text
1. Para cada chave do nó:
     escrever a chave com recuo = nivel
     se o valor também é um dicionário → percorrer(valor, nivel + 1)   ← chamada recursiva
     senão → escrever o valor
2. Parada: quando não há mais dicionários dentro, a função termina sozinha.
```

**consumo_total(modulos)** — somar só os módulos ligados.

---

## 4. Passo 3 — Prever (previsao.py)

**media(lista)** → soma ÷ quantidade.

**ajustar_reta(x, y)** — mínimos quadrados (Cap 7)
```text
1. Validar: listas com o mesmo tamanho, pelo menos 2 pontos e x não todo igual.
2. x̄ = media(x); ȳ = media(y)
3. numerador   = Σ (xᵢ − x̄)·(yᵢ − ȳ)
   denominador = Σ (xᵢ − x̄)²
4. β₁ = numerador ÷ denominador      (inclinação: quanto y sobe quando x sobe 1)
5. β₀ = ȳ − β₁·x̄                     (intercepto: valor de y quando x = 0)
6. Devolver (β₀, β₁)
```

**prever(β₀, β₁, x)** → ŷ = β₀ + β₁·x

**r2(x, y, β₀, β₁)** → R² = 1 − Σ(yᵢ − ŷᵢ)² ÷ Σ(yᵢ − ȳ)²  (perto de 1 = a reta explica bem os dados)

**Conta de verificação (exemplo do enunciado, feita à mão):**
```text
x = [8, 10, 12]    x̄ = 10
y = [20, 25, 30]   ȳ = 25
numerador   = (−2)(−5) + (0)(0) + (2)(5) = 20
denominador = 4 + 0 + 4 = 8
β₁ = 20 ÷ 8 = 2,5      β₀ = 25 − 2,5·10 = 0
vento = 11  →  ŷ = 0 + 2,5·11 = 27,5   (o enunciado diz "≈ 27")
R² = 1 (os três pontos estão exatamente na reta)
```

---

## 5. Passo 4 — Medir a energia (energia.py)

**potencia_eolica(ρ, A, v)** → P = ½ · ρ · A · v³ (Cap 8)
A potência cresce com o **cubo** do vento: com o dobro de vento, há 8 vezes mais potência. Serve para comparar com a reta da regressão no PDF (modelo físico × modelo estatístico).

**balanco(geracao, consumo)**
```text
se consumo > geracao   → "ALERTA: consumo maior que geração"       (risco)
senão se geracao > consumo → "SUGESTÃO: armazenar energia excedente" (evitar desperdício)
senão                  → "OK: geração e consumo em equilíbrio"
```
Testes obrigatórios: 40/70 → ALERTA e 80/30 → SUGESTÃO (são as frases exatas do enunciado).

---

## 6. Passo 5 — Decidir (regras.py)

### 6.1 Três perguntas de sim/não (variáveis booleanas)
```text
B = energia < ENERGIA_BAIXA                 # bateria baixa
A = consumo > CONSUMO_ALTO                  # consumo alto
P = geracao_prevista < consumo              # previsão desfavorável
C = energia < ENERGIA_CRITICA               # bateria crítica
```

### 6.2 Expressões (Cap 2)
```text
ECONOMIA = B · A
RISCO    = B · A · P
EMERGÊNCIA = C + RISCO
```
Simplificação para o PDF (lei da absorção): `B·A + B·A·P = B·A`.
Ou seja, todo caso de RISCO já é um caso de ECONOMIA. Por isso, no `if/elif`, **o RISCO vem antes**: senão ele nunca seria alcançado.

### 6.3 decidir(energia, consumo, geracao_prevista) — do mais grave para o mais leve
```text
se C ou (B e A e P)  → "CRÍTICO: modo emergência — só suporte à vida"
senão se B e A       → "MODO ECONOMIA: desligar sistemas não essenciais"
senão se B           → "ALERTA: reduzir consumo"
senão                → "NORMAL: operação padrão"
```
Conferência com o enunciado: energia 40 e consumo 70 → B = sim, A = não → **"ALERTA: reduzir consumo"** ✔

### 6.4 cortar_cargas(modulos, energia_disponivel) — prioridade
```text
1. Ordenar os módulos da MENOR prioridade para a maior (Laboratório primeiro).
2. Para cada módulo:
     se o consumo já cabe na energia disponível → parar
     se o módulo é essencial → NUNCA desligar (pular)
     senão → desligar e registrar o motivo
3. Se mesmo assim não couber → alerta máximo (só sobrou suporte à vida).
```
Regra herdada das Fases 1 e 2: **segurança antes de prioridade**. Suporte à vida nunca entra na lista de corte.

---

## 7. Passo 6 — O sistema único (main.py)

```text
ENTRADA
  1. Carregar a colônia e os históricos (dados.py).
  2. Ler a leitura atual dos sensores (cenário ou digitada).
  3. Validar: número, não negativo, energia entre 0 e 100.

PROCESSAMENTO
  4. Ajustar a reta com o histórico (vento → energia eólica) e mostrar β₀, β₁ e R².
  5. Prever a geração da próxima hora pelo vento atual.
  6. Somar geração atual (solar + eólica) e consumo dos módulos ligados.
  7. Fazer o balanço (geração × consumo).
  8. Decidir (regras) e, se preciso, cortar cargas por prioridade.

SAÍDA
  9. Mostrar: leitura → previsão → decisão → ações → motivo de cada ação.
 10. Guardar a decisão no histórico de alertas (lista).
```

**REATIVO × PREDITIVO (o coração da apresentação):**
rodar o mesmo cenário duas vezes. Na primeira, a decisão usa só a geração **atual** (reativo). Na segunda, usa a geração **prevista** (preditivo). No cenário de tempestade de poeira, o reativo só age quando a bateria já está crítica; o preditivo desliga o Laboratório antes.

---

## 8. Passo 7 — Provar que o bolo deu certo (exemplos e testes)

| Cenário | Entrada | Saída esperada |
|---|---|---|
| Enunciado — regra simples | energia 40, consumo 70 | `ALERTA: reduzir consumo` |
| Enunciado — balanço déficit | geração 40, consumo 70 | `ALERTA: consumo maior que geração` |
| Enunciado — balanço excedente | geração 80, consumo 30 | `SUGESTÃO: armazenar energia excedente` |
| Enunciado — previsão | vento 11 | energia ≈ 27,5 (β₁ = 2,5; β₀ = 0) |
| Economia | energia 40, consumo 90, geração prevista 95 | `MODO ECONOMIA` + Laboratório desligado |
| Risco combinado | energia 40, consumo 90, geração prevista 60 | `CRÍTICO` (B·A·P) |
| Emergência | energia 15 | `CRÍTICO` + só suporte à vida ligado |
| Normal | energia 85, consumo 50 | `NORMAL` |
| Tempestade de poeira | solar cai, vento sobe | Preditivo age antes do reativo |
| Entrada inválida | energia −5 ou "abc" | Mensagem de erro, sem quebrar |

Cada linha vira um teste em `tests/`. Se um teste falhar, o bolo não sai do forno.

---

## 9. Passo 8 — Servir (painel e PDF)

1. `exportar_painel.py` roda os cenários e grava `painel/dados.js`.
2. O HTML da Alice **lê** esse arquivo e só mostra os dados.
3. O PDF usa os mesmos números e prints da saída real.
4. Antes de entregar: rodar tudo, testar e conferir a matriz do `ROADMAP.md`.
