# Testes dos CENÁRIOS PRONTOS (seção 12) e das 4 SIMULAÇÕES (seção 9).
# Cada cenário do menu é conferido contra o "esperado" escrito nele.
import unittest

from dados import criar_colonia, criar_historico
from colonia import modulos_da, buscar
from cenarios import CENARIOS, buscar_cenario
from sistema import processar_leitura, registrar
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
                if "falhas" in esperado:
                    self.assertEqual(resultado["falhas"][0]["modulo"], esperado["falhas"][0])
                if "r2" in esperado:
                    self.assertAlmostEqual(resultado["r2"], esperado["r2"], places=2)
                if "projecao_pct" in esperado:
                    self.assertAlmostEqual(resultado["projecao_pct"], esperado["projecao_pct"],
                                           places=1)
                if "pendencia" in esperado:
                    self.assertIn(esperado["pendencia"], resultado["pendencias"][0])
                for nome in esperado.get("religados", []):
                    self.assertTrue(any("Religado: " + nome in a for a in resultado["acoes"]))

    def test_cenario_1_mensagem_do_enunciado(self):
        _, resultado = rodar(buscar_cenario("1"))
        self.assertEqual(resultado["mensagem"], "ALERTA: reduzir consumo")

    def test_medicao_entra_no_historico(self):
        historico = criar_historico()
        processar_leitura(criar_colonia(), dict(buscar_cenario("21")["leitura"]), historico)
        self.assertEqual(historico["vento"], [8, 10, 12, 14])
        self.assertEqual(historico["energia_eolica"], [20, 25, 30, 32])

    def test_medicao_vale_como_geracao_atual(self):
        _, resultado = rodar(buscar_cenario("21"))
        self.assertAlmostEqual(resultado["geracao_kw"], 172)   # 140 solar + 32 medidos

    def test_alerta_de_falha_fica_na_arvore(self):
        colonia, _ = rodar(buscar_cenario("20"))
        self.assertEqual(buscar(colonia, "operacional/alertas_de_falha")[0]["modulo"], "Logística")
        self.assertEqual(buscar(colonia, "operacional/modulos/Logística/estado"), "falha")

    def test_historico_invalido_vira_erro(self):
        historico = {"vento": [5, 5], "energia_eolica": [1, 2]}
        resultado = processar_leitura(criar_colonia(), dict(buscar_cenario("8")["leitura"]), historico)
        self.assertIn("histórico inválido", resultado["erro"])

    def test_historico_ruim_vira_erro_sem_quebrar(self):
        for historico in [{}, None, {"vento": [8, 10, 12]}, {"vento": (8, 10), "energia_eolica": (1, 2)},
                          {"vento": ["a", 10, 12], "energia_eolica": [20, 25, 30]},
                          {"vento": [1e200, 10, 12], "energia_eolica": [20, 25, 30]},
                          {"vento": [8, 10, 12], "energia_eolica": [float("nan"), 25, 30]}]:
            with self.subTest(historico=historico):
                resultado = processar_leitura(criar_colonia(), dict(buscar_cenario("8")["leitura"]),
                                              historico)
                self.assertIn("histórico inválido", resultado["erro"])

    def test_erro_nao_altera_o_historico(self):
        historico = {"vento": [10, 10], "energia_eolica": [1, 2]}
        leitura = dict(buscar_cenario("21")["leitura"], vento_m_s=10)
        processar_leitura(criar_colonia(), leitura, historico)
        self.assertEqual(historico["vento"], [10, 10])

    def test_valor_absurdo_nao_quebra_a_mensagem(self):
        leitura = dict(buscar_cenario("8")["leitura"], vento_m_s=10 ** 5000)
        self.assertIn("erro", processar_leitura(criar_colonia(), leitura, criar_historico()))

    def test_p_do_reativo_e_geracao_menor_que_consumo(self):
        base = {"hora": 16, "bateria_pct": 40, "vento_m_s": 10, "temp_externa_c": -60}
        ruim = processar_leitura(criar_colonia(), dict(base, geracao_solar_kw=4),
                                 criar_historico(), False)
        boa = processar_leitura(criar_colonia(), dict(base, geracao_solar_kw=100),
                                criar_historico(), False)
        self.assertEqual(ruim["situacao"], "CRITICO")
        self.assertEqual(boa["situacao"], "ECONOMIA")
        self.assertEqual(ruim["projecao_pct"], None)

    def test_regra_do_corte_preventivo_aparece_no_diario(self):
        _, resultado = rodar(buscar_cenario("12"))
        self.assertIn("P: projeção abaixo de 70%", resultado["regra"])

    def test_observacao_sem_nada_para_cortar(self):
        leitura = {"hora": 21, "bateria_pct": 40, "geracao_solar_kw": 0, "vento_m_s": 10,
                   "temp_externa_c": -60, "desligados": {"Logística": 18, "Laboratório": 18}}
        resultado = processar_leitura(criar_colonia(), leitura, criar_historico())
        self.assertEqual(resultado["situacao"], "ALERTA")
        self.assertIn("já estão desligados", resultado["observacao"])

    def test_sem_observacao_quando_situacao_e_acao_combinam(self):
        for cenario in ["8", "5", "6"]:
            self.assertEqual(rodar(buscar_cenario(cenario))[1]["observacao"], "")

    def test_observacao_explica_corte_preventivo(self):
        _, resultado = rodar(buscar_cenario("12"))
        self.assertEqual(resultado["situacao"], "NORMAL")
        self.assertIn("CORTE PREVENTIVO", resultado["observacao"])

    def test_observacao_explica_alerta_sem_corte(self):
        leitura = {"hora": 8, "bateria_pct": 40, "geracao_solar_kw": 77, "vento_m_s": 10,
                   "temp_externa_c": -60}
        resultado = processar_leitura(criar_colonia(), leitura, criar_historico())
        self.assertEqual(resultado["acoes"], [])
        self.assertIn("não pede corte", resultado["observacao"])
        resultado = processar_leitura(criar_colonia(), dict(leitura), criar_historico(), False)
        self.assertIn("reativo", resultado["observacao"])

    def test_diario_guarda_a_decisao(self):
        _, resultado = rodar(buscar_cenario("20"))
        diario = []
        registrar(diario, resultado)
        registrar(diario, {"erro": "ERRO: teste"})
        self.assertIn("FALHA: Logística", diario[0]["anomalias"][0])
        self.assertEqual(diario[1], {"erro": "ERRO: teste"})

    def test_ids_unicos(self):
        ids = []
        for cenario in CENARIOS:
            ids.append(cenario["id"])
        self.assertEqual(len(ids), len(set(ids)))


