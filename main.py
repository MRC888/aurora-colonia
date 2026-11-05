# Aurora Siger - Fase 3: SISTEMA INTELIGENTE DA COLÔNIA (ponto de entrada).
# O avaliador escolhe num menu o que quer ver:
#   - um cenário pronto (entrada → regra → saída);
#   - uma das 4 simulações do dia e da noite (reativo × preditivo);
#   - a árvore de dados da colônia;
#   - a comparação entre a reta, a curva calibrada e a fórmula pura do vento;
#   - a exportação dos números para o painel.
#
# Uso: python main.py → abre o menu; digite a opção (ex.: 1, 9b, todos) e Enter.

import sys

from dados import criar_colonia, criar_historico, COLONIAS, TEMPESTADES
from colonia import mostrar_arvore, buscar
from previsao import ajustar_reta, prever
from energia import formatar, formatar_abaixo, eolica_fisica_calibrada, eolica_fisica_pura
from cenarios import CENARIOS, buscar_cenario
from sistema import processar_leitura, registrar
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
    print("  consumo medido:", formatar(resultado["consumo_kw"]), "kW")
    print()
    print("PREVISÃO")
    print("  reta eólica: ŷ = " + formatar(resultado["beta0"], 2) + " + "
          + formatar(resultado["beta1"], 2) + "·vento   (R² = " + formatar(resultado["r2"], 2) + ")")
    print("  eólica prevista:", formatar(resultado["eolica_prevista_kw"]), "kW ·",
          "fator de poeira:", formatar(resultado["fator_poeira"], 2))
    print("  bateria projetada em 3h:", formatar_abaixo(resultado["projecao_pct"]), "%")
    print()
    print("ENERGIA")
    print("  geração", formatar(resultado["geracao_kw"]), "kW · consumo",
          formatar(resultado["consumo_kw"]), "kW")
    print(" ", resultado["balanco"])
    for anomalia in resultado["anomalias"]:
        print(" ", anomalia["aviso"])
    for falha in resultado["falhas"]:
        print(" ", falha["aviso"])
    print()
    print("DECISÃO")
    print("  regra usada:", resultado["regra"])
    print(" ", resultado["mensagem"])
    if resultado["observacao"]:
        print(" ", resultado["observacao"])
    if resultado["acoes"] or resultado["pendencias"]:
        print()
        print("AÇÕES")
        for acao in resultado["acoes"] + resultado["pendencias"]:
            print("  -", acao)
    if resultado["acoes"]:
        print("  consumo depois das ações:", formatar(resultado["consumo_depois_kw"]),
              "kW · projeção depois:", formatar_abaixo(resultado["projecao_depois_pct"]), "%")


def rodar_cenario(cenario):
    # Procedimento: processa um cenário numa colônia nova, registra e mostra o relatório.
    colonia = criar_colonia(cenario["colonia"])
    diario = []
    resultado = processar_leitura(colonia, dict(cenario["leitura"]), criar_historico())
    registrar(diario, resultado)
    exibir_relatorio(cenario, resultado)
    print()
    print("Registros no diário:", len(diario))


def exibir_placar(sistema, resumo):
    # Procedimento: uma linha do placar para cada sistema.
    texto = "ABAIXO DO PISO"
    if resumo["amanhece_acima_do_piso"]:
        texto = "acima do piso"
    print(f"  {sistema:<9} às 20h: {formatar(resumo['bateria_20h_pct'])}%"
          f" · amanhece com {formatar(resumo['amanhecer_pct'])}% ({texto})"
          f" · menor: {formatar(resumo['menor_bateria_pct'])}%")
    print(f"  {'':<9} horas em CRÍTICO: {resumo['horas_criticas']}"
          f" · módulo-horas desligados: {resumo['modulo_horas_desligados_dia']} de dia,"
          f" {resumo['modulo_horas_desligados']} no total")


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
        if i > 0 and r["noite"] and not reativo[i - 1]["noite"]:
            print(" ---- noite: sem sol, consumo de 47 kW com tudo ligado ----")
        marca = " "
        if r["tempestade"]:
            marca = "☁"
        print(f" {r['hora']:2d}h{marca} | {formatar(r['bateria_fim_pct']):>6}%  {r['situacao']:<9}"
              f" {abreviar(r['desligados']):<14} | {formatar(p['bateria_fim_pct']):>6}%"
              f"  {formatar_abaixo(p['projecao_pct']):>5}%  {p['situacao']:<9} {abreviar(p['desligados'])}")
    print()
    print("PLACAR (☁ = hora de tempestade)")
    for sistema in ["reativo", "preditivo"]:
        exibir_placar(sistema, resultado[sistema]["resumo"])
    print()
    print("Diário do preditivo (só as horas com ação):")
    for registro in resultado["preditivo"]["diario"]:
        if registro.get("acoes"):
            print(f"  {registro['hora']:2d}h · {registro['situacao']} · regra: {registro['regra']}")
            if registro["observacao"]:
                print("        ", registro["observacao"])
            for acao in registro["acoes"]:
                print("        -", acao)


