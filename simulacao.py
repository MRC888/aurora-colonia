# Aurora Siger - Fase 3: SIMULAÇÃO de um dia marciano (algoritmo, seção 9).
# O dia de trabalho (8h às 20h) com uma tempestade de poeira de 3 horas,
# seguido da noite até as 6h, hora a hora, com o sistema ainda decidindo.
# A mesma tempestade é vivida por duas colônias iguais:
#   - uma com o sistema REATIVO (só olha a hora atual);
#   - outra com o sistema PREDITIVO (projeta a bateria 3h à frente).
# Separação mundo × sistema: o MUNDO produz sol, vento e consumo;
# o SISTEMA só lê os sensores e decide.

from dados import (criar_colonia, criar_historico, COLONIAS, TEMPESTADES,
                   HORA_INICIO_SIMULACAO, HORA_FIM_SIMULACAO, HORA_AMANHECER,
                   DURACAO_TEMPESTADE,
                   FATOR_POEIRA_TEMPESTADE, VENTO_NORMAL, VENTO_TEMPESTADE,
                   RESERVA_MINIMA_PROJETADA, HORAS_DE_NOITE, consumo_esperado,
                   MODULOS)
from colonia import modulos_da, consumo_total
from previsao import solar_curva, ajustar_reta, eolica_prevista
from energia import limitar
from sistema import processar_leitura, registrar


def em_tempestade(hora, chave_tempestade):
    # Função: a hora está dentro da tempestade escolhida? (None = dia limpo)
    if chave_tempestade is None:
        return False
    inicio = TEMPESTADES[chave_tempestade]["inicio"]
    return hora >= inicio and hora < inicio + DURACAO_TEMPESTADE


def clima_do_mundo(hora, chave_tempestade):
    # Função: o que o MUNDO entrega naquela hora (o sistema não controla isso).
    if em_tempestade(hora, chave_tempestade):
        return {"solar_kw": solar_curva(hora) * FATOR_POEIRA_TEMPESTADE,
                "vento_m_s": VENTO_TEMPESTADE, "tempestade": True}
    return {"solar_kw": solar_curva(hora), "vento_m_s": VENTO_NORMAL,
            "tempestade": False}


def deficit_da_noite():
    # Função: conta de DIMENSIONAMENTO da bateria (kWh): 10 h × (consumo dormindo − eólica).
    # Vale com todos os módulos ligados. O amanhecer real vem da simulação da noite.
    historico = criar_historico()
    beta0, beta1 = ajustar_reta(historico["vento"], historico["energia_eolica"])
    consumo_noite = 0
    for nome in MODULOS:
        consumo_noite = consumo_noite + consumo_esperado(nome, 22)
    falta_por_hora = consumo_noite - eolica_prevista(beta0, beta1, VENTO_NORMAL)
    return HORAS_DE_NOITE * falta_por_hora


