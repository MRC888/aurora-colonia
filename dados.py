# Aurora Siger - Fase 3: DADOS da colônia.
# Este arquivo só guarda dados e limites; não toma nenhuma decisão.
# Os valores são hipóteses didáticas, não medições reais de Marte.

# ---------------------------------------------------------------
# Limites com nome (usados pelas regras no marco M4)
# ---------------------------------------------------------------
ENERGIA_CRITICA = 20       # % da bateria
ENERGIA_BAIXA = 50         # % da bateria (valor do enunciado)
CONSUMO_ALTO = 80          # kW; acima de 70 para que 40/70 dê "ALERTA: reduzir consumo"
DENSIDADE_AR_MARTE = 0.020  # kg/m³, usada na potência eólica (Cap 8)


def criar_colonia():
    # Função: devolve uma colônia NOVA a cada chamada.
    # Assim um cenário ou teste nunca altera os dados de outro.
    # A hierarquia é uma árvore: colônia -> sistema -> subsistema -> sensor.
    return {
        "energetico": {
            "solar": {
                "geracao_kw": 20,
                "irradiancia_w_m2": 590,
            },
            "eolico": {
                "geracao_kw": 25,
                "vento_m_s": 10,
                "area_pas_m2": 120,
            },
            "bateria": {
                "nivel_pct": 40,
                "capacidade_kwh": 500,
            },
        },
        "ambiental": {
            "temp_interna_c": 21,
            "temp_externa_c": -60,
            "vento_m_s": 10,
        },
        "operacional": {
            # Os mesmos cinco módulos que pousaram na Fase 2.
            # prioridade: 1 = mais importante. essencial = nunca desligar.
            "modulos": {
                "Habitação": {"consumo_kw": 25, "prioridade": 1, "essencial": True,
                              "ligado": True, "estado": "ok"},
                "Médico": {"consumo_kw": 10, "prioridade": 1, "essencial": True,
                           "ligado": True, "estado": "ok"},
                "Energia": {"consumo_kw": 5, "prioridade": 2, "essencial": True,
                            "ligado": True, "estado": "ok"},
                "Logística": {"consumo_kw": 15, "prioridade": 3, "essencial": False,
                              "ligado": True, "estado": "ok"},
                "Laboratório": {"consumo_kw": 20, "prioridade": 4, "essencial": False,
                                "ligado": True, "estado": "ok"},
            },
        },
    }


def criar_historico():
    # Função: séries históricas em listas paralelas (mesma posição = mesma leitura).
    # vento e energia_eolica são exatamente o exemplo do enunciado.
    return {
        "vento": [8, 10, 12],              # m/s
        "energia_eolica": [20, 25, 30],    # kW
        "hora": [6, 9, 12, 15, 18, 21],    # hora do sol marciano
        "consumo": [55, 65, 75, 80, 70, 60],  # kW
    }
