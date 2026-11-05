# Aurora Siger - Fase 3: DADOS da colônia.
# Este arquivo só guarda dados e limites; não toma nenhuma decisão.
# Os valores são hipóteses didáticas, não medições reais de Marte.
# Cada número aqui tem a sua origem no algoritmo_v1.md (seções 3.1 e 3.3).

# ---------------------------------------------------------------
# Limites da decisão (seção 8)
# ---------------------------------------------------------------
ENERGIA_CRITICA = 20       # % da bateria: abaixo disso, CRÍTICO
ENERGIA_BAIXA = 50         # % da bateria: abaixo disso, bateria baixa (enunciado)
CONSUMO_ALTO = 80          # kW: acima de 70, para que 40/70 dê "ALERTA: reduzir consumo"

# ---------------------------------------------------------------
# Limites do preditivo (seções 6.7 e 8.5)
# ---------------------------------------------------------------
RESERVA_MINIMA_PROJETADA = 70  # %: a bateria projetada em 3h precisa ficar aqui ou acima
JANELA_PREVISAO = 3            # horas que o preditivo olha para frente
MARGEM_RELIGAR = 80            # %: só religa se a projeção com o módulo ligado ficar aqui ou acima
TEMPO_MINIMO_DESLIGADO = 2     # horas que um módulo fica desligado antes de poder religar
LIMITE_ANOMALIA = 0.30         # 30% acima do esperado para a hora = anomalia
# Proposta do código (algoritmo, seção 11.3): a projeção só é "desfavorável" se,
# além de ficar abaixo de 70%, a bateria estiver CAINDO. Sem isso, a Colônia B
# cortaria o Laboratório toda manhã de céu limpo, só porque amanhece com 53%.
# Para voltar à regra literal (só "< 70%"), troque para False.
EXIGIR_QUEDA = True

# ---------------------------------------------------------------
# Geração (seções 6.6 e 7.1)
# ---------------------------------------------------------------
NASCER_SOL = 6             # h
POR_DO_SOL = 18            # h
PICO_SOLAR = 140           # kW ao meio-dia com céu limpo (equilíbrio do dia ≈ 126 + folga)
VENTO_NORMAL = 10          # m/s
VENTO_TEMPESTADE = 20      # m/s
FATOR_POEIRA_TEMPESTADE = 0.05  # na tempestade, o solar fica em 5% do normal
DURACAO_TEMPESTADE = 3     # h
DENSIDADE_AR_MARTE = 0.020  # kg/m³ (hipótese didática; ≈ 1% do ar da Terra)

# ---------------------------------------------------------------
# Jornada da colônia (seção 3.3: a "ideia do prédio")
# ---------------------------------------------------------------
HORA_INICIO_SIMULACAO = 8
HORA_FIM_SIMULACAO = 20
INICIO_EXPEDIENTE = 9
FIM_EXPEDIENTE = 18
HORAS_DE_NOITE = 10        # das 20h às 6h, sem sol

# Consumo de cada andar (kW) em cada nível de uso.
# baixo = só se manter ativo · medio = uso moderado · alto = a todo vapor
NIVEIS_KW = {
    "Energia":     {"baixo": 5,  "medio": 5,  "alto": 5},
    "Habitação":   {"baixo": 15, "medio": 22, "alto": 30},
    "Médico":      {"baixo": 10, "medio": 12, "alto": 14},
    "Logística":   {"baixo": 5,  "medio": 12, "alto": 22},
    "Laboratório": {"baixo": 5,  "medio": 15, "alto": 30},
}

# Nível de cada andar em cada período do dia.
# As pessoas estão num lugar de cada vez: quando Laboratório e Logística
# enchem, a Habitação esvazia (e o contrário à noite).
JORNADA = {
    "chegada":        {"Energia": "medio", "Habitação": "alto",  "Médico": "medio",
                       "Logística": "medio", "Laboratório": "medio"},   # 8h–9h:  74 kW
    "expediente":     {"Energia": "medio", "Habitação": "medio", "Médico": "medio",
                       "Logística": "alto",  "Laboratório": "alto"},    # 9h–18h: 91 kW
    "pos_expediente": {"Energia": "medio", "Habitação": "alto",  "Médico": "medio",
                       "Logística": "medio", "Laboratório": "medio"},   # 18h–20h: 74 kW
    "noite":          {"Energia": "medio", "Habitação": "medio", "Médico": "baixo",
                       "Logística": "baixo", "Laboratório": "baixo"},   # dormindo: 47 kW
}

