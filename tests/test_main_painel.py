# Testes do MENU (main.py) e da EXPORTAÇÃO para o painel (painel.py).
import contextlib
import io
import json
import os
import tempfile
import unittest
from unittest.mock import patch

import main
from painel import exportar_painel, dados_previsao


def saida_de(opcao):
    # Função: roda uma opção do menu e devolve (continua?, texto impresso).
    texto = io.StringIO()
    with contextlib.redirect_stdout(texto):
        continua = main.executar(opcao)
    return continua, texto.getvalue()


class TestMenu(unittest.TestCase):

    def test_sair(self):
        self.assertFalse(saida_de("sair")[0])
        self.assertFalse(saida_de(" Q ")[0])

    def test_enter_vazio_nao_encerra(self):
        self.assertTrue(saida_de("")[0])

    def test_opcao_inexistente(self):
        continua, texto = saida_de("9")
        self.assertTrue(continua)
        self.assertIn("Opção não encontrada", texto)

    def test_cenario_1_mostra_as_frases_do_enunciado(self):
        texto = saida_de("1")[1]
        self.assertIn("ALERTA: reduzir consumo", texto)
        self.assertIn("ALERTA: consumo maior que geração", texto)

    def test_cenario_17_explica_por_que_nao_religou(self):
        self.assertIn("Aguardando: Laboratório", saida_de("17")[1])

    def test_cenario_invalido_mostra_o_erro(self):
        self.assertIn("ERRO: leitura inválida", saida_de("10a")[1])

    def test_simulacao_mostra_placar_e_noite(self):
        texto = saida_de("9b")[1]
        self.assertIn("noite", texto)
        self.assertIn("módulo-horas", texto)
        self.assertIn("ABAIXO DO PISO", texto)

    def test_arvore_e_fisica(self):
        self.assertIn("energetico", saida_de("arv")[1])
        texto = saida_de("fis")[1]
        self.assertIn("1,2 kW", texto)
        self.assertIn("200,0 kW", texto)

    def test_todos_roda_sem_erro(self):
        self.assertTrue(saida_de("todos")[0])

    def test_entrada_fechada_e_ctrl_c_encerram_sem_erro(self):
        for erro in [EOFError, KeyboardInterrupt]:
            with patch("builtins.input", side_effect=erro):
                with contextlib.redirect_stdout(io.StringIO()):
                    main.main()


class TestPainel(unittest.TestCase):

    def test_arquivo_gerado_tem_os_dados(self):
        with tempfile.TemporaryDirectory() as pasta:
            caminho = os.path.join(pasta, "novo", "dados.js")
            exportar_painel(caminho)
            with open(caminho, encoding="utf-8") as arquivo:
                texto = arquivo.read()
        dados = json.loads(texto.split("const DADOS = ")[1].rstrip().rstrip(";"))
        self.assertEqual(len(dados["cenarios"]), 21)
        self.assertEqual(sorted(dados["simulacoes"]), ["9a", "9b", "9c", "9d"])
        linhas = dados["simulacoes"]["9b"]["reativo"]["linhas"]
        self.assertEqual(len(linhas), 22)

    def test_caminho_padrao_fica_na_pasta_do_projeto(self):
        projeto = os.path.dirname(os.path.abspath(main.__file__))
        atual = os.getcwd()
        with tempfile.TemporaryDirectory() as pasta:
            os.chdir(pasta)
            try:
                caminho = exportar_painel()
            finally:
                os.chdir(atual)
        self.assertEqual(caminho, os.path.join(projeto, "painel", "dados.js"))

    def test_previsao_exportada(self):
        previsao = dados_previsao()
        self.assertAlmostEqual(previsao["beta1"], 2.5)
        self.assertEqual(len(previsao["seletor_vento"]), 26)
        ultimo = previsao["reta_x_fisica"][-1]
        self.assertAlmostEqual(ultimo["fisica_calibrada_kw"], 200)
        self.assertAlmostEqual(ultimo["fisica_pura_kw"], 9.6)


if __name__ == "__main__":
    unittest.main()
