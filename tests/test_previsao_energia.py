# Testes de PREVISÃO (seção 6) e ENERGIA (seções 5.6 e 7).
# A regressão é conferida contra o TESTE DE MESA da seção 6.5, feito à mão.
import unittest

from dados import criar_colonia
from colonia import modulos_da
from previsao import (media, ajustar_reta, prever, r2, solar_curva, fator_poeira,
                      eolica_prevista)
from energia import (balanco, detectar_anomalias, detectar_falhas, projetar_bateria,
                     potencia_eolica, eolica_fisica_calibrada, eolica_fisica_pura,
                     limitar, formatar, formatar_abaixo)


class TestRegressao(unittest.TestCase):

    def test_media(self):
        self.assertEqual(media([8, 10, 12]), 10)

    def test_teste_de_mesa_do_enunciado(self):
        # Σ(x−x̄)(y−ȳ) = 20 · Σ(x−x̄)² = 8 → β1 = 2,5 · β0 = 25 − 2,5·10 = 0
        beta0, beta1 = ajustar_reta([8, 10, 12], [20, 25, 30])
        self.assertAlmostEqual(beta1, 2.5)
        self.assertAlmostEqual(beta0, 0.0)

    def test_vento_11_da_27_e_meio(self):
        # Enunciado: vento 11 → "≈ 27".
        self.assertAlmostEqual(prever(0, 2.5, 11), 27.5)

    def test_r2_igual_a_1(self):
        self.assertAlmostEqual(r2([8, 10, 12], [20, 25, 30], 0, 2.5), 1.0)

    def test_r2_menor_que_1_com_ruido(self):
        x = [1, 2, 3, 4]
        y = [2, 4, 5, 9]
        beta0, beta1 = ajustar_reta(x, y)
        self.assertLess(r2(x, y, beta0, beta1), 1)

    def test_erros_da_reta(self):
        self.assertIsNone(ajustar_reta([1, 2], [1]))            # tamanhos diferentes
        self.assertIsNone(ajustar_reta([1], [1]))               # um ponto só
        self.assertIsNone(ajustar_reta([], []))                 # sem dados
        self.assertIsNone(ajustar_reta([5, 5, 5], [1, 2, 3]))   # todos os x iguais
        self.assertIsNone(ajustar_reta([1.1] * 7, [1, 2, 3, 4, 5, 6, 7]))   # idem, com decimais

    def test_r2_com_valor_conhecido(self):
        # x = 1,2,3 · y = 1,3,2: reta ŷ = 1 + 0,5x · SQres = 1,5 · SQtot = 2 · R² = 0,25
        beta0, beta1 = ajustar_reta([1, 2, 3], [1, 3, 2])
        self.assertAlmostEqual(beta0, 1)
        self.assertAlmostEqual(beta1, 0.5)
        self.assertAlmostEqual(r2([1, 2, 3], [1, 3, 2], beta0, beta1), 0.25)

    def test_r2_com_y_iguais(self):
        self.assertEqual(r2([1, 2], [5, 5], 5, 0), 1.0)    # a reta passa nos pontos
        self.assertEqual(r2([1, 2], [5, 5], 0, 1), 0.0)    # a reta não passa

    def test_eolica_nunca_negativa(self):
        self.assertEqual(eolica_prevista(-10, 1, 2), 0)


class TestSolar(unittest.TestCase):

    def test_curva(self):
        self.assertEqual(solar_curva(6), 0)
        self.assertAlmostEqual(solar_curva(9), 105)     # 0,75 × 140
        self.assertAlmostEqual(solar_curva(12), 140)
        self.assertAlmostEqual(solar_curva(15), 105)
        self.assertEqual(solar_curva(18), 0)
        self.assertEqual(solar_curva(22), 0)

    def test_fator_poeira_tempestade(self):
        self.assertAlmostEqual(fator_poeira(7, 12), 0.05)

    def test_fator_poeira_noite_sem_divisao_por_zero(self):
        self.assertEqual(fator_poeira(0, 21), 1.0)

    def test_fator_poeira_tem_teto_de_1(self):
        self.assertEqual(fator_poeira(140, 17), 1.0)
        self.assertEqual(fator_poeira(50, 17), 1.0)     # 50 ÷ 42,8 ≈ 1,17

    def test_reta_com_dois_pontos(self):
        self.assertEqual(ajustar_reta([0, 2], [1, 5]), (1, 2))

    def test_curva_depois_da_meia_noite(self):
        self.assertAlmostEqual(solar_curva(36), 140)   # 36 = 12h do dia seguinte


def colonia_na_hora(hora):
    # Colônia nova com cada andar gastando o esperado daquela hora.
    colonia = criar_colonia()
    for nome in modulos_da(colonia):
        modulo = modulos_da(colonia)[nome]
        modulo["consumo_atual_kw"] = modulo["perfil_kw"][hora]
    return colonia


