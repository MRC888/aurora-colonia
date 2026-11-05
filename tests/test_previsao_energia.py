# Testes de PREVISÃO (seção 6) e ENERGIA (seções 5.6 e 7).
# A regressão é conferida contra o TESTE DE MESA da seção 6.5, feito à mão.
import unittest

from dados import criar_colonia
from colonia import modulos_da
from previsao import (media, ajustar_reta, prever, r2, solar_curva, fator_poeira,
                      eolica_prevista)
from energia import (balanco, detectar_anomalias, projetar_bateria, potencia_eolica,
                     eolica_fisica_calibrada, limitar, formatar)


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
        with self.assertRaises(ValueError):
            ajustar_reta([1, 2], [1])            # tamanhos diferentes
        with self.assertRaises(ValueError):
            ajustar_reta([1], [1])               # um ponto só
        with self.assertRaises(ValueError):
            ajustar_reta([5, 5, 5], [1, 2, 3])   # todos os x iguais

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

    def test_anomalia_30_por_cento(self):
        modulos = modulos_da(colonia_na_hora(12))
        modulos["Laboratório"]["consumo_atual_kw"] = 39    # esperado 30 às 12h: limite 39
        self.assertEqual(detectar_anomalias(modulos, 12), [])
        modulos["Laboratório"]["consumo_atual_kw"] = 40
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

    def test_limitar_e_formatar(self):
        self.assertEqual(limitar(120, 0, 100), 100)
        self.assertEqual(limitar(-3, 0, 100), 0)
        self.assertEqual(formatar(27.5), "27,5")
        self.assertEqual(formatar(0.05, 2), "0,05")


if __name__ == "__main__":
    unittest.main()
