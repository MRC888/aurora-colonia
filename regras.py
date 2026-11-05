# Aurora Siger - Fase 3: REGRAS DE DECISÃO (algoritmo, seção 8).
# Variáveis lógicas, expressões booleanas, corte e religamento de cargas.
# Regra herdada das Fases 1 e 2: SEGURANÇA ANTES DE PRIORIDADE.
# Energia, Habitação e Médico são essenciais e nunca entram no corte.

from dados import (ENERGIA_CRITICA, ENERGIA_BAIXA, CONSUMO_ALTO,
                   RESERVA_MINIMA_PROJETADA, MARGEM_RELIGAR,
                   TEMPO_MINIMO_DESLIGADO, EXIGIR_QUEDA)
from colonia import modulos_da, consumo_total
from energia import projetar_bateria, formatar, formatar_abaixo

# Código da situação → mensagem exibida. A mesma cor/situação em todo lugar.
SITUACOES = {
    "CRITICO": "CRÍTICO: modo emergência — só suporte à vida",
    "ECONOMIA": "MODO ECONOMIA: desligar sistemas não essenciais",
    "ALERTA": "ALERTA: reduzir consumo",
    "NORMAL": "NORMAL: operação padrão",
}


def projecao_desfavoravel(bateria_pct, projecao_pct):
    # Função: variável P do preditivo.
    # A projeção é ruim quando fica abaixo de 70% E (com EXIGIR_QUEDA) a
    # bateria está caindo. Uma bateria subindo de 53% para 65% de manhã
    # está se recuperando, não em perigo.
    abaixo = projecao_pct < RESERVA_MINIMA_PROJETADA
    if not EXIGIR_QUEDA:
        return abaixo
    return abaixo and projecao_pct < bateria_pct


def variaveis_logicas(bateria_pct, consumo_kw, previsao_ruim):
    # Função: as quatro perguntas de sim/não da decisão (seção 8.1).
    return {
        "C": bateria_pct < ENERGIA_CRITICA,   # bateria crítica?
        "B": bateria_pct < ENERGIA_BAIXA,     # bateria baixa?
        "A": consumo_kw > CONSUMO_ALTO,       # consumo alto?
        "P": previsao_ruim,                   # previsão desfavorável?
    }


def decidir(bateria_pct, consumo_kw, previsao_ruim):
    # Função: transforma os dados numa situação (seção 8.3).
    #   ECONOMIA   = B·A
    #   RISCO      = B·A·P
    #   EMERGÊNCIA = C + RISCO
    # Pela lei da absorção, B·A + B·A·P = B·A: todo RISCO também é ECONOMIA.
    # Por isso o RISCO é testado ANTES; senão nunca seria alcançado.
    v = variaveis_logicas(bateria_pct, consumo_kw, previsao_ruim)
    if v["C"] or (v["B"] and v["A"] and v["P"]):
        return "CRITICO"
    if v["B"] and v["A"]:
        return "ECONOMIA"
    if v["B"]:
        return "ALERTA"
    return "NORMAL"


def regra_usada(bateria_pct, consumo_kw, previsao_ruim, preditivo=True):
    # Função: explica qual expressão booleana disparou (vai para o diário).
    # No reativo, P é só "geração < consumo" e não dispara corte sozinha.
    v = variaveis_logicas(bateria_pct, consumo_kw, previsao_ruim)
    if v["C"]:
        return "C: bateria < " + str(ENERGIA_CRITICA) + "%"
    if v["B"] and v["A"] and v["P"]:
        return "B·A·P: bateria baixa, consumo alto e previsão desfavorável"
    if v["B"] and v["A"]:
        return "B·A: bateria baixa e consumo alto"
    texto_p = "P: projeção abaixo de " + str(RESERVA_MINIMA_PROJETADA) + "% e caindo"
    if v["B"]:
        if v["P"] and preditivo:
            return "B: bateria < " + str(ENERGIA_BAIXA) + "% · " + texto_p
        return "B: bateria < " + str(ENERGIA_BAIXA) + "%"
    if v["P"] and preditivo:
        return texto_p
    return "nenhuma regra de alerta"


def ordenar_por_prioridade(nomes, modulos, decrescente):
    # Função: ordenação por inserção (a mesma da Fase 2), sem sorted/lambda.
    # decrescente=True põe a MENOR importância primeiro (Laboratório → Logística).
    ordenados = []
    for nome in nomes:
        posicao = len(ordenados)
        while posicao > 0:
            anterior = modulos[ordenados[posicao - 1]]["prioridade"]
            atual = modulos[nome]["prioridade"]
            if (decrescente and anterior < atual) or (not decrescente and anterior > atual):
                posicao = posicao - 1
            else:
                break
        ordenados.insert(posicao, nome)
    return ordenados


def fila_de_corte(modulos, anomalias):
    # Função: a ordem de desligamento (seção 8.4).
    # 1º os NÃO essenciais em anomalia (quem causou o pico sai primeiro);
    # 2º os demais não essenciais, da menor prioridade para a maior.
    # Anomalia num essencial (ex.: Médico após um acidente) não muda a fila.
    em_anomalia = []
    for anomalia in anomalias:
        nome = anomalia["modulo"]
        if not modulos[nome]["essencial"] and modulos[nome]["ligado"]:
            em_anomalia.append(nome)
    demais = []
    for nome in modulos:
        modulo = modulos[nome]
        if not modulo["essencial"] and modulo["ligado"] and nome not in em_anomalia:
            demais.append(nome)
    return (ordenar_por_prioridade(em_anomalia, modulos, True)
            + ordenar_por_prioridade(demais, modulos, True))


