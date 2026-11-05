# Testes dos CENÁRIOS PRONTOS (seção 12) e das 4 SIMULAÇÕES (seção 9).
# Cada cenário do menu é conferido contra o "esperado" escrito nele.
import unittest

from dados import criar_colonia, criar_historico
from colonia import modulos_da
from cenarios import CENARIOS, buscar_cenario
from sistema import processar_leitura
from simulacao import comparar, simular_dia, simular_todas, deficit_da_noite


def rodar(cenario):
    colonia = criar_colonia(cenario["colonia"])
    resultado = processar_leitura(colonia, dict(cenario["leitura"]), criar_historico())
    return colonia, resultado


def desligados(colonia):
    nomes = []
    for nome in modulos_da(colonia):
        if not modulos_da(colonia)[nome]["ligado"]:
            nomes.append(nome)
    return sorted(nomes)


class TestCenarios(unittest.TestCase):

    def test_todos_os_cenarios(self):
        for cenario in CENARIOS:
            with self.subTest(cenario=cenario["id"]):
                colonia, resultado = rodar(cenario)
                esperado = cenario["esperado"]
                if esperado.get("erro"):
                    self.assertIn("erro", resultado)
                    continue
                self.assertNotIn("erro", resultado)
                if "situacao" in esperado:
                    self.assertEqual(resultado["situacao"], esperado["situacao"])
                if "balanco" in esperado:
                    self.assertEqual(resultado["balanco"], esperado["balanco"])
                if "eolica_prevista_kw" in esperado:
                    self.assertAlmostEqual(resultado["eolica_prevista_kw"],
                                           esperado["eolica_prevista_kw"])
                if "fator_poeira" in esperado:
                    self.assertAlmostEqual(resultado["fator_poeira"], esperado["fator_poeira"],
                                           places=2)
                if "desligados" in esperado:
                    self.assertEqual(desligados(colonia), sorted(esperado["desligados"]))
                if "anomalias" in esperado:
                    nomes = []
                    for anomalia in resultado["anomalias"]:
                        nomes.append(anomalia["modulo"])
                    self.assertEqual(nomes, esperado["anomalias"])
                if "primeiro_desligado" in esperado:
                    self.assertIn("Desligado: " + esperado["primeiro_desligado"],
                                  resultado["acoes"][0])
                for nome in esperado.get("ligados", []):
                    self.assertTrue(modulos_da(colonia)[nome]["ligado"])
                for nome in esperado.get("religados", []):
                    self.assertTrue(any("Religado: " + nome in a for a in resultado["acoes"]))

    def test_cenario_1_mensagem_do_enunciado(self):
        _, resultado = rodar(buscar_cenario("1"))
        self.assertEqual(resultado["mensagem"], "ALERTA: reduzir consumo")

    def test_ids_unicos(self):
        ids = []
        for cenario in CENARIOS:
            ids.append(cenario["id"])
        self.assertEqual(len(ids), len(set(ids)))


class TestSimulacao(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.todas = simular_todas()

    def test_quatro_simulacoes_de_12_horas(self):
        self.assertEqual(sorted(self.todas), ["9a", "9b", "9c", "9d"])
        for codigo in self.todas:
            self.assertEqual(len(self.todas[codigo]["preditivo"]["linhas"]), 12)

    def test_deficit_da_noite_220_kwh(self):
        self.assertAlmostEqual(deficit_da_noite(), 220)

    def test_preditivo_chega_as_20h_melhor_que_o_reativo(self):
        for codigo in self.todas:
            with self.subTest(simulacao=codigo):
                r = self.todas[codigo]["reativo"]["resumo"]
                p = self.todas[codigo]["preditivo"]["resumo"]
                self.assertGreater(p["bateria_20h_pct"], r["bateria_20h_pct"])

    def test_preditivo_guarda_70_por_cento_para_a_noite(self):
        for codigo in self.todas:
            with self.subTest(simulacao=codigo):
                self.assertTrue(self.todas[codigo]["preditivo"]["resumo"]["reserva_para_noite"])

    def test_preditivo_amanhece_acima_do_piso(self):
        for codigo in self.todas:
            with self.subTest(simulacao=codigo):
                self.assertTrue(self.todas[codigo]["preditivo"]["resumo"]["amanhece_acima_do_piso"])

    def test_reativo_nao_aguenta_a_noite_na_tempestade_da_tarde(self):
        # 9b: a Colônia A reativa esgota a bateria antes do amanhecer.
        self.assertLess(self.todas["9b"]["reativo"]["resumo"]["amanhecer_pct"], 0)

    def test_preditivo_age_na_primeira_hora_da_tempestade(self):
        # 9c: tempestade às 10h; o preditivo corta já às 10h, o reativo não.
        linhas_p = self.todas["9c"]["preditivo"]["linhas"]
        linhas_r = self.todas["9c"]["reativo"]["linhas"]
        hora_10_p = linhas_p[2]
        self.assertEqual(hora_10_p["hora"], 10)
        self.assertTrue(hora_10_p["desligados"])
        self.assertFalse(linhas_r[2]["desligados"])

    def test_suporte_a_vida_sempre_ligado(self):
        for codigo in self.todas:
            for sistema in ["reativo", "preditivo"]:
                for linha in self.todas[codigo][sistema]["linhas"]:
                    for nome in ["Energia", "Habitação", "Médico"]:
                        self.assertNotIn(nome, linha["desligados"])

    def test_dia_limpo_na_colonia_b_nao_corta_nada(self):
        # Por isso o EXIGIR_QUEDA: amanhecer com 53% não é emergência.
        resumo = simular_dia("B", None, True)["resumo"]
        self.assertEqual(resumo["modulo_horas_desligados"], 0)

    def test_bateria_sempre_entre_0_e_100(self):
        for codigo in self.todas:
            for sistema in ["reativo", "preditivo"]:
                for linha in self.todas[codigo][sistema]["linhas"]:
                    self.assertGreaterEqual(linha["bateria_fim_pct"], 0)
                    self.assertLessEqual(linha["bateria_fim_pct"], 100)


if __name__ == "__main__":
    unittest.main()
