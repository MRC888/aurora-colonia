# Aurora Siger - Fase 3: ESTRUTURA da colônia.
# Funções para navegar na árvore de dicionários e somar valores.
# Não decide nada: só encontra e organiza os dados.

from dados import criar_colonia, criar_historico


def buscar(colonia, caminho):
    # Função: acha um valor pelo caminho de chaves, ex.: "energetico/eolico/geracao_kw".
    # Cada passo é um acesso direto ao dicionário (tabela hash, Cap 4).
    # Devolve None quando o caminho não existe, sem quebrar o programa.
    atual = colonia
    for chave in caminho.split("/"):
        if type(atual) != dict or chave not in atual:
            return None
        atual = atual[chave]
    return atual


def percorrer(no, nivel=0):
    # Função recursiva (Cap 3): devolve as linhas da árvore com recuo por nível.
    # Parada: quando o valor não é dicionário, ele vira uma linha e não há nova chamada.
    linhas = []
    for chave in no:
        valor = no[chave]
        recuo = "    " * nivel
        if type(valor) == dict:
            linhas.append(recuo + chave)
            linhas = linhas + percorrer(valor, nivel + 1)
        else:
            linhas.append(recuo + chave + " = " + str(valor))
    return linhas


def mostrar_arvore(colonia):
    # Procedimento (sem return): só exibe a árvore na tela.
    for linha in percorrer(colonia):
        print(linha)


def consumo_total(modulos):
    # Função: soma o consumo apenas dos módulos ligados.
    total = 0
    for nome in modulos:
        if modulos[nome]["ligado"]:
            total = total + modulos[nome]["consumo_kw"]
    return total


def geracao_total(colonia):
    # Função: geração atual = solar + eólica.
    solar = buscar(colonia, "energetico/solar/geracao_kw")
    eolica = buscar(colonia, "energetico/eolico/geracao_kw")
    return solar + eolica


if __name__ == "__main__":
    # Demonstração do M1: roda só quando este arquivo é executado diretamente.
    colonia = criar_colonia()
    historico = criar_historico()
    print("=== Árvore da colônia ===")
    mostrar_arvore(colonia)
    print()
    print("=== Busca por chave ===")
    for caminho in ["energetico/bateria/nivel_pct",
                    "energetico/eolico/geracao_kw",
                    "operacional/modulos/Médico/essencial",
                    "energetico/nuclear/geracao_kw"]:
        print(caminho, "->", buscar(colonia, caminho))
    print()
    modulos = buscar(colonia, "operacional/modulos")
    print("Geração atual:", geracao_total(colonia), "kW")
    print("Consumo atual:", consumo_total(modulos), "kW")
    print("Histórico de vento:", historico["vento"])
    print("Histórico de energia eólica:", historico["energia_eolica"])
