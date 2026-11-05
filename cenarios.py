# Aurora Siger - Fase 3: CENÁRIOS PRONTOS (algoritmo, seção 12).
# O avaliador escolhe um destes no menu do main.py.
# Cada cenário é uma leitura de sensores + o que se espera que o sistema diga.
# Os mesmos cenários são conferidos automaticamente em tests/test_cenarios_simulacao.py.
#
# Campos da leitura:
#   hora, bateria_pct, geracao_solar_kw, vento_m_s, temp_externa_c (obrigatórios)
#   consumo_kw  = {módulo: kW medido}  (sem ele, cada andar gasta o esperado da hora)
#   desligados  = {módulo: hora em que foi desligado}
#   tempestade  = True/False
#   estados     = {módulo: "ok" ou "falha"}
#   eolica_medida_kw = geração eólica medida (entra no histórico e refaz a reta)

CENARIOS = [
    {"id": "1", "origem": "Enunciado", "colonia": "B",
     "titulo": "Bateria 40%, consumo 70 kW",
     "leitura": {"hora": 19, "bateria_pct": 40, "geracao_solar_kw": 0, "vento_m_s": 10,
                 "temp_externa_c": -60,
                 "consumo_kw": {"Energia": 5, "Habitação": 30, "Médico": 12,
                                "Logística": 10, "Laboratório": 13}},
     "esperado": {"situacao": "ALERTA"}},

    {"id": "2", "origem": "Enunciado", "colonia": "B",
     "titulo": "Geração 40 kW, consumo 70 kW",
     "leitura": {"hora": 17, "bateria_pct": 85, "geracao_solar_kw": 15, "vento_m_s": 10,
                 "temp_externa_c": -60,
                 "consumo_kw": {"Energia": 5, "Habitação": 22, "Médico": 12,
                                "Logística": 13, "Laboratório": 18}},
     "esperado": {"balanco": "ALERTA: consumo maior que geração"}},

    {"id": "3", "origem": "Enunciado", "colonia": "B",
     "titulo": "Geração 80 kW, consumo 30 kW",
     "leitura": {"hora": 12, "bateria_pct": 90, "geracao_solar_kw": 55, "vento_m_s": 10,
                 "temp_externa_c": -60,
                 "consumo_kw": {"Energia": 5, "Habitação": 15, "Médico": 10},
                 "desligados": {"Logística": 11, "Laboratório": 11}},   # há só 1h: não religam
     "esperado": {"balanco": "SUGESTÃO: armazenar energia excedente"}},

    {"id": "4", "origem": "Enunciado", "colonia": "B",
     "titulo": "Vento 11 m/s: quanto a eólica vai gerar?",
     "leitura": {"hora": 12, "bateria_pct": 80, "geracao_solar_kw": 140, "vento_m_s": 11,
                 "temp_externa_c": -60},
     "esperado": {"eolica_prevista_kw": 27.5}},

    {"id": "5", "origem": "Equipe", "colonia": "B",
     "titulo": "Bateria 40%, consumo 91 kW, previsão favorável (bateria subindo)",
     "leitura": {"hora": 11, "bateria_pct": 40, "geracao_solar_kw": 136, "vento_m_s": 10,
                 "temp_externa_c": -60},
     "esperado": {"situacao": "ECONOMIA", "desligados": ["Laboratório", "Logística"]}},

    {"id": "6", "origem": "Equipe", "colonia": "B",
     "titulo": "Bateria 40%, consumo 91 kW, previsão desfavorável (tempestade)",
     "leitura": {"hora": 16, "bateria_pct": 40, "geracao_solar_kw": 4, "vento_m_s": 20,
                 "temp_externa_c": -60, "tempestade": True},
     "esperado": {"situacao": "CRITICO"}},

    {"id": "7", "origem": "Equipe", "colonia": "B",
     "titulo": "Bateria 15%: só o suporte à vida fica ligado",
     "leitura": {"hora": 11, "bateria_pct": 15, "geracao_solar_kw": 136, "vento_m_s": 10,
                 "temp_externa_c": -60},
     "esperado": {"situacao": "CRITICO", "desligados": ["Laboratório", "Logística"]}},

    {"id": "8", "origem": "Equipe", "colonia": "B",
     "titulo": "Bateria 85%, consumo 50 kW",
     "leitura": {"hora": 12, "bateria_pct": 85, "geracao_solar_kw": 140, "vento_m_s": 10,
                 "temp_externa_c": -60,
                 "consumo_kw": {"Energia": 5, "Habitação": 22, "Médico": 12,
                                "Logística": 5, "Laboratório": 6}},
     "esperado": {"situacao": "NORMAL", "desligados": []}},

    {"id": "10a", "origem": "Equipe", "colonia": "B",
     "titulo": "Leitura inválida: bateria −5%",
     "leitura": {"hora": 12, "bateria_pct": -5, "geracao_solar_kw": 140, "vento_m_s": 10,
                 "temp_externa_c": -60},
     "esperado": {"erro": True}},

    {"id": "10b", "origem": "Equipe", "colonia": "B",
     "titulo": "Leitura inválida: vento \"abc\"",
     "leitura": {"hora": 12, "bateria_pct": 50, "geracao_solar_kw": 140, "vento_m_s": "abc",
                 "temp_externa_c": -60},
     "esperado": {"erro": True}},

    {"id": "11", "origem": "Equipe", "colonia": "B",
     "titulo": "Experimento grande no Laboratório (40 kW) num dia de sol forte",
     "leitura": {"hora": 12, "bateria_pct": 90, "geracao_solar_kw": 140, "vento_m_s": 10,
                 "temp_externa_c": -60, "consumo_kw": {"Laboratório": 40}},
     "esperado": {"anomalias": ["Laboratório"], "desligados": []}},

    {"id": "12", "origem": "Equipe", "colonia": "B",
     "titulo": "Pico na Logística (30 kW) durante a tempestade",
     "leitura": {"hora": 16, "bateria_pct": 60, "geracao_solar_kw": 4, "vento_m_s": 20,
                 "temp_externa_c": -60, "tempestade": True,
                 "consumo_kw": {"Logística": 30}},
     "esperado": {"anomalias": ["Logística"], "primeiro_desligado": "Logística"}},

    {"id": "13", "origem": "Equipe", "colonia": "B",
     "titulo": "Pico no Médico (20 kW, acidente) durante a tempestade",
     "leitura": {"hora": 16, "bateria_pct": 60, "geracao_solar_kw": 4, "vento_m_s": 20,
                 "temp_externa_c": -60, "tempestade": True,
                 "consumo_kw": {"Médico": 20}},
     "esperado": {"anomalias": ["Médico"], "primeiro_desligado": "Laboratório",
                  "ligados": ["Médico"]}},

    {"id": "14", "origem": "Equipe", "colonia": "B",
     "titulo": "Meio-dia em tempestade: solar medido 7 kW (curva esperava 140)",
     "leitura": {"hora": 12, "bateria_pct": 80, "geracao_solar_kw": 7, "vento_m_s": 20,
                 "temp_externa_c": -60, "tempestade": True},
     "esperado": {"fator_poeira": 0.05}},

    {"id": "15", "origem": "Equipe", "colonia": "B",
     "titulo": "Noite (21h): sem sol, o fator de poeira não divide por zero",
     "leitura": {"hora": 21, "bateria_pct": 80, "geracao_solar_kw": 0, "vento_m_s": 10,
                 "temp_externa_c": -80},
     "esperado": {"fator_poeira": 1.0}},

    {"id": "16", "origem": "Equipe", "colonia": "B",
     "titulo": "Laboratório desligado há só 1h, energia sobrando: ainda não religa",
     "leitura": {"hora": 11, "bateria_pct": 90, "geracao_solar_kw": 136, "vento_m_s": 10,
                 "temp_externa_c": -60, "desligados": {"Laboratório": 10}},
     "esperado": {"desligados": ["Laboratório"]}},

    {"id": "17", "origem": "Equipe", "colonia": "B",
     "titulo": "Laboratório desligado há 2h, projeção com ele em 78%: zona morta, não religa",
     "leitura": {"hora": 12, "bateria_pct": 60, "geracao_solar_kw": 140, "vento_m_s": 10,
                 "temp_externa_c": -60, "desligados": {"Laboratório": 10}},
     "esperado": {"desligados": ["Laboratório"]}},

    {"id": "18", "origem": "Equipe", "colonia": "A",
     "titulo": "Colônia A em economia: religa só quem não faz voltar o MODO ECONOMIA",
     # Logística sozinha: 39 + 22 = 61 kW (< 80) → religa.
     # Laboratório junto: 61 + 30 = 91 kW (> 80, bateria 40%) → voltaria a ECONOMIA → fica fora.
     "leitura": {"hora": 11, "bateria_pct": 40, "geracao_solar_kw": 136, "vento_m_s": 10,
                 "temp_externa_c": -60,
                 "desligados": {"Laboratório": 9, "Logística": 9}},
     "esperado": {"desligados": ["Laboratório"], "religados": ["Logística"]}},

    {"id": "19", "origem": "Equipe", "colonia": "B",
     "titulo": "Laboratório desligado há 2h e energia sobrando: religa",
     "leitura": {"hora": 12, "bateria_pct": 85, "geracao_solar_kw": 140, "vento_m_s": 10,
                 "temp_externa_c": -60, "desligados": {"Laboratório": 10}},
     "esperado": {"desligados": []}},

    {"id": "20", "origem": "Equipe", "colonia": "B",
     "titulo": "Falha no equipamento da Logística: o sistema avisa na hora",
     "leitura": {"hora": 12, "bateria_pct": 85, "geracao_solar_kw": 140, "vento_m_s": 10,
                 "temp_externa_c": -60, "estados": {"Logística": "falha"}},
     "esperado": {"falhas": ["Logística"], "situacao": "NORMAL"}},

    {"id": "21", "origem": "Equipe", "colonia": "B",
     "titulo": "Nova medição de vento entra no histórico e refaz a reta",
     # Vento 14 m/s rendeu 32 kW: abaixo da reta antiga (35 kW), então o R² cai de 1.
     "leitura": {"hora": 12, "bateria_pct": 85, "geracao_solar_kw": 140, "vento_m_s": 14,
                 "temp_externa_c": -60, "eolica_medida_kw": 32},
     "esperado": {"r2_abaixo_de_1": True}},
]


def buscar_cenario(identificador):
    # Função: acha o cenário pelo id (busca linear: a lista é pequena).
    for cenario in CENARIOS:
        if cenario["id"] == identificador:
            return cenario
    return None