# Prioridade (1 = mais importante) e se é essencial (nunca desligar).
MODULOS = {
    "Energia":     {"prioridade": 1, "essencial": True},   # mantém os outros vivos
    "Habitação":   {"prioridade": 2, "essencial": True},   # suporte à vida
    "Médico":      {"prioridade": 2, "essencial": True},   # suporte à vida
    "Logística":   {"prioridade": 3, "essencial": False},
    "Laboratório": {"prioridade": 4, "essencial": False},
}

# ---------------------------------------------------------------
# As duas colônias (seção 3.3): o tamanho da bateria muda o sistema inteiro.
# A noite gasta 220 kWh, que precisam caber entre os 70% e o piso.
# ---------------------------------------------------------------
COLONIAS = {
    "A": {"nome": "Colônia A (bateria pequena)", "capacidade_kwh": 440,
          "piso_pct": 20, "bateria_8h_pct": 29},
    "B": {"nome": "Colônia B (bateria grande)", "capacidade_kwh": 1100,
          "piso_pct": 50, "bateria_8h_pct": 53},
}
COLONIA_PADRAO = "B"

# As duas tempestades de 3h (seção 9).
TEMPESTADES = {
    "manha": {"nome": "Tempestade da manhã", "inicio": 10},   # 10h–13h
    "tarde": {"nome": "Tempestade da tarde", "inicio": 14},   # 14h–17h
}


def periodo_da_hora(hora):
    # Função: diz em que período da jornada a hora cai.
    # Usa hora % 24 para que 21h, 22h... (depois da simulação) caiam na noite.
    hora = hora % 24
    if hora >= HORA_INICIO_SIMULACAO and hora < INICIO_EXPEDIENTE:
        return "chegada"
    if hora >= INICIO_EXPEDIENTE and hora < FIM_EXPEDIENTE:
        return "expediente"
    if hora >= FIM_EXPEDIENTE and hora < HORA_FIM_SIMULACAO:
        return "pos_expediente"
    return "noite"


def consumo_esperado(nome_modulo, hora):
    # Função: quanto o andar costuma gastar naquela hora (kW).
    nivel = JORNADA[periodo_da_hora(hora)][nome_modulo]
    return NIVEIS_KW[nome_modulo][nivel]


def criar_perfil(nome_modulo):
    # Função: lista com o consumo esperado de cada hora do dia.
    # A posição da lista é a hora: perfil[9] = consumo esperado às 9h.
    perfil = []
    for hora in range(24):
        perfil.append(consumo_esperado(nome_modulo, hora))
    return perfil


def criar_colonia(tipo=COLONIA_PADRAO):
    # Função: devolve uma colônia NOVA a cada chamada.
    # Assim um cenário ou teste nunca altera os dados de outro.
    # A hierarquia é uma árvore: colônia -> sistema -> subsistema -> sensor.
    config = COLONIAS[tipo]
    modulos = {}
    for nome in MODULOS:
        modulos[nome] = {
            "prioridade": MODULOS[nome]["prioridade"],
            "essencial": MODULOS[nome]["essencial"],
            "ligado": True,
            "estado": "ok",
            "consumo_atual_kw": consumo_esperado(nome, HORA_INICIO_SIMULACAO),
            "perfil_kw": criar_perfil(nome),
            "desligado_desde": None,   # hora em que foi desligado (para o tempo mínimo)
        }
    return {
        "tipo": tipo,
        "energetico": {
            "solar": {"geracao_kw": 0, "pico_kw": PICO_SOLAR},
            "eolico": {"geracao_kw": 0, "vento_m_s": VENTO_NORMAL, "area_pas_m2": 120},
            "bateria": {"nivel_pct": config["bateria_8h_pct"],
                        "capacidade_kwh": config["capacidade_kwh"],
                        "piso_pct": config["piso_pct"]},
        },
        "ambiental": {"temp_interna_c": 21, "temp_externa_c": -60,
                      "vento_m_s": VENTO_NORMAL, "tempestade": False},
        "operacional": {"modulos": modulos},
    }


def criar_historico():
    # Função: séries históricas em listas paralelas (mesma posição = mesma leitura).
    # vento e energia_eolica são exatamente o exemplo do enunciado.
    return {
        "vento": [8, 10, 12],             # m/s
        "energia_eolica": [20, 25, 30],   # kW
    }