def simular_dia(tipo_colonia, chave_tempestade, preditivo):
    # Função: simula das 8h às 6h do dia seguinte e devolve as linhas e o resumo.
    # A contagem segue além de 24 (26 = 2h da madrugada); os sensores leem hora % 24.
    colonia = criar_colonia(tipo_colonia)
    historico = criar_historico()
    beta0, beta1 = ajustar_reta(historico["vento"], historico["energia_eolica"])
    capacidade = colonia["energetico"]["bateria"]["capacidade_kwh"]
    diario = []
    linhas = []
    desperdicio_kwh = 0

    for hora in range(HORA_INICIO_SIMULACAO, HORA_AMANHECER):
        clima = clima_do_mundo(hora, chave_tempestade)
        bateria_inicio = colonia["energetico"]["bateria"]["nivel_pct"]
        leitura = {"hora": hora % 24, "bateria_pct": bateria_inicio,
                   "geracao_solar_kw": clima["solar_kw"],
                   "vento_m_s": clima["vento_m_s"], "temp_externa_c": -60,
                   "tempestade": clima["tempestade"]}
        resultado = processar_leitura(colonia, leitura, historico, preditivo)
        registrar(diario, resultado)

        # O mundo cobra a conta da hora, já com as ações tomadas.
        geracao = clima["solar_kw"] + eolica_prevista(beta0, beta1, clima["vento_m_s"])
        consumo = consumo_total(modulos_da(colonia))
        energia_kwh = bateria_inicio / 100 * capacidade + (geracao - consumo) * 1
        if energia_kwh > capacidade:
            desperdicio_kwh = desperdicio_kwh + (energia_kwh - capacidade)
        energia_kwh = limitar(energia_kwh, 0, capacidade)
        bateria_fim = energia_kwh / capacidade * 100
        colonia["energetico"]["bateria"]["nivel_pct"] = bateria_fim

        desligados = []
        modulos = modulos_da(colonia)
        for nome in modulos:
            if not modulos[nome]["ligado"]:
                desligados.append(nome)
        linhas.append({
            "hora": hora % 24, "tempestade": clima["tempestade"],
            "noite": hora >= HORA_FIM_SIMULACAO,
            "bateria_inicio_pct": bateria_inicio, "bateria_fim_pct": bateria_fim,
            "geracao_kw": geracao, "consumo_kw": consumo,
            "situacao": resultado["situacao"], "projecao_pct": resultado["projecao_pct"],
            "acoes": resultado["acoes"], "desligados": desligados,
        })

    sistema = "reativo"
    if preditivo:
        sistema = "preditivo"
    return {
        "colonia": tipo_colonia,
        "tempestade": chave_tempestade,
        "sistema": sistema,
        "linhas": linhas,
        "diario": diario,
        "resumo": resumir(linhas, capacidade, COLONIAS[tipo_colonia]["piso_pct"],
                          desperdicio_kwh),
    }


def resumir(linhas, capacidade, piso_pct, desperdicio_kwh):
    # Função: o placar do dia e da noite (o que o painel e o PDF comparam).
    menor = linhas[0]["bateria_inicio_pct"]   # o início do dia também conta
    horas_criticas = 0
    horas_criticas_dia = 0
    modulo_horas = 0
    modulo_horas_dia = 0
    bateria_20h = 0
    for linha in linhas:
        if linha["bateria_fim_pct"] < menor:
            menor = linha["bateria_fim_pct"]
        fora = len(linha["desligados"])
        modulo_horas = modulo_horas + fora
        if linha["situacao"] == "CRITICO":
            horas_criticas = horas_criticas + 1
        if not linha["noite"]:
            bateria_20h = linha["bateria_fim_pct"]
            modulo_horas_dia = modulo_horas_dia + fora
            if linha["situacao"] == "CRITICO":
                horas_criticas_dia = horas_criticas_dia + 1
    amanhecer_pct = linhas[len(linhas) - 1]["bateria_fim_pct"]
    return {
        "bateria_20h_pct": bateria_20h,
        "menor_bateria_pct": menor,
        "horas_criticas": horas_criticas,
        "horas_criticas_dia": horas_criticas_dia,
        "modulo_horas_desligados": modulo_horas,
        "modulo_horas_desligados_dia": modulo_horas_dia,
        "desperdicio_kwh": desperdicio_kwh,
        "reserva_para_noite": bateria_20h >= RESERVA_MINIMA_PROJETADA,
        "amanhecer_pct": amanhecer_pct,
        "amanhece_acima_do_piso": amanhecer_pct >= piso_pct,
    }


def comparar(tipo_colonia, chave_tempestade):
    # Função: roda os dois sistemas sob a MESMA tempestade.
    return {
        "reativo": simular_dia(tipo_colonia, chave_tempestade, False),
        "preditivo": simular_dia(tipo_colonia, chave_tempestade, True),
    }


# As 4 simulações da seção 9: 2 colônias × 2 tempestades.
SIMULACOES = {
    "9a": ("A", "manha"),
    "9b": ("A", "tarde"),
    "9c": ("B", "manha"),
    "9d": ("B", "tarde"),
}


def simular_todas():
    # Função: roda as 4 combinações e devolve {"9a": comparação, ...}.
    resultados = {}
    for codigo in SIMULACOES:
        tipo, tempestade = SIMULACOES[codigo]
        resultados[codigo] = comparar(tipo, tempestade)
    return resultados