class TestEnergia(unittest.TestCase):

    def test_balanco_do_enunciado(self):
        self.assertEqual(balanco(40, 70), "ALERTA: consumo maior que geração")
        self.assertEqual(balanco(80, 30), "SUGESTÃO: armazenar energia excedente")
        self.assertEqual(balanco(50, 50), "OK: geração e consumo em equilíbrio")

    def test_fisica_x_reta(self):
        # A 20 m/s a física dá 4× a reta (seção 7.1).
        self.assertAlmostEqual(eolica_fisica_calibrada(10), 25)
        self.assertAlmostEqual(eolica_fisica_calibrada(20), 200)
        self.assertAlmostEqual(prever(0, 2.5, 20), 50)

    def test_potencia_cresce_com_o_cubo(self):
        self.assertAlmostEqual(potencia_eolica(0.02, 120, 20) / potencia_eolica(0.02, 120, 10), 8)

    def test_formula_pura_com_os_valores_do_projeto(self):
        # ½ × 0,020 × 120 × 10³ = 1200 W = 1,2 kW: bem longe dos 25 kW do enunciado.
        self.assertAlmostEqual(eolica_fisica_pura(10), 1.2)
        self.assertAlmostEqual(eolica_fisica_pura(20), 9.6)

    def test_modulo_desligado_nao_tem_anomalia(self):
        modulos = modulos_da(colonia_na_hora(12))
        modulos["Laboratório"]["consumo_atual_kw"] = 40
        modulos["Laboratório"]["ligado"] = False
        self.assertEqual(detectar_anomalias(modulos, 12), [])

    def test_falhas_so_avisam(self):
        modulos = modulos_da(criar_colonia())
        self.assertEqual(detectar_falhas(modulos), [])
        modulos["Logística"]["estado"] = "falha"
        self.assertEqual(detectar_falhas(modulos)[0]["modulo"], "Logística")
        self.assertTrue(modulos["Logística"]["ligado"])

    def test_anomalia_30_por_cento(self):
        modulos = modulos_da(colonia_na_hora(12))
        modulos["Laboratório"]["consumo_atual_kw"] = 39    # esperado 30 às 12h: limite 39
        self.assertEqual(detectar_anomalias(modulos, 12), [])
        modulos["Laboratório"]["consumo_atual_kw"] = 39.1
        anomalias = detectar_anomalias(modulos, 12)
        self.assertEqual(anomalias[0]["modulo"], "Laboratório")

    def test_alto_planejado_nao_e_anomalia(self):
        modulos = modulos_da(colonia_na_hora(12))
        modulos["Laboratório"]["consumo_atual_kw"] = 30   # alto, mas é o esperado do expediente
        self.assertEqual(detectar_anomalias(modulos, 12), [])

    def test_projecao_dia_limpo_sobe(self):
        colonia = criar_colonia()   # B, 53% às 8h
        self.assertGreater(projetar_bateria(colonia, 8, 1.0, 10, 0, 2.5), 53)

    def test_projecao_das_17h_olha_ate_as_20h(self):
        # 17h (−23,2), 18h (−49), 19h (−49) a partir de 80% de 1100 kWh.
        colonia = colonia_na_hora(17)
        colonia["energetico"]["bateria"]["nivel_pct"] = 80
        esperado = (880 - 23.2 - 49 - 49) / 1100 * 100
        self.assertAlmostEqual(projetar_bateria(colonia, 17, 1.0, 10, 0, 2.5), esperado, places=1)

    def test_projecao_usa_o_medido_so_na_hora_atual(self):
        # Hora atual medida (+10 kW) e horas seguintes pelo perfil: perde 10 kWh a mais.
        base = colonia_na_hora(17)
        pico = colonia_na_hora(17)
        modulos_da(pico)["Laboratório"]["consumo_atual_kw"] = 40
        diferenca = (projetar_bateria(base, 17, 1.0, 10, 0, 2.5)
                     - projetar_bateria(pico, 17, 1.0, 10, 0, 2.5))
        self.assertAlmostEqual(diferenca, 10 / 1100 * 100)

    def test_projecao_nao_passa_dos_limites(self):
        colonia = colonia_na_hora(12)
        colonia["energetico"]["bateria"]["nivel_pct"] = 100
        self.assertEqual(projetar_bateria(colonia, 12, 1.0, 10, 0, 2.5), 100)
        colonia = colonia_na_hora(20)
        colonia["energetico"]["bateria"]["nivel_pct"] = 0
        self.assertEqual(projetar_bateria(colonia, 20, 1.0, 10, 0, 2.5), 0)

    def test_formatar_abaixo_nunca_arredonda_para_cima(self):
        self.assertEqual(formatar_abaixo(69.992), "69,9")
        self.assertEqual(formatar_abaixo(31.9), "31,9")

    def test_limitar_e_formatar(self):
        self.assertEqual(limitar(120, 0, 100), 100)
        self.assertEqual(limitar(-3, 0, 100), 0)
        self.assertEqual(formatar(27.5), "27,5")
        self.assertEqual(formatar(0.05, 2), "0,05")


if __name__ == "__main__":
    unittest.main()
