// Gerado por painel.py. NÃO editar à mão: rode python painel.py
const DADOS = {
 "arvore": [
  "tipo = B",
  "energetico",
  "    solar",
  "        geracao_kw = 0",
  "        pico_kw = 140",
  "    eolico",
  "        geracao_kw = 0",
  "        vento_m_s = 10",
  "        area_pas_m2 = 120",
  "    bateria",
  "        nivel_pct = 53",
  "        capacidade_kwh = 1100",
  "        piso_pct = 50",
  "ambiental",
  "    temp_interna_c = 21",
  "    temp_externa_c = -60",
  "    vento_m_s = 10",
  "    tempestade = False",
  "operacional",
  "    modulos",
  "        Energia",
  "            prioridade = 1",
  "            essencial = True",
  "            ligado = True",
  "            estado = ok",
  "            consumo_atual_kw = 5",
  "            perfil_kw = lista com 24 valores",
  "            desligado_desde = None",
  "        Habitação",
  "            prioridade = 2",
  "            essencial = True",
  "            ligado = True",
  "            estado = ok",
  "            consumo_atual_kw = 30",
  "            perfil_kw = lista com 24 valores",
  "            desligado_desde = None",
  "        Médico",
  "            prioridade = 2",
  "            essencial = True",
  "            ligado = True",
  "            estado = ok",
  "            consumo_atual_kw = 12",
  "            perfil_kw = lista com 24 valores",
  "            desligado_desde = None",
  "        Logística",
  "            prioridade = 3",
  "            essencial = False",
  "            ligado = True",
  "            estado = ok",
  "            consumo_atual_kw = 12",
  "            perfil_kw = lista com 24 valores",
  "            desligado_desde = None",
  "        Laboratório",
  "            prioridade = 4",
  "            essencial = False",
  "            ligado = True",
  "            estado = ok",
  "            consumo_atual_kw = 15",
  "            perfil_kw = lista com 24 valores",
  "            desligado_desde = None",
  "    alertas_de_falha = lista com 0 valores"
 ],
 "colonias": {
  "A": {
   "nome": "Colônia A (bateria pequena)",
   "capacidade_kwh": 440,
   "piso_pct": 20,
   "bateria_8h_pct": 29
  },
  "B": {
   "nome": "Colônia B (bateria grande)",
   "capacidade_kwh": 1100,
   "piso_pct": 50,
   "bateria_8h_pct": 53
  }
 },
 "tempestades": {
  "manha": {
   "nome": "Tempestade da manhã",
   "inicio": 10
  },
  "tarde": {
   "nome": "Tempestade da tarde",
   "inicio": 14
  }
 },
 "previsao": {
  "beta0": 0.0,
  "beta1": 2.5,
  "r2": 1.0,
  "pontos": {
   "vento": [
    8,
    10,
    12
   ],
   "energia": [
    20,
    25,
    30
   ]
  },
  "reta_x_fisica": [
   {
    "vento_m_s": 8,
    "reta_kw": 20.0,
    "fisica_calibrada_kw": 12.800000000000002,
    "fisica_pura_kw": 0.6144
   },
   {
    "vento_m_s": 10,
    "reta_kw": 25.0,
    "fisica_calibrada_kw": 25.0,
    "fisica_pura_kw": 1.2
   },
   {
    "vento_m_s": 12,
    "reta_kw": 30.0,
    "fisica_calibrada_kw": 43.199999999999996,
    "fisica_pura_kw": 2.0736
   },
   {
    "vento_m_s": 15,
    "reta_kw": 37.5,
    "fisica_calibrada_kw": 84.375,
    "fisica_pura_kw": 4.05
   },
   {
    "vento_m_s": 20,
    "reta_kw": 50.0,
    "fisica_calibrada_kw": 200.0,
    "fisica_pura_kw": 9.6
   }
  ],
  "seletor_vento": [
   {
    "vento_m_s": 0,
    "previsao_kw": 0.0
   },
   {
    "vento_m_s": 1,
    "previsao_kw": 2.5
   },
   {
    "vento_m_s": 2,
    "previsao_kw": 5.0
   },
   {
    "vento_m_s": 3,
    "previsao_kw": 7.5
   },
   {
    "vento_m_s": 4,
    "previsao_kw": 10.0
   },
   {
    "vento_m_s": 5,
    "previsao_kw": 12.5
   },
   {
    "vento_m_s": 6,
    "previsao_kw": 15.0
   },
   {
    "vento_m_s": 7,
    "previsao_kw": 17.5
   },
   {
    "vento_m_s": 8,
    "previsao_kw": 20.0
   },
   {
    "vento_m_s": 9,
    "previsao_kw": 22.5
   },
   {
    "vento_m_s": 10,
    "previsao_kw": 25.0
   },
   {
    "vento_m_s": 11,
    "previsao_kw": 27.5
   },
   {
    "vento_m_s": 12,
    "previsao_kw": 30.0
   },
   {
    "vento_m_s": 13,
    "previsao_kw": 32.5
   },
   {
    "vento_m_s": 14,
    "previsao_kw": 35.0
   },
   {
    "vento_m_s": 15,
    "previsao_kw": 37.5
   },
   {
    "vento_m_s": 16,
    "previsao_kw": 40.0
   },
   {
    "vento_m_s": 17,
    "previsao_kw": 42.5
   },
   {
    "vento_m_s": 18,
    "previsao_kw": 45.0
   },
   {
    "vento_m_s": 19,
    "previsao_kw": 47.5
   },
   {
    "vento_m_s": 20,
    "previsao_kw": 50.0
   },
   {
    "vento_m_s": 21,
    "previsao_kw": 52.5
   },
   {
    "vento_m_s": 22,
    "previsao_kw": 55.0
   },
   {
    "vento_m_s": 23,
    "previsao_kw": 57.5
   },
   {
    "vento_m_s": 24,
    "previsao_kw": 60.0
   },
   {
    "vento_m_s": 25,
    "previsao_kw": 62.5
   }
  ]
 },
 "simulacoes": {
  "9a": {
   "reativo": {
    "colonia": "A",
    "tempestade": "manha",
    "sistema": "reativo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 29,
      "bateria_fim_pct": 35.54040404040404,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 35.54040404040404,
      "bateria_fim_pct": 56.222222222222214,
      "geracao_kw": 130.0,
      "consumo_kw": 39,
      "situacao": "ECONOMIA",
      "projecao_pct": null,
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 10,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 56.222222222222214,
      "bateria_fim_pct": 60.13636363636363,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 11,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 60.13636363636363,
      "bateria_fim_pct": 52.364898989898975,
      "geracao_kw": 56.80555555555556,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "desligados": []
     },
     {
      "hora": 12,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 52.364898989898975,
      "bateria_fim_pct": 44.63762626262625,
      "geracao_kw": 57.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 44.63762626262625,
      "bateria_fim_pct": 72.39015151515152,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 39,
      "situacao": "ECONOMIA",
      "projecao_pct": null,
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 14,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 72.39015151515152,
      "bateria_fim_pct": 97.49116161616162,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 15,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 97.49116161616162,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "desligados": []
     },
     {
      "hora": 16,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 94.72222222222221,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 94.72222222222221,
      "bateria_fim_pct": 83.58585858585859,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 83.58585858585859,
      "bateria_fim_pct": 72.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 72.44949494949495,
      "bateria_fim_pct": 67.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 67.44949494949495,
      "bateria_fim_pct": 62.44949494949494,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 62.44949494949494,
      "bateria_fim_pct": 57.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 57.44949494949495,
      "bateria_fim_pct": 52.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 52.44949494949495,
      "bateria_fim_pct": 47.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 47.44949494949495,
      "bateria_fim_pct": 42.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 42.44949494949495,
      "bateria_fim_pct": 37.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 37.44949494949495,
      "bateria_fim_pct": 32.44949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 32.44949494949495,
      "bateria_fim_pct": 27.449494949494945,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 27.449494949494945,
      "bateria_fim_pct": 22.449494949494945,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 29,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 9,
      "entrada": "bateria 35,5%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B·A: bateria baixa e consumo alto",
      "situacao": "MODO ECONOMIA: desligar sistemas não essenciais",
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 56,2%, geração 56,2 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 11,
      "entrada": "bateria 60,1%, geração 56,8 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 52,4%, geração 57,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 44,6%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B·A: bateria baixa e consumo alto",
      "situacao": "MODO ECONOMIA: desligar sistemas não essenciais",
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 72,4%, geração 149,4 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 97,5%, geração 130,0 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "observacao": ""
     },
     {
      "hora": 16,
      "entrada": "bateria 100,0%, geração 102,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 17,
      "entrada": "bateria 100,0%, geração 67,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 94,7%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 19,
      "entrada": "bateria 83,6%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 20,
      "entrada": "bateria 72,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 21,
      "entrada": "bateria 67,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 22,
      "entrada": "bateria 62,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 23,
      "entrada": "bateria 57,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 0,
      "entrada": "bateria 52,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 1,
      "entrada": "bateria 47,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 2,
      "entrada": "bateria 42,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 3,
      "entrada": "bateria 37,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 4,
      "entrada": "bateria 32,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 5,
      "entrada": "bateria 27,4%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     }
    ],
    "resumo": {
     "bateria_20h_pct": 72.44949494949495,
     "menor_bateria_pct": 22.449494949494945,
     "horas_criticas": 0,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 8,
     "modulo_horas_desligados_dia": 8,
     "desperdicio_kwh": 39.73888888888888,
     "reserva_para_noite": true,
     "amanhecer_pct": 22.449494949494945,
     "amanhece_acima_do_piso": true
    }
   },
   "preditivo": {
    "colonia": "A",
    "tempestade": "manha",
    "sistema": "preditivo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 29,
      "bateria_fim_pct": 35.54040404040404,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "ALERTA",
      "projecao_pct": 57.686868686868685,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 35.54040404040404,
      "bateria_fim_pct": 56.222222222222214,
      "geracao_kw": 130.0,
      "consumo_kw": 39,
      "situacao": "ECONOMIA",
      "projecao_pct": 73.62121212121212,
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 10,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 56.222222222222214,
      "bateria_fim_pct": 60.13636363636363,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": 68.27398989898988,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 11,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 60.13636363636363,
      "bateria_fim_pct": 64.18308080808079,
      "geracao_kw": 56.80555555555556,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": 72.32070707070706,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 12,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 64.18308080808079,
      "bateria_fim_pct": 68.27398989898987,
      "geracao_kw": 57.0,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": 76.23484848484846,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 68.27398989898987,
      "bateria_fim_pct": 84.20833333333331,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 100.0,
      "acoes": [
       "Religado: Logística — projeção em 100,0%",
       "Religado: Laboratório — projeção em 100,0%"
      ],
      "desligados": []
     },
     {
      "hora": 14,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 84.20833333333331,
      "bateria_fim_pct": 97.4911616161616,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 100.0,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 15,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 97.4911616161616,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 94.72222222222221,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 16,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 83.58585858585859,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 94.72222222222221,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 72.44949494949495,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 94.72222222222221,
      "bateria_fim_pct": 86.9949494949495,
      "geracao_kw": 25.0,
      "consumo_kw": 59,
      "situacao": "NORMAL",
      "projecao_pct": 67.44949494949495,
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 67,4% em 3h (abaixo de 70% e caindo)"
      ],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 86.9949494949495,
      "bateria_fim_pct": 79.26767676767676,
      "geracao_kw": 25.0,
      "consumo_kw": 59,
      "situacao": "NORMAL",
      "projecao_pct": 71.54040404040404,
      "acoes": [],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 79.26767676767676,
      "bateria_fim_pct": 76.54040404040404,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 67.67676767676768,
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 67,6% em 3h (abaixo de 70% e caindo)"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 76.54040404040404,
      "bateria_fim_pct": 73.81313131313131,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 68.35858585858585,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 73.81313131313131,
      "bateria_fim_pct": 71.08585858585859,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 65.63131313131314,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 71.08585858585859,
      "bateria_fim_pct": 68.35858585858585,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 62.90404040404041,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 68.35858585858585,
      "bateria_fim_pct": 65.63131313131314,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 60.176767676767675,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 65.63131313131314,
      "bateria_fim_pct": 62.904040404040416,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 57.44949494949496,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 62.904040404040416,
      "bateria_fim_pct": 60.17676767676768,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 54.722222222222236,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 60.17676767676768,
      "bateria_fim_pct": 57.44949494949496,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 51.9949494949495,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 57.44949494949496,
      "bateria_fim_pct": 54.722222222222236,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 49.267676767676775,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 54.722222222222236,
      "bateria_fim_pct": 51.994949494949516,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 56.262626262626284,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 29,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": 57.686868686868685,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: a projeção de 57,7% não está caindo abaixo de 70%"
     },
     {
      "hora": 9,
      "entrada": "bateria 35,5%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 73.62121212121212,
      "regra": "B·A: bateria baixa e consumo alto",
      "situacao": "MODO ECONOMIA: desligar sistemas não essenciais",
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 56,2%, geração 56,2 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 68.27398989898988,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 11,
      "entrada": "bateria 60,1%, geração 56,8 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 72.32070707070706,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 64,2%, geração 57,0 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 76.23484848484846,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 68,3%, geração 161,1 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 100.0,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Logística — projeção em 100,0%",
       "Religado: Laboratório — projeção em 100,0%"
      ],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 84,2%, geração 149,4 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 100.0,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 97,5%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 94.72222222222221,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 16,
      "entrada": "bateria 100,0%, geração 102,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 83.58585858585859,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 17,
      "entrada": "bateria 100,0%, geração 67,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 72.44949494949495,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 94,7%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": 67.44949494949495,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 67,4% em 3h (abaixo de 70% e caindo)"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 19,
      "entrada": "bateria 87,0%, geração 25,0 kW, consumo 59,0 kW",
      "anomalias": [],
      "projecao_pct": 71.54040404040404,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 20,
      "entrada": "bateria 79,3%, geração 25,0 kW, consumo 42,0 kW",
      "anomalias": [],
      "projecao_pct": 67.67676767676768,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 67,6% em 3h (abaixo de 70% e caindo)"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 21,
      "entrada": "bateria 76,5%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 68.35858585858585,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 22,
      "entrada": "bateria 73,8%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 65.63131313131314,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 23,
      "entrada": "bateria 71,1%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 62.90404040404041,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 0,
      "entrada": "bateria 68,4%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 60.176767676767675,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 1,
      "entrada": "bateria 65,6%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 57.44949494949496,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 2,
      "entrada": "bateria 62,9%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 54.722222222222236,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 3,
      "entrada": "bateria 60,2%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 51.9949494949495,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 4,
      "entrada": "bateria 57,4%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 49.267676767676775,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 5,
      "entrada": "bateria 54,7%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 56.262626262626284,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     }
    ],
    "resumo": {
     "bateria_20h_pct": 79.26767676767676,
     "menor_bateria_pct": 29,
     "horas_criticas": 0,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 30,
     "modulo_horas_desligados_dia": 10,
     "desperdicio_kwh": 39.73888888888882,
     "reserva_para_noite": true,
     "amanhecer_pct": 51.994949494949516,
     "amanhece_acima_do_piso": true
    }
   }
  },
  "9b": {
   "reativo": {
    "colonia": "A",
    "tempestade": "tarde",
    "sistema": "reativo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 29,
      "bateria_fim_pct": 35.54040404040404,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 35.54040404040404,
      "bateria_fim_pct": 56.222222222222214,
      "geracao_kw": 130.0,
      "consumo_kw": 39,
      "situacao": "ECONOMIA",
      "projecao_pct": null,
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 10,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 56.222222222222214,
      "bateria_fim_pct": 81.32323232323232,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 11,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 81.32323232323232,
      "bateria_fim_pct": 97.25757575757574,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "desligados": []
     },
     {
      "hora": 12,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 97.25757575757574,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 165.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 14,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 92.0959595959596,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 15,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 92.0959595959596,
      "bateria_fim_pct": 83.9709595959596,
      "geracao_kw": 55.25,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 16,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 83.9709595959596,
      "bateria_fim_pct": 75.53661616161615,
      "geracao_kw": 53.888888888888886,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 75.53661616161615,
      "bateria_fim_pct": 70.25883838383837,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 70.25883838383837,
      "bateria_fim_pct": 59.122474747474726,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 59.122474747474726,
      "bateria_fim_pct": 47.98611111111109,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 47.98611111111109,
      "bateria_fim_pct": 42.98611111111109,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 42.98611111111109,
      "bateria_fim_pct": 37.98611111111109,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 37.98611111111109,
      "bateria_fim_pct": 32.986111111111086,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 32.986111111111086,
      "bateria_fim_pct": 27.98611111111109,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 27.98611111111109,
      "bateria_fim_pct": 22.98611111111109,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 22.98611111111109,
      "bateria_fim_pct": 17.986111111111093,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 17.986111111111093,
      "bateria_fim_pct": 15.258838383838363,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "CRITICO",
      "projecao_pct": null,
      "acoes": [
       "Desligado: Laboratório — motivo: situação CRÍTICO",
       "Desligado: Logística — motivo: situação CRÍTICO"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 15.258838383838363,
      "bateria_fim_pct": 12.531565656565636,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "CRITICO",
      "projecao_pct": null,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 12.531565656565636,
      "bateria_fim_pct": 9.804292929292908,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "CRITICO",
      "projecao_pct": null,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 9.804292929292908,
      "bateria_fim_pct": 7.07702020202018,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "CRITICO",
      "projecao_pct": null,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 29,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 9,
      "entrada": "bateria 35,5%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B·A: bateria baixa e consumo alto",
      "situacao": "MODO ECONOMIA: desligar sistemas não essenciais",
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 56,2%, geração 149,4 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 11,
      "entrada": "bateria 81,3%, geração 161,1 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 97,3%, geração 165,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 100,0%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 100,0%, geração 56,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 92,1%, geração 55,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 16,
      "entrada": "bateria 84,0%, geração 53,9 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 17,
      "entrada": "bateria 75,5%, geração 67,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 70,3%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 19,
      "entrada": "bateria 59,1%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 20,
      "entrada": "bateria 48,0%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 21,
      "entrada": "bateria 43,0%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 22,
      "entrada": "bateria 38,0%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 23,
      "entrada": "bateria 33,0%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 0,
      "entrada": "bateria 28,0%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 1,
      "entrada": "bateria 23,0%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 2,
      "entrada": "bateria 18,0%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "C: bateria < 20%",
      "situacao": "CRÍTICO: modo emergência — só suporte à vida",
      "acoes": [
       "Desligado: Laboratório — motivo: situação CRÍTICO",
       "Desligado: Logística — motivo: situação CRÍTICO"
      ],
      "observacao": ""
     },
     {
      "hora": 3,
      "entrada": "bateria 15,3%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "C: bateria < 20%",
      "situacao": "CRÍTICO: modo emergência — só suporte à vida",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 4,
      "entrada": "bateria 12,5%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "C: bateria < 20%",
      "situacao": "CRÍTICO: modo emergência — só suporte à vida",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 5,
      "entrada": "bateria 9,8%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "C: bateria < 20%",
      "situacao": "CRÍTICO: modo emergência — só suporte à vida",
      "acoes": [],
      "observacao": ""
     }
    ],
    "resumo": {
     "bateria_20h_pct": 47.98611111111109,
     "menor_bateria_pct": 7.07702020202018,
     "horas_criticas": 4,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 12,
     "modulo_horas_desligados_dia": 4,
     "desperdicio_kwh": 132.0444444444443,
     "reserva_para_noite": false,
     "amanhecer_pct": 7.07702020202018,
     "amanhece_acima_do_piso": false
    }
   },
   "preditivo": {
    "colonia": "A",
    "tempestade": "tarde",
    "sistema": "preditivo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 29,
      "bateria_fim_pct": 35.54040404040404,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "ALERTA",
      "projecao_pct": 57.686868686868685,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 35.54040404040404,
      "bateria_fim_pct": 56.222222222222214,
      "geracao_kw": 130.0,
      "consumo_kw": 39,
      "situacao": "ECONOMIA",
      "projecao_pct": 73.62121212121212,
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 10,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 56.222222222222214,
      "bateria_fim_pct": 81.32323232323232,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": 100.0,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 11,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 81.32323232323232,
      "bateria_fim_pct": 97.25757575757574,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 100.0,
      "acoes": [
       "Religado: Logística — projeção em 100,0%",
       "Religado: Laboratório — projeção em 100,0%"
      ],
      "desligados": []
     },
     {
      "hora": 12,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 97.25757575757574,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 165.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 100.0,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 100.0,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 100.0,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 14,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 100.0,
      "bateria_fim_pct": 92.0959595959596,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 75.53661616161615,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 15,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 92.0959595959596,
      "bateria_fim_pct": 90.78914141414141,
      "geracao_kw": 55.25,
      "consumo_kw": 61,
      "situacao": "NORMAL",
      "projecao_pct": 66.70454545454545,
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 66,7% em 3h (abaixo de 70% e caindo)"
      ],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 16,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 90.78914141414141,
      "bateria_fim_pct": 89.17297979797979,
      "geracao_kw": 53.888888888888886,
      "consumo_kw": 61,
      "situacao": "NORMAL",
      "projecao_pct": 85.11363636363637,
      "acoes": [],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 89.17297979797979,
      "bateria_fim_pct": 90.71338383838383,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 61,
      "situacao": "NORMAL",
      "projecao_pct": 75.25883838383838,
      "acoes": [],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 90.71338383838383,
      "bateria_fim_pct": 82.9861111111111,
      "geracao_kw": 25.0,
      "consumo_kw": 59,
      "situacao": "NORMAL",
      "projecao_pct": 71.395202020202,
      "acoes": [],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 82.9861111111111,
      "bateria_fim_pct": 77.9861111111111,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": 67.53156565656565,
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 67,5% em 3h (abaixo de 70% e caindo)"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 77.9861111111111,
      "bateria_fim_pct": 75.25883838383838,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 69.80429292929293,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 75.25883838383838,
      "bateria_fim_pct": 72.53156565656565,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 67.0770202020202,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 72.53156565656565,
      "bateria_fim_pct": 69.80429292929293,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 64.34974747474746,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 69.80429292929293,
      "bateria_fim_pct": 67.07702020202021,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 61.622474747474755,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 67.07702020202021,
      "bateria_fim_pct": 64.34974747474747,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 58.89520202020203,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 64.34974747474747,
      "bateria_fim_pct": 61.622474747474755,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 56.167929292929294,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 61.622474747474755,
      "bateria_fim_pct": 58.89520202020203,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 53.440656565656575,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 58.89520202020203,
      "bateria_fim_pct": 56.167929292929294,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 50.71338383838384,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 56.167929292929294,
      "bateria_fim_pct": 53.440656565656575,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 47.98611111111112,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 53.440656565656575,
      "bateria_fim_pct": 50.71338383838384,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 54.98106060606061,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 29,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": 57.686868686868685,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: a projeção de 57,7% não está caindo abaixo de 70%"
     },
     {
      "hora": 9,
      "entrada": "bateria 35,5%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 73.62121212121212,
      "regra": "B·A: bateria baixa e consumo alto",
      "situacao": "MODO ECONOMIA: desligar sistemas não essenciais",
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 56,2%, geração 149,4 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 100.0,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 11,
      "entrada": "bateria 81,3%, geração 161,1 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 100.0,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Logística — projeção em 100,0%",
       "Religado: Laboratório — projeção em 100,0%"
      ],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 97,3%, geração 165,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 100.0,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 100,0%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 100.0,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 100,0%, geração 56,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 75.53661616161615,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 92,1%, geração 55,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 66.70454545454545,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 66,7% em 3h (abaixo de 70% e caindo)"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 16,
      "entrada": "bateria 90,8%, geração 53,9 kW, consumo 61,0 kW",
      "anomalias": [],
      "projecao_pct": 85.11363636363637,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 17,
      "entrada": "bateria 89,2%, geração 67,8 kW, consumo 61,0 kW",
      "anomalias": [],
      "projecao_pct": 75.25883838383838,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 90,7%, geração 25,0 kW, consumo 59,0 kW",
      "anomalias": [],
      "projecao_pct": 71.395202020202,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 19,
      "entrada": "bateria 83,0%, geração 25,0 kW, consumo 59,0 kW",
      "anomalias": [],
      "projecao_pct": 67.53156565656565,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 67,5% em 3h (abaixo de 70% e caindo)"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 20,
      "entrada": "bateria 78,0%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 69.80429292929293,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 21,
      "entrada": "bateria 75,3%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 67.0770202020202,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 22,
      "entrada": "bateria 72,5%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 64.34974747474746,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 23,
      "entrada": "bateria 69,8%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 61.622474747474755,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 0,
      "entrada": "bateria 67,1%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 58.89520202020203,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 1,
      "entrada": "bateria 64,3%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 56.167929292929294,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 2,
      "entrada": "bateria 61,6%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 53.440656565656575,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 3,
      "entrada": "bateria 58,9%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 50.71338383838384,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 4,
      "entrada": "bateria 56,2%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 47.98611111111112,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 5,
      "entrada": "bateria 53,4%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 54.98106060606061,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     }
    ],
    "resumo": {
     "bateria_20h_pct": 77.9861111111111,
     "menor_bateria_pct": 29,
     "horas_criticas": 0,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 30,
     "modulo_horas_desligados_dia": 10,
     "desperdicio_kwh": 132.0444444444443,
     "reserva_para_noite": true,
     "amanhecer_pct": 50.71338383838384,
     "amanhece_acima_do_piso": true
    }
   }
  },
  "9c": {
   "reativo": {
    "colonia": "B",
    "tempestade": "manha",
    "sistema": "reativo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 53,
      "bateria_fim_pct": 55.61616161616162,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 55.61616161616162,
      "bateria_fim_pct": 59.16161616161617,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 10,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 59.16161616161617,
      "bateria_fim_pct": 56.00000000000001,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 11,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 56.00000000000001,
      "bateria_fim_pct": 52.89141414141415,
      "geracao_kw": 56.80555555555556,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 12,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 52.89141414141415,
      "bateria_fim_pct": 49.80050505050506,
      "geracao_kw": 57.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 49.80050505050506,
      "bateria_fim_pct": 60.90151515151516,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 39,
      "situacao": "ECONOMIA",
      "projecao_pct": null,
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 14,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 60.90151515151516,
      "bateria_fim_pct": 70.9419191919192,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 15,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 70.9419191919192,
      "bateria_fim_pct": 74.48737373737374,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "desligados": []
     },
     {
      "hora": 16,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 74.48737373737374,
      "bateria_fim_pct": 75.5580808080808,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 75.5580808080808,
      "bateria_fim_pct": 73.4469696969697,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 73.4469696969697,
      "bateria_fim_pct": 68.99242424242425,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 68.99242424242425,
      "bateria_fim_pct": 64.53787878787878,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 64.53787878787878,
      "bateria_fim_pct": 62.537878787878775,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 62.537878787878775,
      "bateria_fim_pct": 60.537878787878775,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 60.537878787878775,
      "bateria_fim_pct": 58.537878787878775,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 58.537878787878775,
      "bateria_fim_pct": 56.53787878787877,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 56.53787878787877,
      "bateria_fim_pct": 54.53787878787878,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 54.53787878787878,
      "bateria_fim_pct": 52.53787878787879,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 52.53787878787879,
      "bateria_fim_pct": 50.53787878787879,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 50.53787878787879,
      "bateria_fim_pct": 48.53787878787878,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 48.53787878787878,
      "bateria_fim_pct": 46.53787878787878,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 46.53787878787878,
      "bateria_fim_pct": 44.53787878787878,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 53,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 9,
      "entrada": "bateria 55,6%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 59,2%, geração 56,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 11,
      "entrada": "bateria 56,0%, geração 56,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 52,9%, geração 57,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 49,8%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B·A: bateria baixa e consumo alto",
      "situacao": "MODO ECONOMIA: desligar sistemas não essenciais",
      "acoes": [
       "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
       "Desligado: Logística — motivo: situação MODO ECONOMIA"
      ],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 60,9%, geração 149,4 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 70,9%, geração 130,0 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Logística",
       "Religado: Laboratório"
      ],
      "observacao": ""
     },
     {
      "hora": 16,
      "entrada": "bateria 74,5%, geração 102,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 17,
      "entrada": "bateria 75,6%, geração 67,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 73,4%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 19,
      "entrada": "bateria 69,0%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 20,
      "entrada": "bateria 64,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 21,
      "entrada": "bateria 62,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 22,
      "entrada": "bateria 60,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 23,
      "entrada": "bateria 58,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 0,
      "entrada": "bateria 56,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 1,
      "entrada": "bateria 54,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 2,
      "entrada": "bateria 52,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 3,
      "entrada": "bateria 50,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 4,
      "entrada": "bateria 48,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 5,
      "entrada": "bateria 46,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     }
    ],
    "resumo": {
     "bateria_20h_pct": 64.53787878787878,
     "menor_bateria_pct": 44.53787878787878,
     "horas_criticas": 0,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 4,
     "modulo_horas_desligados_dia": 4,
     "desperdicio_kwh": 0,
     "reserva_para_noite": false,
     "amanhecer_pct": 44.53787878787878,
     "amanhece_acima_do_piso": false
    }
   },
   "preditivo": {
    "colonia": "B",
    "tempestade": "manha",
    "sistema": "preditivo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 53,
      "bateria_fim_pct": 55.61616161616162,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": 64.47474747474749,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 55.61616161616162,
      "bateria_fim_pct": 59.16161616161617,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 70.84848484848484,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 10,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 59.16161616161617,
      "bateria_fim_pct": 60.72727272727273,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": 49.80050505050505,
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 49,8% em 3h (abaixo de 70% e caindo)",
       "Desligado: Logística — motivo: bateria projetada em 49,8% em 3h (abaixo de 70% e caindo)",
       "ATENÇÃO: só restou o suporte à vida; reserva projetada em 63,9%"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 11,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 60.72727272727273,
      "bateria_fim_pct": 62.3459595959596,
      "geracao_kw": 56.80555555555556,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": 65.60101010101009,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 12,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 62.3459595959596,
      "bateria_fim_pct": 63.98232323232323,
      "geracao_kw": 57.0,
      "consumo_kw": 39,
      "situacao": "NORMAL",
      "projecao_pct": 67.16666666666666,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 63.98232323232323,
      "bateria_fim_pct": 73.08333333333333,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 61,
      "situacao": "NORMAL",
      "projecao_pct": 93.39646464646464,
      "acoes": [
       "Religado: Logística — projeção em 87,4%"
      ],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 14,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 73.08333333333333,
      "bateria_fim_pct": 78.39646464646465,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 91.19444444444444,
      "acoes": [
       "Religado: Laboratório — projeção em 83,0%"
      ],
      "desligados": []
     },
     {
      "hora": 15,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 78.39646464646465,
      "bateria_fim_pct": 81.94191919191918,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 80.90151515151516,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 16,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 81.94191919191918,
      "bateria_fim_pct": 83.01262626262627,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 76.4469696969697,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 83.01262626262627,
      "bateria_fim_pct": 80.90151515151516,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 71.99242424242425,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 80.90151515151516,
      "bateria_fim_pct": 77.81060606060606,
      "geracao_kw": 25.0,
      "consumo_kw": 59,
      "situacao": "NORMAL",
      "projecao_pct": 69.99242424242425,
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 69,9% em 3h (abaixo de 70% e caindo)"
      ],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 77.81060606060606,
      "bateria_fim_pct": 74.71969696969697,
      "geracao_kw": 25.0,
      "consumo_kw": 59,
      "situacao": "NORMAL",
      "projecao_pct": 71.62878787878788,
      "acoes": [],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 74.71969696969697,
      "bateria_fim_pct": 73.17424242424242,
      "geracao_kw": 25.0,
      "consumo_kw": 42,
      "situacao": "NORMAL",
      "projecao_pct": 70.08333333333333,
      "acoes": [],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 73.17424242424242,
      "bateria_fim_pct": 72.08333333333333,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 68.53787878787878,
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 68,5% em 3h (abaixo de 70% e caindo)",
       "ATENÇÃO: só restou o suporte à vida; reserva projetada em 69,9%"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 72.08333333333333,
      "bateria_fim_pct": 70.99242424242424,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 68.81060606060606,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 70.99242424242424,
      "bateria_fim_pct": 69.90151515151514,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 67.71969696969697,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 69.90151515151514,
      "bateria_fim_pct": 68.81060606060605,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 66.62878787878786,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 68.81060606060605,
      "bateria_fim_pct": 67.71969696969695,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 65.53787878787878,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 67.71969696969695,
      "bateria_fim_pct": 66.62878787878786,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 64.44696969696967,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 66.62878787878786,
      "bateria_fim_pct": 65.53787878787878,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 63.356060606060595,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 65.53787878787878,
      "bateria_fim_pct": 64.44696969696967,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 62.26515151515151,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 64.44696969696967,
      "bateria_fim_pct": 63.35606060606058,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 65.06313131313128,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 53,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": 64.47474747474749,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 9,
      "entrada": "bateria 55,6%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 70.84848484848484,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 59,2%, geração 56,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 49.80050505050505,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 49,8% em 3h (abaixo de 70% e caindo)",
       "Desligado: Logística — motivo: bateria projetada em 49,8% em 3h (abaixo de 70% e caindo)",
       "ATENÇÃO: só restou o suporte à vida; reserva projetada em 63,9%"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 11,
      "entrada": "bateria 60,7%, geração 56,8 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 65.60101010101009,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 62,3%, geração 57,0 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 67.16666666666666,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 64,0%, geração 161,1 kW, consumo 39,0 kW",
      "anomalias": [],
      "projecao_pct": 93.39646464646464,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Logística — projeção em 87,4%"
      ],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 73,1%, geração 149,4 kW, consumo 61,0 kW",
      "anomalias": [],
      "projecao_pct": 91.19444444444444,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Religado: Laboratório — projeção em 83,0%"
      ],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 78,4%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 80.90151515151516,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 16,
      "entrada": "bateria 81,9%, geração 102,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 76.4469696969697,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 17,
      "entrada": "bateria 83,0%, geração 67,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 71.99242424242425,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 80,9%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": 69.99242424242425,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 69,9% em 3h (abaixo de 70% e caindo)"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 19,
      "entrada": "bateria 77,8%, geração 25,0 kW, consumo 59,0 kW",
      "anomalias": [],
      "projecao_pct": 71.62878787878788,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 20,
      "entrada": "bateria 74,7%, geração 25,0 kW, consumo 42,0 kW",
      "anomalias": [],
      "projecao_pct": 70.08333333333333,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 21,
      "entrada": "bateria 73,2%, geração 25,0 kW, consumo 42,0 kW",
      "anomalias": [],
      "projecao_pct": 68.53787878787878,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 68,5% em 3h (abaixo de 70% e caindo)",
       "ATENÇÃO: só restou o suporte à vida; reserva projetada em 69,9%"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 22,
      "entrada": "bateria 72,1%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 68.81060606060606,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 23,
      "entrada": "bateria 71,0%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 67.71969696969697,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 0,
      "entrada": "bateria 69,9%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 66.62878787878786,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 1,
      "entrada": "bateria 68,8%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 65.53787878787878,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 2,
      "entrada": "bateria 67,7%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 64.44696969696967,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 3,
      "entrada": "bateria 66,6%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 63.356060606060595,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 4,
      "entrada": "bateria 65,5%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 62.26515151515151,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 5,
      "entrada": "bateria 64,4%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 65.06313131313128,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     }
    ],
    "resumo": {
     "bateria_20h_pct": 74.71969696969697,
     "menor_bateria_pct": 53,
     "horas_criticas": 0,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 28,
     "modulo_horas_desligados_dia": 9,
     "desperdicio_kwh": 0,
     "reserva_para_noite": true,
     "amanhecer_pct": 63.35606060606058,
     "amanhece_acima_do_piso": true
    }
   }
  },
  "9d": {
   "reativo": {
    "colonia": "B",
    "tempestade": "tarde",
    "sistema": "reativo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 53,
      "bateria_fim_pct": 55.61616161616162,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 55.61616161616162,
      "bateria_fim_pct": 59.16161616161617,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 10,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 59.16161616161617,
      "bateria_fim_pct": 64.47474747474749,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 11,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 64.47474747474749,
      "bateria_fim_pct": 70.84848484848484,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 12,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 70.84848484848484,
      "bateria_fim_pct": 77.57575757575758,
      "geracao_kw": 165.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 77.57575757575758,
      "bateria_fim_pct": 83.94949494949495,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 14,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 83.94949494949495,
      "bateria_fim_pct": 80.78787878787878,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 15,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 80.78787878787878,
      "bateria_fim_pct": 77.53787878787878,
      "geracao_kw": 55.25,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 16,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 77.53787878787878,
      "bateria_fim_pct": 74.1641414141414,
      "geracao_kw": 53.888888888888886,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 74.1641414141414,
      "bateria_fim_pct": 72.05303030303027,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 72.05303030303027,
      "bateria_fim_pct": 67.59848484848482,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 67.59848484848482,
      "bateria_fim_pct": 63.14393939393936,
      "geracao_kw": 25.0,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 63.14393939393936,
      "bateria_fim_pct": 61.14393939393936,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 61.14393939393936,
      "bateria_fim_pct": 59.14393939393937,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 59.14393939393937,
      "bateria_fim_pct": 57.14393939393937,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 57.14393939393937,
      "bateria_fim_pct": 55.14393939393937,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 55.14393939393937,
      "bateria_fim_pct": 53.14393939393936,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 53.14393939393936,
      "bateria_fim_pct": 51.14393939393936,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 51.14393939393936,
      "bateria_fim_pct": 49.14393939393937,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 49.14393939393937,
      "bateria_fim_pct": 47.14393939393936,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 47.14393939393936,
      "bateria_fim_pct": 45.143939393939355,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 45.143939393939355,
      "bateria_fim_pct": 43.14393939393935,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "ALERTA",
      "projecao_pct": null,
      "acoes": [],
      "desligados": []
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 53,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 9,
      "entrada": "bateria 55,6%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 59,2%, geração 149,4 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 11,
      "entrada": "bateria 64,5%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 70,8%, geração 165,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 77,6%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 83,9%, geração 56,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 80,8%, geração 55,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 16,
      "entrada": "bateria 77,5%, geração 53,9 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 17,
      "entrada": "bateria 74,2%, geração 67,8 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 72,1%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 19,
      "entrada": "bateria 67,6%, geração 25,0 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 20,
      "entrada": "bateria 63,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 21,
      "entrada": "bateria 61,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 22,
      "entrada": "bateria 59,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 23,
      "entrada": "bateria 57,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 0,
      "entrada": "bateria 55,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 1,
      "entrada": "bateria 53,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 2,
      "entrada": "bateria 51,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 3,
      "entrada": "bateria 49,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 4,
      "entrada": "bateria 47,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     },
     {
      "hora": 5,
      "entrada": "bateria 45,1%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": null,
      "regra": "B: bateria < 50%",
      "situacao": "ALERTA: reduzir consumo",
      "acoes": [],
      "observacao": "Sem corte agora: o reativo só corta em CRÍTICO ou MODO ECONOMIA"
     }
    ],
    "resumo": {
     "bateria_20h_pct": 63.14393939393936,
     "menor_bateria_pct": 43.14393939393935,
     "horas_criticas": 0,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 0,
     "modulo_horas_desligados_dia": 0,
     "desperdicio_kwh": 0,
     "reserva_para_noite": false,
     "amanhecer_pct": 43.14393939393935,
     "amanhece_acima_do_piso": false
    }
   },
   "preditivo": {
    "colonia": "B",
    "tempestade": "tarde",
    "sistema": "preditivo",
    "linhas": [
     {
      "hora": 8,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 53,
      "bateria_fim_pct": 55.61616161616162,
      "geracao_kw": 102.77777777777777,
      "consumo_kw": 74,
      "situacao": "NORMAL",
      "projecao_pct": 64.47474747474749,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 9,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 55.61616161616162,
      "bateria_fim_pct": 59.16161616161617,
      "geracao_kw": 130.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 70.84848484848484,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 10,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 59.16161616161617,
      "bateria_fim_pct": 64.47474747474749,
      "geracao_kw": 149.44444444444446,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 77.57575757575758,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 11,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 64.47474747474749,
      "bateria_fim_pct": 70.84848484848484,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 83.94949494949495,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 12,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 70.84848484848484,
      "bateria_fim_pct": 77.57575757575758,
      "geracao_kw": 165.0,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 89.26262626262627,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 13,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 77.57575757575758,
      "bateria_fim_pct": 83.94949494949495,
      "geracao_kw": 161.11111111111111,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 92.8080808080808,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 14,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 83.94949494949495,
      "bateria_fim_pct": 80.78787878787878,
      "geracao_kw": 56.22222222222222,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 74.16414141414141,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 15,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 80.78787878787878,
      "bateria_fim_pct": 77.53787878787878,
      "geracao_kw": 55.25,
      "consumo_kw": 91,
      "situacao": "NORMAL",
      "projecao_pct": 70.63131313131314,
      "acoes": [],
      "desligados": []
     },
     {
      "hora": 16,
      "tempestade": true,
      "noite": false,
      "bateria_inicio_pct": 77.53787878787878,
      "bateria_fim_pct": 76.89141414141413,
      "geracao_kw": 53.888888888888886,
      "consumo_kw": 61,
      "situacao": "NORMAL",
      "projecao_pct": 68.44949494949493,
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 68,4% em 3h (abaixo de 70% e caindo)"
      ],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 17,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 76.89141414141413,
      "bateria_fim_pct": 77.50757575757575,
      "geracao_kw": 67.77777777777777,
      "consumo_kw": 61,
      "situacao": "NORMAL",
      "projecao_pct": 71.32575757575756,
      "acoes": [],
      "desligados": [
       "Laboratório"
      ]
     },
     {
      "hora": 18,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 77.50757575757575,
      "bateria_fim_pct": 75.50757575757575,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": 69.78030303030303,
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 69,7% em 3h (abaixo de 70% e caindo)"
      ],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 19,
      "tempestade": false,
      "noite": false,
      "bateria_inicio_pct": 75.50757575757575,
      "bateria_fim_pct": 73.50757575757575,
      "geracao_kw": 25.0,
      "consumo_kw": 47,
      "situacao": "NORMAL",
      "projecao_pct": 71.32575757575756,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 20,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 73.50757575757575,
      "bateria_fim_pct": 72.41666666666666,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 70.23484848484848,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 21,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 72.41666666666666,
      "bateria_fim_pct": 71.32575757575756,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 69.14393939393939,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 22,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 71.32575757575756,
      "bateria_fim_pct": 70.23484848484848,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 68.0530303030303,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 23,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 70.23484848484848,
      "bateria_fim_pct": 69.1439393939394,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 66.96212121212122,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 0,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 69.1439393939394,
      "bateria_fim_pct": 68.0530303030303,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 65.87121212121212,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 1,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 68.0530303030303,
      "bateria_fim_pct": 66.9621212121212,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 64.78030303030302,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 2,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 66.9621212121212,
      "bateria_fim_pct": 65.87121212121212,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 63.68939393939394,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 3,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 65.87121212121212,
      "bateria_fim_pct": 64.78030303030302,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 62.59848484848484,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 4,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 64.78030303030302,
      "bateria_fim_pct": 63.68939393939394,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 61.50757575757575,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     },
     {
      "hora": 5,
      "tempestade": false,
      "noite": true,
      "bateria_inicio_pct": 63.68939393939394,
      "bateria_fim_pct": 62.59848484848484,
      "geracao_kw": 25.0,
      "consumo_kw": 37,
      "situacao": "NORMAL",
      "projecao_pct": 64.30555555555554,
      "acoes": [],
      "desligados": [
       "Logística",
       "Laboratório"
      ]
     }
    ],
    "diario": [
     {
      "hora": 8,
      "entrada": "bateria 53,0%, geração 102,8 kW, consumo 74,0 kW",
      "anomalias": [],
      "projecao_pct": 64.47474747474749,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 9,
      "entrada": "bateria 55,6%, geração 130,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 70.84848484848484,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 10,
      "entrada": "bateria 59,2%, geração 149,4 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 77.57575757575758,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 11,
      "entrada": "bateria 64,5%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 83.94949494949495,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 12,
      "entrada": "bateria 70,8%, geração 165,0 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 89.26262626262627,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 13,
      "entrada": "bateria 77,6%, geração 161,1 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 92.8080808080808,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 14,
      "entrada": "bateria 83,9%, geração 56,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 74.16414141414141,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 15,
      "entrada": "bateria 80,8%, geração 55,2 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 70.63131313131314,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 16,
      "entrada": "bateria 77,5%, geração 53,9 kW, consumo 91,0 kW",
      "anomalias": [],
      "projecao_pct": 68.44949494949493,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Laboratório — motivo: bateria projetada em 68,4% em 3h (abaixo de 70% e caindo)"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 17,
      "entrada": "bateria 76,9%, geração 67,8 kW, consumo 61,0 kW",
      "anomalias": [],
      "projecao_pct": 71.32575757575756,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 18,
      "entrada": "bateria 77,5%, geração 25,0 kW, consumo 59,0 kW",
      "anomalias": [],
      "projecao_pct": 69.78030303030303,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [
       "Desligado: Logística — motivo: bateria projetada em 69,7% em 3h (abaixo de 70% e caindo)"
      ],
      "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
     },
     {
      "hora": 19,
      "entrada": "bateria 75,5%, geração 25,0 kW, consumo 47,0 kW",
      "anomalias": [],
      "projecao_pct": 71.32575757575756,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 20,
      "entrada": "bateria 73,5%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 70.23484848484848,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 21,
      "entrada": "bateria 72,4%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 69.14393939393939,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 22,
      "entrada": "bateria 71,3%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 68.0530303030303,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 23,
      "entrada": "bateria 70,2%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 66.96212121212122,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 0,
      "entrada": "bateria 69,1%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 65.87121212121212,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 1,
      "entrada": "bateria 68,1%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 64.78030303030302,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 2,
      "entrada": "bateria 67,0%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 63.68939393939394,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 3,
      "entrada": "bateria 65,9%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 62.59848484848484,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 4,
      "entrada": "bateria 64,8%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 61.50757575757575,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     },
     {
      "hora": 5,
      "entrada": "bateria 63,7%, geração 25,0 kW, consumo 37,0 kW",
      "anomalias": [],
      "projecao_pct": 64.30555555555554,
      "regra": "nenhuma regra de alerta",
      "situacao": "NORMAL: operação padrão",
      "acoes": [],
      "observacao": ""
     }
    ],
    "resumo": {
     "bateria_20h_pct": 73.50757575757575,
     "menor_bateria_pct": 53,
     "horas_criticas": 0,
     "horas_criticas_dia": 0,
     "modulo_horas_desligados": 26,
     "modulo_horas_desligados_dia": 6,
     "desperdicio_kwh": 0,
     "reserva_para_noite": true,
     "amanhecer_pct": 62.59848484848484,
     "amanhece_acima_do_piso": true
    }
   }
  }
 },
 "simulacoes_combinacoes": {
  "9a": [
   "A",
   "manha"
  ],
  "9b": [
   "A",
   "tarde"
  ],
  "9c": [
   "B",
   "manha"
  ],
  "9d": [
   "B",
   "tarde"
  ]
 },
 "cenarios": [
  {
   "id": "1",
   "titulo": "Bateria 40%, consumo 70 kW",
   "origem": "Enunciado",
   "resultado": {
    "hora": 19,
    "bateria_pct": 40,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 1.0,
    "projecao_pct": 31.90909090909091,
    "projecao_depois_pct": 35.81818181818181,
    "geracao_kw": 25.0,
    "consumo_kw": 70,
    "consumo_depois_kw": 47,
    "balanco": "ALERTA: consumo maior que geração",
    "anomalias": [],
    "falhas": [],
    "situacao": "ALERTA",
    "mensagem": "ALERTA: reduzir consumo",
    "regra": "B: bateria < 50%",
    "acoes": [
     "Desligado: Laboratório — motivo: bateria projetada em 31,9% em 3h (abaixo de 70% e caindo)",
     "Desligado: Logística — motivo: bateria projetada em 31,9% em 3h (abaixo de 70% e caindo)",
     "ATENÇÃO: só restou o suporte à vida; reserva projetada em 35,8%"
    ],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "2",
   "titulo": "Geração 40 kW, consumo 70 kW",
   "origem": "Enunciado",
   "resultado": {
    "hora": 17,
    "bateria_pct": 85,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 0.35064935064935066,
    "projecao_pct": 73.36363636363636,
    "projecao_depois_pct": 73.36363636363636,
    "geracao_kw": 40.0,
    "consumo_kw": 70,
    "consumo_depois_kw": 70,
    "balanco": "ALERTA: consumo maior que geração",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "3",
   "titulo": "Geração 80 kW, consumo 30 kW",
   "origem": "Enunciado",
   "resultado": {
    "hora": 12,
    "bateria_pct": 90,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 0.39285714285714285,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 80.0,
    "consumo_kw": 30,
    "consumo_depois_kw": 30,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [
     "Aguardando: Logística — desligado há só 1h (mínimo de 2h)",
     "Aguardando: Laboratório — desligado há só 1h (mínimo de 2h)"
    ],
    "observacao": ""
   }
  },
  {
   "id": "4",
   "titulo": "Vento 11 m/s: quanto a eólica vai gerar?",
   "origem": "Enunciado",
   "resultado": {
    "hora": 12,
    "bateria_pct": 80,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 27.5,
    "fator_poeira": 1.0,
    "projecao_pct": 99.0959595959596,
    "projecao_depois_pct": 99.0959595959596,
    "geracao_kw": 167.5,
    "consumo_kw": 91,
    "consumo_depois_kw": 91,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "5",
   "titulo": "Bateria 40%, consumo 91 kW, previsão favorável (bateria subindo)",
   "origem": "Equipe",
   "resultado": {
    "hora": 11,
    "bateria_pct": 40,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 0.9991836734693877,
    "projecao_pct": 59.444155844155844,
    "projecao_depois_pct": 73.62597402597402,
    "geracao_kw": 161.0,
    "consumo_kw": 91,
    "consumo_depois_kw": 39,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "ECONOMIA",
    "mensagem": "MODO ECONOMIA: desligar sistemas não essenciais",
    "regra": "B·A: bateria baixa e consumo alto",
    "acoes": [
     "Desligado: Laboratório — motivo: situação MODO ECONOMIA",
     "Desligado: Logística — motivo: situação MODO ECONOMIA"
    ],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "6",
   "titulo": "Bateria 40%, consumo 91 kW, previsão desfavorável (tempestade)",
   "origem": "Equipe",
   "resultado": {
    "hora": 16,
    "bateria_pct": 40,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 50.0,
    "fator_poeira": 0.051428571428571435,
    "projecao_pct": 30.927272727272726,
    "projecao_depois_pct": 42.836363636363636,
    "geracao_kw": 54.0,
    "consumo_kw": 91,
    "consumo_depois_kw": 39,
    "balanco": "ALERTA: consumo maior que geração",
    "anomalias": [],
    "falhas": [],
    "situacao": "CRITICO",
    "mensagem": "CRÍTICO: modo emergência — só suporte à vida",
    "regra": "B·A·P: bateria baixa, consumo alto e previsão desfavorável",
    "acoes": [
     "Desligado: Laboratório — motivo: situação CRÍTICO",
     "Desligado: Logística — motivo: situação CRÍTICO",
     "ATENÇÃO: só restou o suporte à vida; reserva projetada em 42,8%"
    ],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "7",
   "titulo": "Bateria 15%: só o suporte à vida fica ligado",
   "origem": "Equipe",
   "resultado": {
    "hora": 11,
    "bateria_pct": 15,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 0.9991836734693877,
    "projecao_pct": 34.44415584415584,
    "projecao_depois_pct": 48.625974025974024,
    "geracao_kw": 161.0,
    "consumo_kw": 91,
    "consumo_depois_kw": 39,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "CRITICO",
    "mensagem": "CRÍTICO: modo emergência — só suporte à vida",
    "regra": "C: bateria < 20%",
    "acoes": [
     "Desligado: Laboratório — motivo: situação CRÍTICO",
     "Desligado: Logística — motivo: situação CRÍTICO",
     "ATENÇÃO: só restou o suporte à vida; reserva projetada em 48,6%"
    ],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "8",
   "titulo": "Bateria 85%, consumo 50 kW",
   "origem": "Equipe",
   "resultado": {
    "hora": 12,
    "bateria_pct": 85,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 1.0,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 165.0,
    "consumo_kw": 50,
    "consumo_depois_kw": 50,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "10a",
   "titulo": "Leitura inválida: bateria −5%",
   "origem": "Equipe",
   "resultado": {
    "erro": "ERRO: leitura inválida — 'bateria_pct' é negativo (-5)"
   }
  },
  {
   "id": "10b",
   "titulo": "Leitura inválida: vento \"abc\"",
   "origem": "Equipe",
   "resultado": {
    "erro": "ERRO: leitura inválida — 'vento_m_s' não é numérico (abc)"
   }
  },
  {
   "id": "11",
   "titulo": "Experimento grande no Laboratório (40 kW) num dia de sol forte",
   "origem": "Equipe",
   "resultado": {
    "hora": 12,
    "bateria_pct": 90,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 1.0,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 165.0,
    "consumo_kw": 101,
    "consumo_depois_kw": 101,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [
     {
      "modulo": "Laboratório",
      "atual": 40,
      "esperado": 30,
      "aviso": "ANOMALIA: Laboratório consumindo 40,0 kW (esperado 30,0 kW)"
     }
    ],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "12",
   "titulo": "Pico na Logística (30 kW) durante a tempestade",
   "origem": "Equipe",
   "resultado": {
    "hora": 16,
    "bateria_pct": 60,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 50.0,
    "fator_poeira": 0.051428571428571435,
    "projecao_pct": 50.2,
    "projecao_depois_pct": 62.83636363636364,
    "geracao_kw": 54.0,
    "consumo_kw": 99,
    "consumo_depois_kw": 39,
    "balanco": "ALERTA: consumo maior que geração",
    "anomalias": [
     {
      "modulo": "Logística",
      "atual": 30,
      "esperado": 22,
      "aviso": "ANOMALIA: Logística consumindo 30,0 kW (esperado 22,0 kW)"
     }
    ],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [
     "Desligado: Logística — motivo: anomalia de consumo (quem causou sai primeiro); bateria projetada em 50,2% em 3h (abaixo de 70% e caindo)",
     "Desligado: Laboratório — motivo: bateria projetada em 50,2% em 3h (abaixo de 70% e caindo)",
     "ATENÇÃO: só restou o suporte à vida; reserva projetada em 62,8%"
    ],
    "pendencias": [],
    "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
   }
  },
  {
   "id": "13",
   "titulo": "Pico no Médico (20 kW, acidente) durante a tempestade",
   "origem": "Equipe",
   "resultado": {
    "hora": 16,
    "bateria_pct": 60,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 50.0,
    "fator_poeira": 0.051428571428571435,
    "projecao_pct": 50.2,
    "projecao_depois_pct": 62.10909090909092,
    "geracao_kw": 54.0,
    "consumo_kw": 99,
    "consumo_depois_kw": 47,
    "balanco": "ALERTA: consumo maior que geração",
    "anomalias": [
     {
      "modulo": "Médico",
      "atual": 20,
      "esperado": 12,
      "aviso": "ANOMALIA: Médico consumindo 20,0 kW (esperado 12,0 kW)"
     }
    ],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [
     "Desligado: Laboratório — motivo: bateria projetada em 50,2% em 3h (abaixo de 70% e caindo)",
     "Desligado: Logística — motivo: bateria projetada em 50,2% em 3h (abaixo de 70% e caindo)",
     "ATENÇÃO: só restou o suporte à vida; reserva projetada em 62,1%"
    ],
    "pendencias": [],
    "observacao": "CORTE PREVENTIVO: a bateria está boa agora, mas a projeção de 3h pede economia"
   }
  },
  {
   "id": "14",
   "titulo": "Meio-dia em tempestade: solar medido 7 kW (curva esperava 140)",
   "origem": "Equipe",
   "resultado": {
    "hora": 12,
    "bateria_pct": 80,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 50.0,
    "fator_poeira": 0.05,
    "projecao_pct": 70.63888888888889,
    "projecao_depois_pct": 70.63888888888889,
    "geracao_kw": 57.0,
    "consumo_kw": 91,
    "consumo_depois_kw": 91,
    "balanco": "ALERTA: consumo maior que geração",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "15",
   "titulo": "Noite (21h): sem sol, o fator de poeira não divide por zero",
   "origem": "Equipe",
   "resultado": {
    "hora": 21,
    "bateria_pct": 80,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 1.0,
    "projecao_pct": 74.0,
    "projecao_depois_pct": 74.0,
    "geracao_kw": 25.0,
    "consumo_kw": 47,
    "consumo_depois_kw": 47,
    "balanco": "ALERTA: consumo maior que geração",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "16",
   "titulo": "Laboratório desligado há só 1h, energia sobrando: ainda não religa",
   "origem": "Equipe",
   "resultado": {
    "hora": 11,
    "bateria_pct": 90,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 0.9991836734693877,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 161.0,
    "consumo_kw": 61,
    "consumo_depois_kw": 61,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [
     "Aguardando: Laboratório — desligado há só 1h (mínimo de 2h)"
    ],
    "observacao": ""
   }
  },
  {
   "id": "17",
   "titulo": "Laboratório desligado há 2h, projeção com ele em 78%: zona morta, não religa",
   "origem": "Equipe",
   "resultado": {
    "hora": 12,
    "bateria_pct": 60,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 1.0,
    "projecao_pct": 86.5959595959596,
    "projecao_depois_pct": 86.5959595959596,
    "geracao_kw": 165.0,
    "consumo_kw": 61,
    "consumo_depois_kw": 61,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [
     "Aguardando: Laboratório — projeção com ele ligado em 78,4% (mínimo de 80%)"
    ],
    "observacao": ""
   }
  },
  {
   "id": "18",
   "titulo": "Colônia A em economia: religa só quem não faz voltar o MODO ECONOMIA",
   "origem": "Equipe",
   "resultado": {
    "hora": 11,
    "bateria_pct": 40,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 0.9991836734693877,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 161.0,
    "consumo_kw": 39,
    "consumo_depois_kw": 61,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "ALERTA",
    "mensagem": "ALERTA: reduzir consumo",
    "regra": "B: bateria < 50%",
    "acoes": [
     "Religado: Logística — projeção em 100,0%"
    ],
    "pendencias": [
     "Aguardando: Laboratório — voltaria à situação MODO ECONOMIA"
    ],
    "observacao": "Sem corte agora: a projeção de 100,0% não está caindo abaixo de 70%"
   }
  },
  {
   "id": "19",
   "titulo": "Laboratório desligado há 2h e energia sobrando: religa",
   "origem": "Equipe",
   "resultado": {
    "hora": 12,
    "bateria_pct": 85,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 1.0,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 165.0,
    "consumo_kw": 61,
    "consumo_depois_kw": 91,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [
     "Religado: Laboratório — projeção em 100,0%"
    ],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "20",
   "titulo": "Falha no equipamento da Logística: o sistema avisa na hora",
   "origem": "Equipe",
   "resultado": {
    "hora": 12,
    "bateria_pct": 85,
    "beta0": 0.0,
    "beta1": 2.5,
    "r2": 1.0,
    "eolica_prevista_kw": 25.0,
    "fator_poeira": 1.0,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 165.0,
    "consumo_kw": 91,
    "consumo_depois_kw": 91,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [
     {
      "modulo": "Logística",
      "aviso": "FALHA: Logística informou defeito no equipamento"
     }
    ],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  },
  {
   "id": "21",
   "titulo": "Nova medição de vento entra no histórico e refaz a reta",
   "origem": "Equipe",
   "resultado": {
    "hora": 12,
    "bateria_pct": 85,
    "beta0": 4.200000000000003,
    "beta1": 2.05,
    "r2": 0.9688760806916427,
    "eolica_prevista_kw": 32.9,
    "fator_poeira": 1.0,
    "projecao_pct": 100.0,
    "projecao_depois_pct": 100.0,
    "geracao_kw": 172,
    "consumo_kw": 91,
    "consumo_depois_kw": 91,
    "balanco": "SUGESTÃO: armazenar energia excedente",
    "anomalias": [],
    "falhas": [],
    "situacao": "NORMAL",
    "mensagem": "NORMAL: operação padrão",
    "regra": "nenhuma regra de alerta",
    "acoes": [],
    "pendencias": [],
    "observacao": ""
   }
  }
 ]
};
