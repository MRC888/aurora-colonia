# Testes das REGRAS DE DECISÃO (seção 8): tabela-verdade, corte e religar.
import unittest

from dados import criar_colonia
from colonia import modulos_da
from regras import (decidir, projecao_desfavoravel, fila_de_corte, ordenar_por_prioridade,
                    cortar_cargas, religar_cargas)

PREV_LIMPO = {"fator": 1.0, "vento": 10, "beta0": 0, "beta1": 2.5}


class TestTabelaVerdade(unittest.TestCase):
    # Seção 8.6: C B A P → situação

    def test_c_sozinho_e_critico(self):
        self.assertEqual(decidir(15, 30, False), "CRITICO")

    def test_bap_e_critico(self):
        self.assertEqual(decidir(40, 90, True), "CRITICO")

    def test_ba_sem_p_e_economia(self):
        self.assertEqual(decidir(40, 90, False), "ECONOMIA")

    def test_b_sozinho_e_alerta(self):
        # Exemplo do enunciado: energia 40, consumo 70 → ALERTA: reduzir consumo.
        self.assertEqual(decidir(40, 70, False), "ALERTA")
        self.assertEqual(decidir(40, 70, True), "ALERTA")

    def test_bateria_boa_e_normal(self):
        self.assertEqual(decidir(85, 50, False), "NORMAL")
        self.assertEqual(decidir(85, 95, True), "NORMAL")

    def test_limites_exatos(self):
        self.assertEqual(decidir(20, 30, False), "ALERTA")     # 20 não é < 20
        self.assertEqual(decidir(50, 90, False), "NORMAL")     # 50 não é < 50
        self.assertEqual(decidir(40, 80, False), "ALERTA")     # 80 não é > 80


class TestProjecaoDesfavoravel(unittest.TestCase):

    def test_abaixo_de_70_e_caindo(self):
        self.assertTrue(projecao_desfavoravel(75, 60))

    def test_abaixo_de_70_mas_subindo_nao_e_perigo(self):
        # Colônia B às 8h: 53% subindo para 65% → não corta.
        self.assertFalse(projecao_desfavoravel(53, 65))

    def test_acima_de_70(self):
        self.assertFalse(projecao_desfavoravel(90, 75))


class TestCorte(unittest.TestCase):

    def test_ordenacao_por_insercao(self):
        modulos = modulos_da(criar_colonia())
        self.assertEqual(ordenar_por_prioridade(["Logística", "Laboratório"], modulos, True),
                         ["Laboratório", "Logística"])
        self.assertEqual(ordenar_por_prioridade(["Laboratório", "Logística"], modulos, False),
                         ["Logística", "Laboratório"])

    def test_fila_normal(self):
        modulos = modulos_da(criar_colonia())
        self.assertEqual(fila_de_corte(modulos, []), ["Laboratório", "Logística"])

    def test_quem_causou_sai_primeiro(self):
        modulos = modulos_da(criar_colonia())
        self.assertEqual(fila_de_corte(modulos, [{"modulo": "Logística"}]),
                         ["Logística", "Laboratório"])

    def test_anomalia_em_essencial_nao_muda_a_fila(self):
        modulos = modulos_da(criar_colonia())
        self.assertEqual(fila_de_corte(modulos, [{"modulo": "Médico"}]),
                         ["Laboratório", "Logística"])

    def test_essenciais_nunca_saem(self):
        colonia = criar_colonia()
        colonia["energetico"]["bateria"]["nivel_pct"] = 5
        cortar_cargas(colonia, 12, [], "todos", "teste", PREV_LIMPO)
        modulos = modulos_da(colonia)
        for nome in ["Energia", "Habitação", "Médico"]:
            self.assertTrue(modulos[nome]["ligado"])
        self.assertFalse(modulos["Laboratório"]["ligado"])
        self.assertFalse(modulos["Logística"]["ligado"])

    def test_ate_70_para_quando_basta(self):
        # Bateria 75% (825 kWh) às 16h com tempestade:
        #   projeção sem corte: 825 − 37,1 − 38,9 − 24 = 725 kWh (65,9%)
        #   sem o Laboratório:  725 + 30 + 30 + 15   = 800 kWh (72,7%) → basta.
        colonia = criar_colonia()
        for nome in modulos_da(colonia):
            modulo = modulos_da(colonia)[nome]
            modulo["consumo_atual_kw"] = modulo["perfil_kw"][16]
        colonia["energetico"]["bateria"]["nivel_pct"] = 75
        prev = {"fator": 0.05, "vento": 20, "beta0": 0, "beta1": 2.5}
        acoes = cortar_cargas(colonia, 16, [], "ate_70", "teste", prev)
        modulos = modulos_da(colonia)
        self.assertFalse(modulos["Laboratório"]["ligado"])
        self.assertTrue(modulos["Logística"]["ligado"])
        self.assertEqual(len(acoes), 1)