class TestSimulacao(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.todas = simular_todas()

    def test_quatro_simulacoes_das_8h_as_6h(self):
        self.assertEqual(sorted(self.todas), ["9a", "9b", "9c", "9d"])
        for codigo in self.todas:
            linhas = self.todas[codigo]["preditivo"]["linhas"]
            self.assertEqual(len(linhas), 22)     # 12 de dia + 10 de noite
            self.assertEqual(linhas[0]["hora"], 8)
            self.assertEqual(linhas[-1]["hora"], 5)
            self.assertTrue(linhas[12]["noite"])
            self.assertFalse(linhas[11]["noite"])

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

    def test_reativo_entra_em_critico_na_noite_da_9b(self):
        # A tempestade da tarde cobra a conta de madrugada: bateria abaixo de 20%.
        resumo = self.todas["9b"]["reativo"]["resumo"]
        self.assertEqual(resumo["horas_criticas_dia"], 0)
        self.assertEqual(resumo["horas_criticas"], 4)
        self.assertAlmostEqual(resumo["amanhecer_pct"], 7.08, places=1)
        self.assertFalse(resumo["amanhece_acima_do_piso"])

    def test_preditivo_nunca_fica_critico(self):
        for codigo in self.todas:
            self.assertEqual(self.todas[codigo]["preditivo"]["resumo"]["horas_criticas"], 0)

    def test_menor_bateria_conta_o_inicio_do_dia(self):
        self.assertEqual(self.todas["9b"]["preditivo"]["resumo"]["menor_bateria_pct"], 29)
        self.assertEqual(self.todas["9d"]["preditivo"]["resumo"]["menor_bateria_pct"], 53)

    def test_placar_do_dia_e_da_noite(self):
        total = []
        for codigo in ["9a", "9b", "9c", "9d"]:
            total.append((self.todas[codigo]["reativo"]["resumo"]["modulo_horas_desligados"],
                          self.todas[codigo]["preditivo"]["resumo"]["modulo_horas_desligados"]))
        self.assertEqual(total, [(8, 30), (12, 30), (4, 28), (0, 26)])

    def test_diario_tem_uma_entrada_por_hora(self):
        self.assertEqual(len(self.todas["9b"]["preditivo"]["diario"]), 22)

    def test_placar_de_modulo_horas(self):
        dia = []
        for codigo in ["9a", "9b", "9c", "9d"]:
            dia.append((self.todas[codigo]["reativo"]["resumo"]["modulo_horas_desligados_dia"],
                        self.todas[codigo]["preditivo"]["resumo"]["modulo_horas_desligados_dia"]))
        self.assertEqual(dia, [(8, 10), (4, 10), (4, 9), (0, 6)])

    def test_mundo_cobra_o_consumo_depois_das_acoes(self):
        # 9h da Colônia A: corta Log e Lab; a hora já é cobrada com 39 kW, não 91.
        linha = self.todas["9b"]["preditivo"]["linhas"][1]
        self.assertEqual(linha["consumo_kw"], 39)

    def test_conta_de_energia_fecha_em_cada_hora(self):
        for codigo in self.todas:
            tipo = codigo in ["9a", "9b"]
            capacidade = 1100
            if tipo:
                capacidade = 440
            for sistema in ["reativo", "preditivo"]:
                for linha in self.todas[codigo][sistema]["linhas"]:
                    if 0 < linha["bateria_fim_pct"] < 100:
                        saldo = (linha["geracao_kw"] - linha["consumo_kw"]) / capacidade * 100
                        self.assertAlmostEqual(linha["bateria_fim_pct"],
                                               linha["bateria_inicio_pct"] + saldo)

    def test_desperdicio_quando_a_bateria_enche(self):
        # 9b: a bateria enche ao meio-dia e o excedente é registrado.
        self.assertAlmostEqual(self.todas["9b"]["preditivo"]["resumo"]["desperdicio_kwh"], 132, places=0)

    def test_preditivo_corta_durante_a_tempestade_antes_do_reativo(self):
        # 9b, 9c e 9d: o preditivo corta com a tempestade em curso; o reativo, não.
        for codigo in ["9b", "9c", "9d"]:
            with self.subTest(simulacao=codigo):
                cortou_p = False
                cortou_r = False
                for i in range(12):
                    p = self.todas[codigo]["preditivo"]["linhas"][i]
                    r = self.todas[codigo]["reativo"]["linhas"][i]
                    if p["tempestade"] and p["desligados"]:
                        cortou_p = True
                    if r["tempestade"] and r["desligados"]:
                        cortou_r = True
                self.assertTrue(cortou_p)
                self.assertFalse(cortou_r)

    def test_na_9c_o_corte_vem_na_primeira_hora(self):
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

    def test_de_dia_a_colonia_b_com_ceu_limpo_nao_corta_nada(self):
        # Por isso o EXIGIR_QUEDA: começar às 8h com 53% não é emergência.
        # À noite a bateria cai por projeto, e a regra dos 70% segue cortando.
        resumo = simular_dia("B", None, True)["resumo"]
        self.assertEqual(resumo["modulo_horas_desligados_dia"], 0)

    def test_bateria_sempre_entre_0_e_100(self):
        for codigo in self.todas:
            for sistema in ["reativo", "preditivo"]:
                for linha in self.todas[codigo][sistema]["linhas"]:
                    self.assertGreaterEqual(linha["bateria_fim_pct"], 0)
                    self.assertLessEqual(linha["bateria_fim_pct"], 100)


if __name__ == "__main__":
    unittest.main()
