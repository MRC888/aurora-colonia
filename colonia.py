# Aurora Siger - Fase 3: ESTRUTURA da colônia.
# Funções para navegar na árvore de dicionários, somar valores e validar leituras.
# Não decide nada: só encontra, organiza e confere os dados.

from dados import criar_colonia


def buscar(colonia, caminho):
    # Função: acha um valor pelo caminho de chaves, ex.: "energetico/eolico/geracao_kw".
    # Cada passo é um acesso direto ao dicionário (tabela hash).
    # Devolve None quando o caminho não existe, sem quebrar o programa.
    atual = colonia
    for chave in caminho.split("/"):
        if type(atual) != dict or chave not in atual:
            return None
        atual = atual[chave]
    return atual


def percorrer(no, nivel=0):
    # Função recursiva: devolve as linhas da árvore com recuo por nível.
    # Parada: quando o valor não é dicionário, ele vira uma linha e não há nova chamada.
    linhas = []
    for chave in no:
        valor = no[chave]
        recuo = "    " * nivel
        if type(valor) == dict:
            linhas.append(recuo + chave)
            linhas = linhas + percorrer(valor, nivel + 1)
        elif type(valor) == list:
            # O perfil de 24 horas ocuparia a tela toda: mostra só o tamanho.
            linhas.append(recuo + chave + " = lista com " + str(len(valor)) + " valores")
        else:
            linhas.append(recuo + chave + " = " + str(valor))
    return linhas


def mostrar_arvore(colonia):
    # Procedimento (sem return): só exibe a árvore na tela.
    for linha in percorrer(colonia):
        print(linha)


def modulos_da(colonia):
    # Função: atalho para o dicionário de módulos.
    return colonia["operacional"]["modulos"]


def consumo_total(modulos):
    # Função: soma o consumo ATUAL (medido) apenas dos módulos ligados.
    total = 0
    for nome in modulos:
        if modulos[nome]["ligado"]:
            total = total + modulos[nome]["consumo_atual_kw"]
    return total


def geracao_total(colonia):
    # Função: geração atual = solar + eólica.
    solar = buscar(colonia, "energetico/solar/geracao_kw")
    eolica = buscar(colonia, "energetico/eolico/geracao_kw")
    return solar + eolica


def e_numero(valor):
    # Função: verdadeiro para int ou float. bool fica de fora de propósito:
    # em Python, True vale 1, e uma leitura "True" não é um número de sensor.
    return type(valor) == int or type(valor) == float


def validar(leitura):
    # Função: confere a leitura dos sensores antes de qualquer decisão.
    # Devolve (True, "") ou (False, motivo). Nunca quebra o programa.
    campos = ["hora", "bateria_pct", "geracao_solar_kw", "vento_m_s", "temp_externa_c"]
    for campo in campos:
        if campo not in leitura:
            return False, "falta o campo '" + campo + "'"
        valor = leitura[campo]
        if not e_numero(valor):
            return False, "'" + campo + "' não é numérico (" + str(valor) + ")"
        if valor < 0 and campo != "temp_externa_c":   # só a temperatura pode ser negativa
            return False, "'" + campo + "' é negativo (" + str(valor) + ")"
    if leitura["bateria_pct"] > 100:
        return False, "bateria fora de 0–100 (" + str(leitura["bateria_pct"]) + ")"
    consumos = leitura.get("consumo_kw", {})
    for nome in consumos:
        if not e_numero(consumos[nome]) or consumos[nome] < 0:
            return False, "consumo de " + nome + " inválido (" + str(consumos[nome]) + ")"
    return True, ""


def aplicar_leitura(colonia, leitura, geracao_eolica_kw):
    # Procedimento: grava a leitura validada dentro da árvore da colônia.
    # A eólica vem calculada de fora (pela reta da previsão), porque a
    # colônia só guarda dados; quem calcula é o modelo.
    colonia["energetico"]["bateria"]["nivel_pct"] = leitura["bateria_pct"]
    colonia["energetico"]["solar"]["geracao_kw"] = leitura["geracao_solar_kw"]
    colonia["energetico"]["eolico"]["vento_m_s"] = leitura["vento_m_s"]
    colonia["energetico"]["eolico"]["geracao_kw"] = geracao_eolica_kw
    colonia["ambiental"]["vento_m_s"] = leitura["vento_m_s"]
    colonia["ambiental"]["temp_externa_c"] = leitura["temp_externa_c"]
    colonia["ambiental"]["tempestade"] = leitura.get("tempestade", False)
    modulos = modulos_da(colonia)
    # "desligados" = {nome do módulo: hora em que foi desligado}.
    # Serve para um cenário começar com módulos já desligados.
    desligados = leitura.get("desligados", {})
    for nome in modulos:
        modulo = modulos[nome]
        if nome in desligados:
            modulo["ligado"] = False
            modulo["desligado_desde"] = desligados[nome]
        # Sem medição informada, o andar gasta o esperado para a hora.
        esperado = modulo["perfil_kw"][leitura["hora"] % 24]
        modulo["consumo_atual_kw"] = leitura.get("consumo_kw", {}).get(nome, esperado)


if __name__ == "__main__":
    # Demonstração: roda só quando este arquivo é executado diretamente.
    colonia = criar_colonia()
    print("=== Árvore da colônia ===")
    mostrar_arvore(colonia)
    print()
    print("=== Busca por chave ===")
    for caminho in ["energetico/bateria/nivel_pct",
                    "energetico/bateria/capacidade_kwh",
                    "operacional/modulos/Médico/essencial",
                    "energetico/nuclear/geracao_kw"]:
        print(caminho, "->", buscar(colonia, caminho))
