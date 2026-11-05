# Testes das REGRAS DE DECISÃO (seção 8): tabela-verdade, corte e religar.
import unittest
from unittest.mock import patch

from dados import criar_colonia
from colonia import modulos_da
from regras import (decidir, regra_usada, projecao_desfavoravel, fila_de_corte,
                    ordenar_por_prioridade, cortar_cargas, religar_cargas)

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

    def test_logo_depois_dos_limites(self):
        self.assertEqual(decidir(19.5, 30, False), "CRITICO")
        self.assertEqual(decidir(49.5, 90, False), "ECONOMIA")
        self.assertEqual(decidir(49.5, 30, False), "ALERTA")
        self.assertEqual(decidir(40, 80.5, False), "ECONOMIA")


class TestRegraUsada(unittest.TestCase):

    def test_cada_regra_explica_a_decisao(self):
        self.assertIn("C:", regra_usada(15, 30, False))
        self.assertIn("B·A·P", regra_usada(40, 90, True))
        self.assertIn("B·A:", regra_usada(40, 90, False))
        self.assertIn("B:", regra_usada(40, 70, False))
        self.assertEqual(regra_usada(85, 50, False), "nenhuma regra de alerta")


class TestProjecaoDesfavoravel(unittest.TestCase):

    def test_abaixo_de_70_e_caindo(self):
        self.assertTrue(projecao_desfavoravel(75, 60))

    def test_abaixo_de_70_mas_subindo_nao_e_perigo(self):
        # Colônia B às 8h: 53% subindo para 65% → não corta.
        self.assertFalse(projecao_desfavoravel(53, 65))

    def test_acima_de_70(self):
        self.assertFalse(projecao_desfavoravel(90, 75))

    def test_limites_exatos(self):
        self.assertFalse(projecao_desfavoravel(75, 70))      # 70 libera
        self.assertFalse(projecao_desfavoravel(75, 70.5))
        self.assertTrue(projecao_desfavoravel(75, 69.5))
        self.assertFalse(projecao_desfavoravel(60, 60))      # parada não é queda


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

    def test_desligar_anota_a_hora_e_o_motivo(self):
        colonia = criar_colonia()
        acoes = cortar_cargas(colonia, 14, [{"modulo": "Logística"}], "todos", "teste", None)
        self.assertEqual(modulos_da(colonia)["Laboratório"]["desligado_desde"], 14)
        self.assertIn("quem causou sai primeiro", acoes[0])
        self.assertEqual(acoes[1], "Desligado: Laboratório — motivo: teste")

    def test_atencao_quando_so_resta_o_suporte_a_vida(self):
        colonia = criar_colonia()
        colonia["energetico"]["bateria"]["nivel_pct"] = 30
        prev = {"fator": 0.05, "vento": 10, "beta0": 0, "beta1": 2.5}
        acoes = cortar_cargas(colonia, 16, [], "todos", "teste", prev)
        self.assertIn("ATENÇÃO", acoes[-1])

    def test_sem_corte_nao_ha_atencao(self):
        colonia = criar_colonia()
        for nome in ["Laboratório", "Logística"]:
            modulos_da(colonia)[nome]["ligado"] = False
        colonia["energetico"]["bateria"]["nivel_pct"] = 30
        prev = {"fator": 0.05, "vento": 10, "beta0": 0, "beta1": 2.5}
        self.assertEqual(cortar_cargas(colonia, 16, [], "ate_70", "teste", prev), [])


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

    def test_margem_exata_de_80(self):
        colonia = self.colonia_com_lab_desligado(90, 10)
        with patch("regras.projetar", return_value=80):
            religar_cargas(colonia, 12, PREV_LIMPO, True)
        self.assertTrue(modulos_da(colonia)["Laboratório"]["ligado"])
        colonia = self.colonia_com_lab_desligado(90, 10)
        with patch("regras.projetar", return_value=79.9):
            religar_cargas(colonia, 12, PREV_LIMPO, True)
        self.assertFalse(modulos_da(colonia)["Laboratório"]["ligado"])

    def test_tempo_exato_de_2h(self):
        colonia = self.colonia_com_lab_desligado(95, 10)
        religar_cargas(colonia, 12, PREV_LIMPO, True)
        self.assertTrue(modulos_da(colonia)["Laboratório"]["ligado"])
        self.assertIsNone(modulos_da(colonia)["Laboratório"]["desligado_desde"])

    def test_virada_do_dia(self):
        colonia = self.colonia_com_lab_desligado(95, 23)   # desligado às 23h, agora 1h: 2h
        religar_cargas(colonia, 1, PREV_LIMPO, True)
        self.assertTrue(modulos_da(colonia)["Laboratório"]["ligado"])

    def test_pendencias_explicam_quem_nao_religou(self):
        colonia = self.colonia_com_lab_desligado(95, 11)
        pendencias = []
        religar_cargas(colonia, 12, PREV_LIMPO, True, 0, pendencias)
        self.assertIn("desligado há só 1h", pendencias[0])
        colonia = self.colonia_com_lab_desligado(60, 10)
        pendencias = []
        religar_cargas(colonia, 12, PREV_LIMPO, True, 0, pendencias)
        self.assertIn("78,4%", pendencias[0])

    def test_reativo_nao_projeta_e_nao_volta_a_critico(self):
        # Reativo, bateria 15%: religar daria CRÍTICO → fica desligado.
        colonia = self.colonia_com_lab_desligado(15, 10)
        self.assertEqual(religar_cargas(colonia, 12, None, False, 200), [])
        self.assertFalse(modulos_da(colonia)["Laboratório"]["ligado"])

    def test_reativo_nao_volta_ao_risco(self):
        # Bateria 40%, consumo 91 kW se religar: com geração baixa daria CRÍTICO (B·A·P),
        # com geração alta daria ECONOMIA. Nos dois casos fica desligado.
        for geracao in [50, 200]:
            colonia = self.colonia_com_lab_desligado(40, 10)
            self.assertEqual(religar_cargas(colonia, 12, None, False, geracao), [])

    def test_reativo_religa_quando_a_situacao_permite(self):
        colonia = self.colonia_com_lab_desligado(90, 10)
        self.assertIn("Religado: Laboratório", religar_cargas(colonia, 12, None, False, 200)[0])

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
