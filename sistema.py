# Aurora Siger - Fase 3: O SISTEMA (algoritmo, seção 4).
# Junta as camadas numa sequência só: entrada → validação → anomalias →
# previsão → energia → decisão → ação → registro.
# A mesma função atende o menu de cenários e cada hora da simulação.

from colonia import (validar, aplicar_leitura, modulos_da, consumo_total,
                     geracao_total)
from previsao import ajustar_reta, r2, eolica_prevista, fator_poeira
from energia import (balanco, detectar_anomalias, detectar_falhas, formatar,
                     formatar_abaixo)
from regras import (SITUACOES, decidir, regra_usada, projecao_desfavoravel,
                    projetar, cortar_cargas, religar_cargas)
from dados import EXIGIR_QUEDA


def atualizar_historico(historico, leitura):
    # Procedimento: uma medição real de eólica entra na série histórica.
    # Assim a reta é refeita com mais dados a cada leitura medida.
    if "eolica_medida_kw" in leitura:
        historico["vento"].append(leitura["vento_m_s"])
        historico["energia_eolica"].append(leitura["eolica_medida_kw"])


def motivo_da_projecao(projecao):
    # Função: o texto do corte preditivo, coerente com a regra em uso.
    texto = "bateria projetada em " + formatar_abaixo(projecao) + "% em 3h (abaixo de 70%"
    if EXIGIR_QUEDA:
        texto = texto + " e caindo"
    return texto + ")"


def observacao_da_decisao(situacao, acoes, preditivo, projecao):
    # Função: explica os dois casos em que a situação e a ação parecem discordar.
    houve_corte = False
    for acao in acoes:
        if acao.startswith("Desligado"):
            houve_corte = True
    if situacao == "NORMAL" and houve_corte:
        return "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
    if situacao == "ALERTA" and not houve_corte:
        if preditivo:
            return ("Sem corte agora: a projeção de " + formatar(projecao)
                    + "% não está caindo abaixo de 70%")
        return "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
    return ""


def processar_leitura(colonia, leitura, historico, preditivo=True):
    # Função: processa UMA leitura dos sensores e devolve o resultado completo.
    # preditivo=True  → usa a projeção da bateria em 3h (o sistema novo);
    # preditivo=False → REATIVO: só olha a hora atual (como as fases antigas).
    valida, motivo = validar(leitura)
    if not valida:
        return {"erro": "ERRO: leitura inválida — " + motivo}

    # Previsão eólica: a reta é ajustada sobre o histórico (enunciado + medições).
    atualizar_historico(historico, leitura)
    reta = ajustar_reta(historico["vento"], historico["energia_eolica"])
    if reta is None:
        return {"erro": "ERRO: histórico inválido — não existe reta com esses dados"}
    beta0, beta1 = reta
    qualidade = r2(historico["vento"], historico["energia_eolica"], beta0, beta1)
    eolica = eolica_prevista(beta0, beta1, leitura["vento_m_s"])
    eolica_atual = leitura.get("eolica_medida_kw", eolica)
    aplicar_leitura(colonia, leitura, eolica_atual)

    hora = leitura["hora"]
    bateria_pct = leitura["bateria_pct"]
    modulos = modulos_da(colonia)

    # Energia: o que entra, o que sai e quem está fora do normal.
    anomalias = detectar_anomalias(modulos, hora)
    falhas = detectar_falhas(modulos)
    colonia["operacional"]["alertas_de_falha"] = falhas
    geracao = geracao_total(colonia)
    consumo = consumo_total(modulos)
    mensagem_balanco = balanco(geracao, consumo)

    # Previsão: projeção da bateria (só no preditivo).
    prev = None
    projecao = None
    fator = None
    if preditivo:
        fator = fator_poeira(leitura["geracao_solar_kw"], hora)
        prev = {"fator": fator, "vento": leitura["vento_m_s"],
                "beta0": beta0, "beta1": beta1}
        projecao = projetar(colonia, hora, prev)
        previsao_ruim = projecao_desfavoravel(bateria_pct, projecao)
    else:
        previsao_ruim = geracao < consumo

    # Decisão.
    situacao = decidir(bateria_pct, consumo, previsao_ruim)
    regra = regra_usada(bateria_pct, consumo, previsao_ruim)

    # Ação: corte pela situação, corte pela projeção, ou tentativa de religar.
    pendencias = []
    if situacao == "CRITICO" or situacao == "ECONOMIA":
        acoes = cortar_cargas(colonia, hora, anomalias, "todos",
                              "situação " + SITUACOES[situacao].split(":")[0], prev)
    elif preditivo and previsao_ruim:
        acoes = cortar_cargas(colonia, hora, anomalias, "ate_70",
                              motivo_da_projecao(projecao), prev)
    else:
        acoes = religar_cargas(colonia, hora, prev, preditivo, geracao, pendencias)

    projecao_depois = None
    if preditivo:
        projecao_depois = projetar(colonia, hora, prev)

    return {
        "hora": hora,
        "bateria_pct": bateria_pct,
        "beta0": beta0, "beta1": beta1, "r2": qualidade,
        "eolica_prevista_kw": eolica,
        "fator_poeira": fator,
        "projecao_pct": projecao,
        "projecao_depois_pct": projecao_depois,
        "geracao_kw": geracao,
        "consumo_kw": consumo,
        "consumo_depois_kw": consumo_total(modulos),
        "balanco": mensagem_balanco,
        "anomalias": anomalias,
        "falhas": falhas,
        "situacao": situacao,
        "mensagem": SITUACOES[situacao],
        "regra": regra,
        "acoes": acoes,
        "pendencias": pendencias,
        "observacao": observacao_da_decisao(situacao, acoes, preditivo, projecao),
    }


def registrar(diario, resultado):
    # Procedimento: guarda a decisão no diário (lista), com o motivo.
    if "erro" in resultado:
        diario.append({"erro": resultado["erro"]})
        return
    avisos = []
    for anomalia in resultado["anomalias"]:
        avisos.append(anomalia["aviso"])
    for falha in resultado["falhas"]:
        avisos.append(falha["aviso"])
    diario.append({
        "hora": resultado["hora"],
        "entrada": "bateria " + formatar(resultado["bateria_pct"]) + "%, geração "
                   + formatar(resultado["geracao_kw"]) + " kW, consumo "
                   + formatar(resultado["consumo_kw"]) + " kW",
        "anomalias": avisos,
        "projecao_pct": resultado["projecao_pct"],
        "regra": resultado["regra"],
        "situacao": resultado["mensagem"],
        "acoes": resultado["acoes"],
        "observacao": resultado["observacao"],
    })