def exibir_fisica():
    # Procedimento: compara a reta, a curva v³ calibrada e a fórmula pura.
    historico = criar_historico()
    beta0, beta1 = ajustar_reta(historico["vento"], historico["energia_eolica"])
    print(LINHA)
    print("Vento: reta × curva calibrada × fórmula pura")
    print(LINHA)
    print(" vento | reta (planejamento) | curva v³ calibrada | P = ½·ρ·A·v³ pura")
    for vento in [8, 10, 12, 15, 20]:
        print(f" {vento:3d} m/s | {formatar(prever(beta0, beta1, vento)):>9} kW"
              f"        | {formatar(eolica_fisica_calibrada(vento)):>9} kW"
              f"       | {formatar(eolica_fisica_pura(vento)):>7} kW")
    print()
    print("A fórmula pura mostra que o ar de Marte gera pouco: os 25 kW do enunciado")
    print("são uma hipótese didática. A curva calibrada aceita essa hipótese e mostra")
    print("que, a partir dela, a reta cresce menos que v³ no vento forte.")


def exibir_dados():
    # Procedimento: mostra a hierarquia e o acesso direto por chave.
    colonia = criar_colonia()
    print(LINHA)
    print("Árvore de dados da colônia")
    print(LINHA)
    mostrar_arvore(colonia)
    print()
    print("Busca por chave (acesso direto ao dicionário):")
    for caminho in ["energetico/bateria/nivel_pct",
                    "energetico/bateria/capacidade_kwh",
                    "operacional/modulos/Médico/essencial",
                    "energetico/nuclear/geracao_kw"]:
        print(" ", caminho, "→", buscar(colonia, caminho))


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
        print(f"  {cenario['id']:<4} {cenario['titulo']}")
    for codigo in SIMULACOES:
        tipo, chave = SIMULACOES[codigo]
        print(f"  {codigo:<4} Simulação: {COLONIAS[tipo]['nome']} × {TEMPESTADES[chave]['nome']}")
    print("  arv  Árvore de dados da colônia e busca por chave")
    print("  fis  Vento: reta × curva calibrada × fórmula pura")
    print("  pnl  Exportar os números para o painel (painel/dados.js)")
    print("  todos  Mostrar cenários, simulações, árvore e vento · sair  Encerrar")


def executar(opcao):
    # Função: executa uma opção do menu. Devolve False quando é para sair.
    opcao = opcao.strip().lower()
    if opcao == "sair" or opcao == "q":
        return False
    if opcao == "":
        return True   # Enter sem opção: só mostra o menu de novo
    if opcao == "todos":
        for cenario in CENARIOS:
            rodar_cenario(cenario)
            print()
        for codigo in SIMULACOES:
            exibir_simulacao(codigo)
            print()
        exibir_dados()
        print()
        exibir_fisica()
        return True
    if opcao == "arv":
        exibir_dados()
        return True
    if opcao == "fis":
        exibir_fisica()
        return True
    if opcao == "pnl":
        try:
            print("Gravado em", exportar_painel())
        except OSError:   # ex.: pasta sem permissão de escrita
            print("Não foi possível gravar o arquivo do painel.")
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
    try:
        while continuar:
            mostrar_menu()
            opcao = input("Opção: ")
            print()
            continuar = executar(opcao)
            print()
    except (EOFError, KeyboardInterrupt, BrokenPipeError):
        return   # entrada fechada, Ctrl+C ou saída fechada: encerra sem traceback


if __name__ == "__main__":
    # Acentos e símbolos também no Windows; bytes inválidos não derrubam o menu.
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stdin.reconfigure(errors="replace")
    main()
