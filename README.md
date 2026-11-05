# Aurora Siger · Fase 3 — Sistema Inteligente da Colônia

A colônia já está em Marte, e a Terra está longe demais para dar ordens em tempo real. Este sistema **organiza os dados dos sensores, prevê a geração de energia, analisa geração × consumo e decide sozinho** o que ligar e desligar, sempre protegendo o suporte à vida.

A ideia central: sair de um sistema **reativo** (que age depois que a bateria já caiu) para um sistema **preditivo** (que projeta a bateria **3 horas à frente**, de hora em hora, e corta antes).

**Equipe:** Alice Brenda (RM 574916), Douglas Goltz (RM 574439) e Marcelo Santos (RM 576131) · Ciência da Computação · FIAP · 2026

**Fases anteriores:** Fase 1 — Decolagem: [MRC888/Aurora-PBL-FIAP](https://github.com/MRC888/Aurora-PBL-FIAP) · Fase 2 — Pouso (MGPEB): [Douglasgbm/pouso_aurora](https://github.com/Douglasgbm/pouso_aurora) · [painel online](https://mrc888.github.io/aurora-painel/)

## Como executar

Requer só o Python 3, sem nenhuma biblioteca externa.

```text
python main.py            # abre o menu: digite a opção (ex.: 1, 9b, todos) e Enter
python painel.py          # grava painel/dados.js com todos os números para o painel
python -m unittest discover -s tests -t .     # 76 testes
```

No menu: `1` a `19` são os cenários prontos, `9a` a `9d` as simulações (reativo × preditivo), `arv` a árvore de dados, `todos` roda tudo e `sair` encerra.

No Windows, se os acentos aparecerem trocados no terminal, rode antes `$env:PYTHONIOENCODING="utf-8"` (PowerShell) ou `set PYTHONIOENCODING=utf-8` (cmd).

## Como funciona

```text
ENTRADA (sensores) → validar → anomalias → previsão → energia → decisão → ação → diário
```

1. **Dados** (`dados.py`, `colonia.py`): a colônia é uma **árvore de dicionários** (energético → solar / eólico / bateria; ambiental; operacional → módulos). Cada módulo guarda uma **lista** com o consumo esperado em cada hora do dia.
2. **Previsão** (`previsao.py`): é **híbrida**.
   - **Eólica:** regressão linear por **mínimos quadrados**, feita à mão (vento 11 m/s → 27,5 kW, R² = 1).
   - **Solar:** a curva do dia (parábola) vezes um **fator de poeira**, que é o medido dividido pelo esperado.
3. **Energia** (`energia.py`): balanço geração × consumo, detecção de **anomalias** (um andar gastando mais de 30% acima do esperado) e a **projeção da bateria em 3h**.
4. **Decisão** (`regras.py`): quatro variáveis lógicas.
   - **C:** bateria < 20%
   - **B:** bateria < 50%
   - **A:** consumo > 80 kW
   - **P:** projeção < 70% e caindo

   Com elas: `ECONOMIA = B·A`, `RISCO = B·A·P`, `EMERGÊNCIA = C + RISCO`.
   O corte começa por quem causou a anomalia e depois segue a prioridade. O religar usa histerese (2h desligado e projeção ≥ 80%). Energia, Habitação e Médico **nunca** são desligados.
5. **Sistema** (`sistema.py`, `main.py`): junta tudo, explica cada decisão e registra no diário.
6. **Simulação** (`simulacao.py`): um dia das 8h às 20h com uma tempestade de poeira de 3h. Roda em **2 colônias** (bateria de 440 kWh e de 1100 kWh) × **2 tempestades** (manhã e tarde), sempre com reativo × preditivo.

## Exemplo de entrada e saída (cenário 1 do enunciado)

```text
ENTRADA
  hora 19 h · bateria 40 % · solar 0 kW · vento 10 m/s · colônia B

PREVISÃO
  reta eólica: ŷ = 0,0 + 2,5·vento   (R² = 1,0)
  eólica prevista: 25,0 kW · fator de poeira: 1,00
  bateria projetada em 3h: 31,9 %

ENERGIA
  geração 25,0 kW · consumo 70,0 kW
  ALERTA: consumo maior que geração

DECISÃO
  regra usada: B: bateria < 50%
  ALERTA: reduzir consumo

AÇÕES
  - Desligado: Laboratório — motivo: bateria projetada em 31,9% em 3h (abaixo de 70% e caindo)
  - Desligado: Logística — motivo: bateria projetada em 31,9% em 3h (abaixo de 70% e caindo)
  - ATENÇÃO: só restou o suporte à vida; reserva projetada em 35,8%
```

Os outros exemplos do enunciado também estão no menu:
- **Cenário 2:** geração 40 kW, consumo 70 kW → `ALERTA: consumo maior que geração`.
- **Cenário 3:** geração 80 kW, consumo 30 kW → `SUGESTÃO: armazenar energia excedente`.
- **Cenário 4:** vento 11 m/s → eólica prevista de 27,5 kW.

## Resultado: reativo × preditivo

Mesma tempestade nos dois sistemas. O número que importa é com quanto a bateria **amanhece**, depois de 10h de noite sem sol:

| Simulação | Reativo amanhece com | Preditivo amanhece com | Piso da colônia |
|---|---|---|---|
| 9a — Colônia A, tempestade da manhã | 22% | 29% | 20% |
| 9b — Colônia A, tempestade da tarde | **−2% (a bateria esgota)** | 28% | 20% |
| 9c — Colônia B, tempestade da manhã | 44% (abaixo do piso) | 55% | 50% |
| 9d — Colônia B, tempestade da tarde | 43% (abaixo do piso) | 54% | 50% |

O preditivo corta os módulos não essenciais **na primeira hora da tempestade**, enquanto o reativo só age quando a bateria já está baixa. Por isso o preditivo chega às 20h com pelo menos 70% e atravessa a noite.

## Estrutura do repositório

| Arquivo | Papel |
|---|---|
| `dados.py` | constantes, níveis de consumo, jornada, colônias e tempestades (só dados) |
| `colonia.py` | árvore: buscar, percorrer (recursivo), somar, validar a leitura |
| `previsao.py` | média, mínimos quadrados, R², curva solar, fator de poeira |
| `energia.py` | balanço, anomalias, física do vento (P = ½·ρ·A·v³), projeção da bateria |
| `regras.py` | variáveis lógicas, decisão, corte e religar |
| `sistema.py` | o fluxo completo de uma leitura e o diário |
| `simulacao.py` | o dia de 12h, reativo × preditivo, as 4 simulações |
| `cenarios.py` | os cenários prontos do menu, cada um com a saída esperada |
| `painel.py` | exporta `painel/dados.js` (o painel só mostra, não recalcula) |
| `main.py` | menu do avaliador e relatório |
| `tests/` | 76 testes automáticos (`unittest`) |
| `algoritmo_v1.md` | o algoritmo em português: **fonte da verdade** |
| `docs/DECISOES_03-11-2026.md` | decisões da reunião de 03/11 e o porquê de cada uma |
| `docs/VISUAL.md` | proposta de visual do painel HTML, do PDF e da apresentação |
| `ROADMAP.md` | enunciado detalhado, marcos, divisão de tarefas e critérios de avaliação |
| `CLAUDE.md`, `.claude/agents/` | regras do projeto e agentes de revisão |

## Limites do protótipo

- Os valores são **hipóteses didáticas**, não medições reais de Marte. O ar marciano tem cerca de 1% da densidade do ar da Terra, então o vento real gera bem menos.
- A reta eólica foi ajustada com vento de 8 a 12 m/s. Usá-la a 20 m/s, na tempestade, é **extrapolação**. A escolha foi conservadora: a física daria 4 vezes mais energia, mas planejar com a reta protege a bateria.
- A projeção supõe que o vento e a poeira medidos agora **se mantêm** pelas próximas 3h. Por isso o preditivo percebe a tempestade na primeira hora dela, e não antes.
