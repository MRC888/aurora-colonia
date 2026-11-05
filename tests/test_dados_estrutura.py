# Testes de DADOS e ESTRUTURA (algoritmo, seções 3 e 5).
import unittest

from dados import (criar_colonia, criar_historico, consumo_esperado, periodo_da_hora,
                   NIVEIS_KW, MODULOS)
from colonia import (buscar, percorrer, consumo_total, geracao_total, validar,
                     aplicar_leitura, modulos_da)


def soma_do_periodo(hora):
    total = 0
    for nome in MODULOS:
        total = total + consumo_esperado(nome, hora)
    return total


class TestDados(unittest.TestCase):

    def test_hierarquia_energetico_solar_eolico(self):
        # Enunciado: sistema energético → solar / eólico.
        energetico = criar_colonia()["energetico"]
        self.assertIn("solar", energetico)
        self.assertIn("eolico", energetico)

    def test_cinco_modulos_da_fase_2(self):
        self.assertEqual(sorted(modulos_da(criar_colonia())),
                         ["Energia", "Habitação", "Laboratório", "Logística", "Médico"])

    def test_prioridades_da_reuniao(self):
        m = modulos_da(criar_colonia())
        self.assertEqual(m["Energia"]["prioridade"], 1)
        self.assertEqual(m["Habitação"]["prioridade"], 2)
        self.assertEqual(m["Médico"]["prioridade"], 2)
        self.assertEqual(m["Logística"]["prioridade"], 3)
        self.assertEqual(m["Laboratório"]["prioridade"], 4)

    def test_essenciais(self):
        m = modulos_da(criar_colonia())
        for nome in ["Energia", "Habitação", "Médico"]:
            self.assertTrue(m[nome]["essencial"])
        for nome in ["Logística", "Laboratório"]:
            self.assertFalse(m[nome]["essencial"])

    def test_jornada_totais(self):
        # Chegada 74, expediente 91, depois 74, noite 47 (seção 3.3).
        self.assertEqual(soma_do_periodo(8), 74)
        self.assertEqual(soma_do_periodo(9), 91)
        self.assertEqual(soma_do_periodo(17), 91)
        self.assertEqual(soma_do_periodo(18), 74)
        self.assertEqual(soma_do_periodo(22), 47)

    def test_expediente_passa_do_consumo_alto(self):
        # O problema da versão 1: a soma nunca passava de 80 kW.
        self.assertGreater(soma_do_periodo(12), 80)

    def test_periodos(self):
        self.assertEqual(periodo_da_hora(8), "chegada")
        self.assertEqual(periodo_da_hora(9), "expediente")
        self.assertEqual(periodo_da_hora(18), "pos_expediente")
        self.assertEqual(periodo_da_hora(20), "noite")
        self.assertEqual(periodo_da_hora(26), "noite")   # 2h da madrugada

    def test_medico_quase_nao_varia(self):
        niveis = NIVEIS_KW["Médico"]
        self.assertLessEqual(niveis["alto"] - niveis["baixo"], 4)

    def test_perfil_tem_24_horas(self):
        perfil = modulos_da(criar_colonia())["Laboratório"]["perfil_kw"]
        self.assertEqual(len(perfil), 24)
        self.assertEqual(perfil[12], 30)
        self.assertEqual(perfil[19], 15)

    def test_duas_colonias(self):
        self.assertEqual(criar_colonia("A")["energetico"]["bateria"]["capacidade_kwh"], 440)
        self.assertEqual(criar_colonia("B")["energetico"]["bateria"]["capacidade_kwh"], 1100)
        self.assertEqual(criar_colonia()["tipo"], "B")   # B é a padrão

    def test_historico_do_enunciado(self):
        h = criar_historico()
        self.assertEqual(h["vento"], [8, 10, 12])
        self.assertEqual(h["energia_eolica"], [20, 25, 30])

    def test_cada_colonia_e_independente(self):
        a = criar_colonia()
        b = criar_colonia()
        a["energetico"]["bateria"]["nivel_pct"] = 5
        modulos_da(a)["Laboratório"]["ligado"] = False
        self.assertEqual(b["energetico"]["bateria"]["nivel_pct"], 53)
        self.assertTrue(modulos_da(b)["Laboratório"]["ligado"])