class TestReligar(unittest.TestCase):

    def colonia_com_lab_desligado(self, bateria, desde):
        colonia = criar_colonia()
        colonia["energetico"]["bateria"]["nivel_pct"] = bateria
        lab = modulos_da(colonia)["Laboratório"]
        lab["ligado"] = False
        lab["desligado_desde"] = desde
        for nome in modulos_da(colonia):
            modulo = modulos_da(colonia)[nome]
            modulo["consumo_atual_kw"] = modulo["perfil_kw"][12]
        return colonia

    def test_tempo_minimo_de_2h(self):
        colonia = self.colonia_com_lab_desligado(95, 11)
        self.assertEqual(religar_cargas(colonia, 12, PREV_LIMPO, True), [])

    def test_zona_morta_entre_70_e_80(self):
        colonia = self.colonia_com_lab_desligado(60, 10)   # com o Lab: 78,4%
        self.assertEqual(religar_cargas(colonia, 12, PREV_LIMPO, True), [])
        self.assertFalse(modulos_da(colonia)["Laboratório"]["ligado"])   # desfez o faz de conta

    def test_religa_com_folga(self):
        colonia = self.colonia_com_lab_desligado(85, 10)
        acoes = religar_cargas(colonia, 12, PREV_LIMPO, True)
        self.assertTrue(modulos_da(colonia)["Laboratório"]["ligado"])
        self.assertIn("Religado: Laboratório", acoes[0])

    def test_faz_de_conta_da_situacao(self):
        # Colônia A, bateria 40%: religar os dois levaria o consumo a 91 kW → ECONOMIA.
        colonia = criar_colonia("A")
        colonia["energetico"]["bateria"]["nivel_pct"] = 40
        for nome in ["Laboratório", "Logística"]:
            modulos_da(colonia)[nome]["ligado"] = False
            modulos_da(colonia)[nome]["desligado_desde"] = 9
        for nome in modulos_da(colonia):
            modulo = modulos_da(colonia)[nome]
            modulo["consumo_atual_kw"] = modulo["perfil_kw"][11]
        religar_cargas(colonia, 11, PREV_LIMPO, True)
        self.assertTrue(modulos_da(colonia)["Logística"]["ligado"])       # 61 kW: ok
        self.assertFalse(modulos_da(colonia)["Laboratório"]["ligado"])    # 91 kW: não

    def test_religa_do_mais_importante_para_o_menos(self):
        colonia = criar_colonia()
        colonia["energetico"]["bateria"]["nivel_pct"] = 95
        for nome in ["Laboratório", "Logística"]:
            modulos_da(colonia)[nome]["ligado"] = False
            modulos_da(colonia)[nome]["desligado_desde"] = 8
        acoes = religar_cargas(colonia, 12, PREV_LIMPO, True)
        self.assertIn("Logística", acoes[0])
        self.assertIn("Laboratório", acoes[1])


if __name__ == "__main__":
    unittest.main()
