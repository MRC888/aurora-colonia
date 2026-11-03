# Testes do marco M1: dados e estrutura da colônia.
import unittest

from dados import criar_colonia, criar_historico
from colonia import buscar, percorrer, consumo_total, geracao_total


class TestDados(unittest.TestCase):

    def test_hierarquia_energetico_solar_eolico(self):
        # Enunciado: sistema energético -> solar / eólico.
        energetico = criar_colonia()["energetico"]
        self.assertIn("solar", energetico)
        self.assertIn("eolico", energetico)

    def test_cinco_modulos_da_fase_2(self):
        modulos = criar_colonia()["operacional"]["modulos"]
        self.assertEqual(sorted(modulos),
                         ["Energia", "Habitação", "Laboratório", "Logística", "Médico"])

    def test_suporte_a_vida_e_essencial(self):
        modulos = criar_colonia()["operacional"]["modulos"]
        self.assertTrue(modulos["Habitação"]["essencial"])
        self.assertTrue(modulos["Médico"]["essencial"])
        self.assertFalse(modulos["Laboratório"]["essencial"])

    def test_historico_do_enunciado(self):
        historico = criar_historico()
        self.assertEqual(historico["vento"], [8, 10, 12])
        self.assertEqual(historico["energia_eolica"], [20, 25, 30])
        self.assertEqual(len(historico["hora"]), len(historico["consumo"]))

    def test_cada_colonia_e_independente(self):
        # Mudar uma colônia não pode alterar outra.
        a = criar_colonia()
        b = criar_colonia()
        a["energetico"]["bateria"]["nivel_pct"] = 5
        self.assertEqual(b["energetico"]["bateria"]["nivel_pct"], 40)


class TestEstrutura(unittest.TestCase):

    def setUp(self):
        self.colonia = criar_colonia()

    def test_buscar_valor_existente(self):
        self.assertEqual(buscar(self.colonia, "energetico/bateria/nivel_pct"), 40)
        self.assertEqual(buscar(self.colonia, "energetico/eolico/geracao_kw"), 25)

    def test_buscar_devolve_subarvore(self):
        solar = buscar(self.colonia, "energetico/solar")
        self.assertEqual(solar["geracao_kw"], 20)

    def test_buscar_caminho_inexistente(self):
        self.assertIsNone(buscar(self.colonia, "energetico/nuclear/geracao_kw"))
        self.assertIsNone(buscar(self.colonia, "energetico/bateria/nivel_pct/extra"))

    def test_percorrer_mostra_todos_os_niveis(self):
        linhas = percorrer(self.colonia)
        self.assertEqual(linhas[0], "energetico")
        self.assertIn("    solar", linhas)
        self.assertIn("        geracao_kw = 20", linhas)
        self.assertIn("            consumo_kw = 25", linhas)

    def test_consumo_total_so_soma_ligados(self):
        modulos = self.colonia["operacional"]["modulos"]
        self.assertEqual(consumo_total(modulos), 75)
        modulos["Laboratório"]["ligado"] = False
        self.assertEqual(consumo_total(modulos), 55)

    def test_geracao_total(self):
        self.assertEqual(geracao_total(self.colonia), 45)


if __name__ == "__main__":
    unittest.main()
