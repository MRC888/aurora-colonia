# Aurora Siger - Fase 3: SISTEMA INTELIGENTE DA COLÔNIA (ponto de entrada).
# O avaliador escolhe num menu o que quer ver:
#   - um cenário pronto (entrada → regra → saída);
#   - uma das 4 simulações do dia (reativo × preditivo);
#   - a árvore de dados da colônia;
#   - a exportação dos números para o painel.
#
# Uso: python main.py → abre o menu; digite a opção (ex.: 1, 9b, todos) e Enter.

from dados import criar_colonia, criar_historico, COLONIAS, TEMPESTADES
from colonia import mostrar_arvore
from energia import formatar
from cenarios import CENARIOS, buscar_cenario
from sistema import processar_leitura
from simulacao import SIMULACOES, comparar
from painel import exportar_painel

LINHA = "=" * 72


def exibir_relatorio(cenario, resultado):
    # Procedimento: mostra entrada → processamento → saída de um cenário.
    print(LINHA)
    print("Cenário", cenario["id"], "(" + cenario["origem"] + "):", cenario["titulo"])
    print(LINHA)
    leitura = cenario["leitura"]
    print("ENTRADA")
    print("  hora", leitura["hora"], "h · bateria", leitura["bateria_pct"], "% ·",
          "solar", leitura["geracao_solar_kw"], "kW · vento", leitura["vento_m_s"], "m/s",
          "· colônia", cenario["colonia"])
    if "erro" in resultado:
        print()
        print("SAÍDA")
        print(" ", resultado["erro"])
        return
    print()
    print("PREVISÃO")
    print("  reta eólica: ŷ = " + formatar(resultado["beta0"]) + " + "
          + formatar(resultado["beta1"]) + "·vento   (R² = " + formatar(resultado["r2"]) + ")")
    print("  eólica prevista:", formatar(resultado["eolica_prevista_kw"]), "kW ·",
          "fator de poeira:", formatar(resultado["fator_poeira"], 2))
    print("  bateria projetada em 3h:", formatar(resultado["projecao_pct"]), "%")
    print()
    print("ENERGIA")
    print("  geração", formatar(resultado["geracao_kw"]), "kW · consumo",
          formatar(resultado["consumo_kw"]), "kW")
    print(" ", resultado["balanco"])
    for anomalia in resultado["anomalias"]:
        print(" ", anomalia["aviso"])
    print()
    print("DECISÃO")
    print("  regra usada:", resultado["regra"])
    print(" ", resultado["mensagem"])
    if resultado["acoes"]:
        print()
        print("AÇÕES")
        for acao in resultado["acoes"]:
            print("  -", acao)
        print("  consumo depois das ações:", formatar(resultado["consumo_depois_kw"]),
              "kW · projeção depois:", formatar(resultado["projecao_depois_pct"]), "%")


def rodar_cenario(cenario):
    # Procedimento: processa um cenário numa colônia nova e mostra o relatório.
    colonia = criar_colonia(cenario["colonia"])
    resultado = processar_leitura(colonia, dict(cenario["leitura"]), criar_historico())
    exibir_relatorio(cenario, resultado)


def exibir_simulacao(codigo):
    # Procedimento: mostra a mesma tempestade nos dois sistemas e o placar.
    tipo, chave = SIMULACOES[codigo]
    resultado = comparar(tipo, chave)
    print(LINHA)
    print("Simulação", codigo + ":", COLONIAS[tipo]["nome"], "·", TEMPESTADES[chave]["nome"],
          "(" + str(TEMPESTADES[chave]["inicio"]) + "h, 3h de duração)")
    print(LINHA)
    print(" (bateria = nível no FIM da hora · proj. = projeção de 3h feita no início da hora)")
    print(" hora | reativo: bateria  situação  desligados   | preditivo: bateria  proj.  situação  desligados")
    reativo = resultado["reativo"]["linhas"]
    preditivo = resultado["preditivo"]["linhas"]
    for i in range(len(reativo)):
        r = reativo[i]
        p = preditivo[i]
        marca = "☁" if r["tempestade"] else " "
        print(" %2dh%s | %6s%%  %-9s %-14s | %6s%%  %5s%%  %-9s %s" % (
            r["hora"], marca, formatar(r["bateria_fim_pct"]), r["situacao"],
            abreviar(r["desligados"]), formatar(p["bateria_fim_pct"]),
            formatar(p["projecao_pct"]), p["situacao"], abreviar(p["desligados"])))
    print()
    print("PLACAR (☁ = hora de tempestade)")
    for sistema in ["reativo", "preditivo"]:
        resumo = resultado[sistema]["resumo"]
        print("  %-9s às 20h: %s%% · menor: %s%% · horas críticas: %d · amanhece com %s%% (%s)" % (
            sistema, formatar(resumo["bateria_20h_pct"]), formatar(resumo["menor_bateria_pct"]),
            resumo["horas_criticas"], formatar(resumo["amanhecer_pct"]),
            "acima do piso" if resumo["amanhece_acima_do_piso"] else "ABAIXO DO PISO"))
    print()
    print("Diário do preditivo (só as horas com ação):")
    for registro in resultado["preditivo"]["diario"]:
        if registro.get("acoes"):
            print("  %2dh · %s · regra: %s" % (registro["hora"], registro["situacao"], registro["regra"]))
            for acao in registro["acoes"]:
                print("        -", acao)


def abreviar(nomes):
    # Função: "Laboratório, Logística" → "Lab,Log" para caber na tabela.
    curtos = []
    for nome in nomes:
        curtos.append(nome[:3])
    if not curtos:
        return "-"
    return ",".join(curtos)


def mostrar_menu():
    # Procedimento: lista as opções do avaliador.
    print(LINHA)
    print("COLÔNIA AURORA — Centro de Operações (escolha o que quer ver)")
    print(LINHA)
    for cenario in CENARIOS:
        print("  %-4s %s" % (cenario["id"], cenario["titulo"]))
    for codigo in SIMULACOES:
        tipo, chave = SIMULACOES[codigo]
        print("  %-4s Simulação: %s × %s" % (codigo, COLONIAS[tipo]["nome"], TEMPESTADES[chave]["nome"]))
    print("  arv  Árvore de dados da colônia")
    print("  pnl  Exportar os números para o painel (painel/dados.js)")
    print("  todos  Rodar tudo · sair  Encerrar")


def executar(opcao):
    # Função: executa uma opção do menu. Devolve False quando é para sair.
    opcao = opcao.strip().lower()
    if opcao in ["sair", "q", ""]:
        return False
    if opcao == "todos":
        for cenario in CENARIOS:
            rodar_cenario(cenario)
            print()
        for codigo in SIMULACOES:
            exibir_simulacao(codigo)
            print()
        return True
    if opcao == "arv":
        mostrar_arvore(criar_colonia())
        return True
    if opcao == "pnl":
        print("Gravado em", exportar_painel())
        return True
    if opcao in SIMULACOES:
        exibir_simulacao(opcao)
        return True
    cenario = buscar_cenario(opcao)
    if cenario is None:
        print("Opção não encontrada:", opcao)
    else:
        rodar_cenario(cenario)
    return True


def main():
    # Procedimento: mostra o menu, lê a opção e executa, até o avaliador sair.
    continuar = True
    while continuar:
        mostrar_menu()
        try:
            opcao = input("Opção: ")
        except EOFError:   # entrada fechada (ex.: rodando por um script)
            break
        print()
        continuar = executar(opcao)
        print()


if __name__ == "__main__":
    main()
