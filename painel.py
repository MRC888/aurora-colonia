# Aurora Siger - Fase 3: EXPORTAÇÃO PARA O PAINEL (algoritmo, seção 10.1).
# O Python calcula tudo e grava painel/dados.js. O HTML do painel só LÊ e
# MOSTRA esse arquivo, sem recalcular nada: assim README, PDF e painel
# usam exatamente os mesmos números.
# json e os são da biblioteca padrão do Python (não são externas).

import json
import os

from dados import criar_colonia, criar_historico, COLONIAS, TEMPESTADES
from colonia import percorrer
from previsao import ajustar_reta, r2, prever
from energia import eolica_fisica_calibrada
from simulacao import simular_todas, SIMULACOES
from cenarios import CENARIOS
from sistema import processar_leitura


def dados_previsao():
    # Função: a reta, o R² e a comparação reta × física para a tela 4.
    historico = criar_historico()
    beta0, beta1 = ajustar_reta(historico["vento"], historico["energia_eolica"])
    comparacao = []
    for vento in [8, 10, 12, 15, 20]:
        comparacao.append({"vento_m_s": vento,
                           "reta_kw": prever(beta0, beta1, vento),
                           "fisica_kw": eolica_fisica_calibrada(vento)})
    return {"beta0": beta0, "beta1": beta1,
            "r2": r2(historico["vento"], historico["energia_eolica"], beta0, beta1),
            "pontos": {"vento": historico["vento"], "energia": historico["energia_eolica"]},
            "reta_x_fisica": comparacao}


def dados_cenarios():
    # Função: o resultado de cada cenário pronto (diário de decisões).
    saida = []
    for cenario in CENARIOS:
        resultado = processar_leitura(criar_colonia(cenario["colonia"]),
                                      dict(cenario["leitura"]), criar_historico())
        saida.append({"id": cenario["id"], "titulo": cenario["titulo"],
                      "origem": cenario["origem"], "resultado": resultado})
    return saida


def exportar_painel(caminho=os.path.join("painel", "dados.js")):
    # Procedimento: grava todos os números num arquivo JavaScript.
    pasta = os.path.dirname(caminho)
    if pasta and not os.path.isdir(pasta):
        os.makedirs(pasta)
    dados = {
        "arvore": percorrer(criar_colonia()),
        "colonias": COLONIAS,
        "tempestades": TEMPESTADES,
        "previsao": dados_previsao(),
        "simulacoes": simular_todas(),
        "simulacoes_combinacoes": SIMULACOES,
        "cenarios": dados_cenarios(),
    }
    with open(caminho, "w", encoding="utf-8") as arquivo:
        arquivo.write("// Gerado por painel.py. NÃO editar à mão: rode python painel.py\n")
        arquivo.write("const DADOS = ")
        arquivo.write(json.dumps(dados, ensure_ascii=False, indent=1))
        arquivo.write(";\n")
    return caminho


if __name__ == "__main__":
    print("Gravado em", exportar_painel())