def desligar(modulo, hora):
    # Procedimento: desliga o módulo e anota a hora (para o tempo mínimo).
    modulo["ligado"] = False
    modulo["desligado_desde"] = hora


def projetar(colonia, hora, prev):
    # Função: atalho para a projeção com o contexto de previsão da hora.
    # prev = {"fator", "vento", "beta0", "beta1"}
    return projetar_bateria(colonia, hora, prev["fator"], prev["vento"],
                            prev["beta0"], prev["beta1"])


def cortar_cargas(colonia, hora, anomalias, modo, motivo, prev):
    # Função: desliga não essenciais e devolve a lista de ações (texto).
    # modo "todos": disparado pela SITUAÇÃO (CRÍTICO/ECONOMIA) → todos saem.
    # modo "ate_70": disparado só pela PROJEÇÃO → sai um por vez até a
    #                projeção voltar a 70% (prev é obrigatório nesse modo).
    modulos = modulos_da(colonia)
    acoes = []
    nomes_em_anomalia = []
    for anomalia in anomalias:
        nomes_em_anomalia.append(anomalia["modulo"])
    for nome in fila_de_corte(modulos, anomalias):
        if modo == "ate_70" and projetar(colonia, hora, prev) >= RESERVA_MINIMA_PROJETADA:
            break
        desligar(modulos[nome], hora)
        porque = motivo
        if nome in nomes_em_anomalia:
            porque = "anomalia de consumo (quem causou sai primeiro); " + motivo
        acoes.append("Desligado: " + nome + " — motivo: " + porque)
    # O aviso só sai na hora em que houve corte, e só quem projeta pode dar o aviso.
    if acoes and prev is not None:
        final = projetar(colonia, hora, prev)
        if final < RESERVA_MINIMA_PROJETADA:
            acoes.append("ATENÇÃO: só restou o suporte à vida; reserva projetada em "
                         + formatar_abaixo(final) + "%")
    return acoes


def religar_cargas(colonia, hora, prev, usar_projecao, geracao_atual=0, pendencias=None):
    # Função: religa sozinho, do mais importante para o menos (seção 8.5).
    # Histerese híbrida, para não virar pisca-pisca:
    #   1. desligado há pelo menos 2 horas;
    #   2. (preditivo) projeção com ele ligado ≥ 80% — zona morta entre 70 e 80;
    #   3. "faz de conta" que religou: a situação não pode voltar a CRÍTICO/ECONOMIA.
    # usar_projecao=False é o modo REATIVO (só as condições 1 e 3).
    # O faz de conta liga o módulo, mede e DESFAZ se alguma condição falhar.
    # pendencias: lista opcional que recebe o motivo de quem não religou.
    if pendencias is None:
        pendencias = []
    modulos = modulos_da(colonia)
    bateria_pct = colonia["energetico"]["bateria"]["nivel_pct"]
    desligados = []
    for nome in modulos:
        modulo = modulos[nome]
        if not modulo["ligado"] and not modulo["essencial"]:
            desligados.append(nome)
    acoes = []
    for nome in ordenar_por_prioridade(desligados, modulos, False):
        modulo = modulos[nome]
        # % 24 para a conta funcionar na virada do dia (desligado às 23h, agora 1h: 2h).
        # Como a hora é do dia, a conta vale para até 24h fora; a simulação vai até 22h.
        tempo_fora = (hora - modulo["desligado_desde"]) % 24
        if tempo_fora < TEMPO_MINIMO_DESLIGADO:
            pendencias.append("Aguardando: " + nome + " — desligado há só " + str(tempo_fora)
                              + "h (mínimo de " + str(TEMPO_MINIMO_DESLIGADO) + "h)")
            continue
        # Faz de conta: liga com o consumo esperado da hora.
        consumo_antes = modulo["consumo_atual_kw"]
        modulo["ligado"] = True
        modulo["consumo_atual_kw"] = modulo["perfil_kw"][hora % 24]
        consumo_se_religar = consumo_total(modulos)
        aprovado = True
        texto_projecao = ""
        motivo = ""
        if usar_projecao:
            projecao = projetar(colonia, hora, prev)
            texto_projecao = " — projeção em " + formatar(projecao) + "%"
            if projecao < MARGEM_RELIGAR:
                aprovado = False
                motivo = "projeção com ele ligado em " + formatar_abaixo(projecao) + "% (mínimo de 80%)"
            situacao = decidir(bateria_pct, consumo_se_religar,
                               projecao_desfavoravel(bateria_pct, projecao))
        else:
            # Reativo: não projeta; a "previsão" dele é só geração atual < consumo.
            situacao = decidir(bateria_pct, consumo_se_religar,
                               geracao_atual < consumo_se_religar)
        if situacao == "CRITICO" or situacao == "ECONOMIA":
            aprovado = False
            motivo = "voltaria à situação " + SITUACOES[situacao].split(":")[0]
        if aprovado:
            modulo["desligado_desde"] = None
            acoes.append("Religado: " + nome + texto_projecao)
        else:
            modulo["ligado"] = False   # desfaz o faz de conta
            modulo["consumo_atual_kw"] = consumo_antes
            pendencias.append("Aguardando: " + nome + " — " + motivo)
    return acoes