class TestEstrutura(unittest.TestCase):

    def setUp(self):
        self.colonia = criar_colonia()

    def test_buscar(self):
        self.assertEqual(buscar(self.colonia, "energetico/bateria/capacidade_kwh"), 1100)
        self.assertIsNone(buscar(self.colonia, "energetico/nuclear/geracao_kw"))
        self.assertIsNone(buscar(self.colonia, "energetico/bateria/nivel_pct/extra"))

    def test_percorrer_recursivo(self):
        linhas = percorrer(self.colonia)
        self.assertIn("energetico", linhas)
        self.assertIn("    solar", linhas)
        # operacional (0) → modulos (1) → Energia (2) → perfil_kw (3): 12 espaços
        self.assertIn("            perfil_kw = lista com 24 valores", linhas)

    def test_consumo_total_so_soma_ligados(self):
        modulos = modulos_da(self.colonia)
        self.assertEqual(consumo_total(modulos), 74)   # chegada (8h)
        modulos["Laboratório"]["ligado"] = False
        self.assertEqual(consumo_total(modulos), 59)

    def test_geracao_total(self):
        self.colonia["energetico"]["solar"]["geracao_kw"] = 15
        self.colonia["energetico"]["eolico"]["geracao_kw"] = 25
        self.assertEqual(geracao_total(self.colonia), 40)

    def test_aplicar_leitura(self):
        leitura = {"hora": 12, "bateria_pct": 70, "geracao_solar_kw": 100, "vento_m_s": 10,
                   "temp_externa_c": -60, "consumo_kw": {"Laboratório": 40},
                   "desligados": {"Logística": 10}}
        aplicar_leitura(self.colonia, leitura, 25)
        m = modulos_da(self.colonia)
        self.assertEqual(m["Laboratório"]["consumo_atual_kw"], 40)
        self.assertEqual(m["Habitação"]["consumo_atual_kw"], 22)   # esperado do expediente
        self.assertFalse(m["Logística"]["ligado"])
        self.assertEqual(m["Logística"]["desligado_desde"], 10)


class TestValidar(unittest.TestCase):

    def leitura(self, **mudancas):
        base = {"hora": 12, "bateria_pct": 50, "geracao_solar_kw": 100, "vento_m_s": 10,
                "temp_externa_c": -60}
        base.update(mudancas)
        return base

    def test_leitura_valida(self):
        self.assertEqual(validar(self.leitura()), (True, ""))

    def test_temperatura_negativa_e_permitida(self):
        self.assertTrue(validar(self.leitura(temp_externa_c=-120))[0])

    def test_negativo(self):
        ok, motivo = validar(self.leitura(bateria_pct=-5))
        self.assertFalse(ok)
        self.assertIn("negativo", motivo)

    def test_nao_numerico(self):
        ok, motivo = validar(self.leitura(vento_m_s="abc"))
        self.assertFalse(ok)
        self.assertIn("não é numérico", motivo)

    def test_bool_nao_e_numero(self):
        self.assertFalse(validar(self.leitura(hora=True))[0])

    def test_bateria_acima_de_100(self):
        self.assertFalse(validar(self.leitura(bateria_pct=120))[0])

    def test_falta_campo(self):
        leitura = self.leitura()
        del leitura["vento_m_s"]
        self.assertFalse(validar(leitura)[0])

    def test_consumo_invalido(self):
        self.assertFalse(validar(self.leitura(consumo_kw={"Laboratório": -3}))[0])


if __name__ == "__main__":
    unittest.main()
