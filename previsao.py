# Aurora Siger - Fase 3: MODELOS DE PREVISÃO (algoritmo, seção 6).
# Previsão híbrida:
#   - eólica pela REGRESSÃO LINEAR (modelo estatístico, mínimos quadrados, Cap 7);
#   - solar pela CURVA DO DIA × fator de poeira (modelo físico).
# Tudo feito à mão, com somatórios e médias: sem NumPy.

from dados import NASCER_SOL, POR_DO_SOL, PICO_SOLAR


def media(lista):
    # Função: soma ÷ quantidade.
    soma = 0
    for valor in lista:
        soma = soma + valor
    return soma / len(lista)


def ajustar_reta(x, y):
    # Função: ajusta y = β0 + β1·x pelos mínimos quadrados.
    # Devolve (β0, β1). Levanta ValueError quando não existe reta,
    # para o erro aparecer cedo em vez de virar um número errado.
    if len(x) != len(y):
        raise ValueError("x e y precisam ter o mesmo tamanho")
    if len(x) < 2:
        raise ValueError("são necessários pelo menos 2 pontos")
    x_medio = media(x)
    y_medio = media(y)
    numerador = 0
    denominador = 0
    for i in range(len(x)):
        numerador = numerador + (x[i] - x_medio) * (y[i] - y_medio)
        denominador = denominador + (x[i] - x_medio) ** 2
    if denominador == 0:
        raise ValueError("todos os x são iguais: não existe reta")
    beta1 = numerador / denominador      # inclinação: quanto y muda quando x sobe 1
    beta0 = y_medio - beta1 * x_medio    # intercepto: valor de y quando x = 0
    return beta0, beta1


def prever(beta0, beta1, x):
    # Função: ŷ = β0 + β1·x
    return beta0 + beta1 * x


def r2(x, y, beta0, beta1):
    # Função: coeficiente de determinação, R² = 1 − SQres ÷ SQtot.
    # Quanto mais perto de 1, melhor a reta explica os dados.
    y_medio = media(y)
    sq_residuos = 0
    sq_total = 0
    for i in range(len(x)):
        sq_residuos = sq_residuos + (y[i] - prever(beta0, beta1, x[i])) ** 2
        sq_total = sq_total + (y[i] - y_medio) ** 2
    if sq_total == 0:
        return 1.0   # todos os y iguais: a reta horizontal explica tudo
    return 1 - sq_residuos / sq_total


def solar_curva(hora, pico=PICO_SOLAR):
    # Função: geração solar de um dia LIMPO, pela parábola da Fase 2.
    # Vale 0 no nascer e no pôr do sol e "pico" ao meio-dia.
    # Por que não uma reta: o solar sobe de manhã e desce à tarde.
    hora = hora % 24
    if hora <= NASCER_SOL or hora >= POR_DO_SOL:
        return 0   # noite
    duracao = POR_DO_SOL - NASCER_SOL
    return pico * 4 * (hora - NASCER_SOL) * (POR_DO_SOL - hora) / duracao ** 2


def fator_poeira(solar_medido, hora):
    # Função: quanto do sol está chegando, comparando o medido com a curva.
    # 1 = céu limpo · 0,05 = tempestade. À noite a curva vale 0 e não dá
    # para medir a poeira: devolve 1 (e evita a divisão por zero).
    esperado = solar_curva(hora)
    if esperado == 0:
        return 1.0
    return solar_medido / esperado


def solar_previsto(hora, fator):
    # Função: solar previsto para uma hora futura.
    # Hipótese: a poeira medida agora se mantém pela janela de previsão.
    return solar_curva(hora) * fator


def eolica_prevista(beta0, beta1, vento):
    # Função: eólica pela reta (vento → energia). Nunca negativa.
    # Escolha da equipe: planejar com a reta, que é CONSERVADORA no vento
    # forte (a física dá 4 vezes mais a 20 m/s). Ver energia.potencia_eolica.
    valor = prever(beta0, beta1, vento)
    if valor < 0:
        return 0
    return valor
