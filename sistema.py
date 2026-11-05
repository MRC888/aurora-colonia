# Aurora Siger - Fase 3: O SISTEMA (algoritmo, seção 4).
# Junta as camadas numa sequência só: entrada → validação → anomalias →
# previsão → energia → decisão → ação → registro.
# A mesma função atende o menu de cenários e cada hora da simulação.

from colonia import (validar, aplicar_leitura, modulos_da, consumo_total,
                     geracao_total)
from previsao import ajustar_reta, r2, eolica_prevista, fator_poeira
from energia import balanco, detectar_anomalias, formatar
from regras import (SITUACOES, decidir, regra_usada, projecao_desfavoravel,
                    projetar, cortar_cargas, religar_cargas)


def processar_leitura(colonia, leitura, historico, preditivo=True):
    # Função: processa UMA leitura dos sensores e devolve o resultado completo.
    # preditivo=True  → usa a projeção da bateria em 3h (o sistema novo);
    # preditivo=False → REATIVO: só olha a hora atual (como as fases antigas).
    valida, motivo = validar(leitura)
    if not valida:
        return {"erro": "ERRO: leitura inválida — " + motivo}

    # Previsão eólica: a reta é ajustada sobre o histórico do enunciado.
    beta0, beta1 = ajustar_reta(historico["vento"], historico["energia_eolica"])
    qualidade = r2(historico["vento"], historico["energia_eolica"], beta0, beta1)
    eolica = eolica_prevista(beta0, beta1, leitura["vento_m_s"])
    aplicar_leitura(colonia, leitura, eolica)

    hora = leitura["hora"]
    bateria_pct = leitura["bateria_pct"]
    modulos = modulos_da(colonia)

    # Energia: o que entra, o que sai e quem está fora do normal.
    anomalias = detectar_anomalias(modulos, hora)
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
    if situacao == "CRITICO" or situacao == "ECONOMIA":
        acoes = cortar_cargas(colonia, hora, anomalias, "todos",
                              "situação " + SITUACOES[situacao].split(":")[0], prev)
    elif preditivo and previsao_ruim:
        acoes = cortar_cargas(colonia, hora, anomalias, "ate_70",
                              "bateria projetada em " + formatar(projecao)
                              + "% em 3h (abaixo de 70% e caindo)", prev)
    else:
        acoes = religar_cargas(colonia, hora, prev, preditivo, geracao)

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
        "situacao": situacao,
        "mensagem": SITUACOES[situacao],
        "regra": regra,
        "acoes": acoes,
    }


def registrar(diario, resultado):
    # Procedimento: guarda a decisão no diário (lista), com o motivo.
    if "erro" in resultado:
        diario.append({"erro": resultado["erro"]})
        return
    avisos = []
    for anomalia in resultado["anomalias"]:
        avisos.append(anomalia["aviso"])
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
    })
