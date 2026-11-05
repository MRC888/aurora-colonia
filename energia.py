# Aurora Siger - Fase 3: ANÁLISE DE ENERGIA (algoritmo, seções 5.6, 6.7 e 7).
# Balanço geração × consumo, anomalias, física do vento e a projeção da
# bateria, que é o coração do preditivo.

from dados import JANELA_PREVISAO, LIMITE_ANOMALIA, DENSIDADE_AR_MARTE, AREA_PAS
from colonia import modulos_da
from previsao import solar_previsto, eolica_prevista


def potencia_eolica(densidade, area, vento):
    # Função: modelo FÍSICO, P = ½·ρ·A·v³ (em watts).
    # A potência cresce com o CUBO do vento: o dobro de vento dá 8 vezes mais.
    # Não é usado para planejar; serve para comparar com a reta no PDF.
    return 0.5 * densidade * area * vento ** 3


def eolica_fisica_pura(vento):
    # Função: a fórmula pura com os valores do projeto, em kW.
    # Dá só 1,2 kW a 10 m/s: o ar de Marte é muito rarefeito. Por isso os 25 kW do
    # enunciado são uma hipótese didática, e a curva abaixo é CALIBRADA por eles.
    return potencia_eolica(DENSIDADE_AR_MARTE, AREA_PAS, vento) / 1000


def eolica_fisica_calibrada(vento, vento_ref=10, energia_ref=25):
    # Função: curva proporcional a v³, CALIBRADA para bater com a reta em
    # 10 m/s = 25 kW. Não é a fórmula pura: mostra só como a reta cresce menos
    # que v³ no vento forte, se aceitarmos os 25 kW do enunciado.
    return energia_ref * (vento / vento_ref) ** 3


def balanco(geracao, consumo):
    # Função: compara geração e consumo e devolve uma mensagem clara.
    if consumo > geracao:
        return "ALERTA: consumo maior que geração"
    if geracao > consumo:
        return "SUGESTÃO: armazenar energia excedente"
    return "OK: geração e consumo em equilíbrio"


def detectar_anomalias(modulos, hora):
    # Função: lista os andares consumindo mais de 30% acima do esperado
    # para aquela hora. A anomalia SÓ AVISA: quem decide cortar é a projeção.
    # Devolve lista de dicionários {modulo, atual, esperado, aviso}.
    anomalias = []
    for nome in modulos:
        modulo = modulos[nome]
        if not modulo["ligado"]:
            continue
        esperado = modulo["perfil_kw"][hora % 24]
        if modulo["consumo_atual_kw"] > esperado * (1 + LIMITE_ANOMALIA):
            aviso = ("ANOMALIA: " + nome + " consumindo "
                     + formatar(modulo["consumo_atual_kw"]) + " kW (esperado "
                     + formatar(esperado) + " kW)")
            anomalias.append({"modulo": nome, "atual": modulo["consumo_atual_kw"],
                              "esperado": esperado, "aviso": aviso})
    return anomalias


def detectar_falhas(modulos):
    # Função: lista os módulos com estado "falha" (acesso rápido a alertas de falha).
    # Como a anomalia, a falha SÓ AVISA: o sistema não muda de situação por causa dela.
    falhas = []
    for nome in modulos:
        if modulos[nome]["estado"] == "falha":
            aviso = "FALHA: " + nome + " informou defeito no equipamento"
            falhas.append({"modulo": nome, "aviso": aviso})
    return falhas


def consumo_previsto(modulos, hora, usar_medido):
    # Função: consumo dos módulos ligados numa hora da projeção.
    # Na hora atual usa o MEDIDO (pega uma anomalia que está acontecendo);
    # nas horas seguintes, o ESPERADO pelo perfil da jornada.
    total = 0
    for nome in modulos:
        modulo = modulos[nome]
        if modulo["ligado"]:
            if usar_medido:
                total = total + modulo["consumo_atual_kw"]
            else:
                total = total + modulo["perfil_kw"][hora % 24]
    return total


def projetar_bateria(colonia, hora, fator, vento, beta0, beta1):
    # Função: como a bateria estará daqui a JANELA_PREVISAO horas (em %).
    # As 3 horas são a atual e as duas seguintes: às 17h, a projeção
    # cobre 17h–20h. Hipótese: poeira e vento medidos agora se mantêm.
    bateria = colonia["energetico"]["bateria"]
    capacidade = bateria["capacidade_kwh"]
    energia_kwh = bateria["nivel_pct"] / 100 * capacidade
    modulos = modulos_da(colonia)
    for k in range(JANELA_PREVISAO):
        h = hora + k
        geracao = solar_previsto(h, fator) + eolica_prevista(beta0, beta1, vento)
        consumo = consumo_previsto(modulos, h, k == 0)
        energia_kwh = energia_kwh + (geracao - consumo) * 1   # × 1 hora = kWh
        energia_kwh = limitar(energia_kwh, 0, capacidade)
    return energia_kwh / capacidade * 100


def limitar(valor, minimo, maximo):
    # Função: prende o valor entre o mínimo e o máximo (a bateria não passa de cheia).
    if valor < minimo:
        return minimo
    if valor > maximo:
        return maximo
    return valor


def formatar(numero, casas=1):
    # Função: número com vírgula decimal, como se escreve em português.
    if casas == 2:
        return f"{numero:.2f}".replace(".", ",")
    return f"{numero:.1f}".replace(".", ",")


def formatar_abaixo(numero):
    # Função: 1 casa decimal cortando, sem arredondar para cima.
    # Assim 69,99 aparece como 69,9, e nunca "70,0% (abaixo de 70%)".
    return formatar(int(numero * 10) / 10)
