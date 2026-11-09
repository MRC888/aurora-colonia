/*
 * AURORA SIGER — CENTRO DE OPERAÇÕES DA COLÔNIA
 * Interface didática. NENHUMA decisão operacional é calculada aqui.
 * Os valores oficiais vêm de dados.js, exportado por painel.py (Python).
 * JavaScript só escolhe registros, desenha a cena/gráficos e controla o tempo.
 */
'use strict';

const $ = id => document.getElementById(id);
const DOM = {
  stage:$('stage'), canvas:$('colony-canvas'), scenario:$('scenario'),mode:$('control-mode'),
  timeline:$('timeline'),speed:$('speed'),play:$('play'),next:$('next'),restart:$('restart'),
};
const CONTEXT = DOM.canvas.getContext('2d');
const MODULES = [
  {name:'Energia',abbr:'EN',x:146,y:312,essential:true},
  {name:'Habitação',abbr:'HB',x:348,y:270,essential:true},
  {name:'Médico',abbr:'MD',x:520,y:283,essential:true},
  {name:'Logística',abbr:'LG',x:710,y:317,essential:false},
  {name:'Laboratório',abbr:'LB',x:844,y:301,essential:false},
];
const state={scenario:'9b',mode:'preditivo',index:0,playing:false,speed:1,accum:0,last:0,read:false};
let particles=[];
const COLORS={cyan:'#46f0ff',pink:'#ff3d7f',green:'#3dffa8',orange:'#ff8a3d'};

function getOfficial(){
  try {return typeof DADOS!=='undefined'&&DADOS.simulacoes ? DADOS : null}
  catch {return null}
}
const OFFICIAL=getOfficial();
function currentComparison(){return OFFICIAL.simulacoes[state.scenario]}
function currentSimulation(){return currentComparison()[state.mode]}
function currentRow(){return currentSimulation().linhas[state.index]}
function one(n,d=1){return typeof n==='number' && Number.isFinite(n) ? n.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}) : '—'}
function pct(n){return one(n)+'%'}
function clock(h){return String(h).padStart(2,'0')+':00'}
function setText(id,value){$(id).textContent=value}
function showError(msg){const el=$('error-banner');el.hidden=false;el.textContent=msg}
function statusName(s){return s==='ECONOMIA'?'MODO ECONOMIA':s==='CRITICO'?'CRÍTICO':s}
function statusClass(s){if(s==='CRITICO')return 'critical';if(s==='ECONOMIA')return 'economy';if(s==='ALERTA')return 'alert';return ''}
function stop(){state.playing=false;state.accum=0;DOM.play.textContent='▶';DOM.play.setAttribute('aria-label','Reproduzir')}
function reset(){stop();state.index=0;render()}
function step(){stop();state.index=Math.min(currentSimulation().linhas.length-1,state.index+1);render()}
function resize(){
  // O tablet usa CSS responsivo. Não escalamos o HTML com transform;
  // isso mantém textos legíveis e os controles clicáveis nos dois formatos.
}
function toggleReading(active){
  state.read=Boolean(active);
  document.body.classList.toggle('reading',state.read);
  const control=$('read-toggle');
  control.setAttribute('aria-pressed',String(state.read));
  control.textContent=state.read?'▱ TABLET HORIZONTAL':'▯ MODO LEITURA · VERTICAL';
  render();
}
function fillLevel(id,val,max){$(id).style.width=Math.max(0,Math.min(100,(val/max)*100))+'%'}
function summarizeActions(row,log){
  // Regra e observação vêm do diário exportado pelo Python (mesma hora).
  const why=[];
  if(log&&log.regra&&log.regra!=='nenhuma regra de alerta')why.push('REGRA · '+log.regra);
  if(log&&log.observacao)why.push(log.observacao);
  if(row.acoes.length){
    return row.acoes.map(x=>x.replace(' — motivo:','\n  ')).concat(why).join('\n')
  }
  const head=row.tempestade?'TEMPESTADE ATIVA':row.noite?'OPERAÇÃO NOTURNA':'MONITORAMENTO ATIVO';
  return [head,statusName(row.situacao)].concat(why).join('\n');
}
function changeRows(){
  const row=currentRow(),sim=currentSimulation(),comparison=currentComparison(),colony=OFFICIAL.colonias[sim.colonia];
  const disabled=new Set(row.desligados);
  const hour=clock(row.hora);
  setText('colony-tag','COLÔNIA '+sim.colonia);
  setText('battery-value',pct(row.bateria_inicio_pct));
  setText('battery-end','FIM DA HORA · '+pct(row.bateria_fim_pct));
  fillLevel('battery-fill',row.bateria_inicio_pct,100);
  $('battery-floor').style.left=colony.piso_pct+'%';
  setText('battery-floor-label','PISO '+colony.piso_pct+'%');
  setText('clock-small',hour);
  setText('time-label',hour+(row.hora<8?' +1D':''));
  setText('generation',one(row.geracao_kw));
  setText('consumption',one(row.consumo_kw));
  fillLevel('generation-bar',row.geracao_kw,165);
  fillLevel('consumption-bar',row.consumo_kw,165);
  setText('balance-message',row.balanco);
  setText('state-name',statusName(row.situacao));
  $('state-name').className=statusClass(row.situacao);
  setText('projection-value',state.mode==='preditivo'?pct(row.projecao_pct):'—');
  $('projection-value').style.color=(state.mode==='preditivo'&&row.projecao_pct<70)?'var(--orange)':'';
  $('projection-value').title='Projeção de bateria em 3h calculada a partir do início da hora, antes dos cortes.';
  setText('wind-value',row.vento_m_s+' m/s');
  setText('mode-short',state.mode==='preditivo'?'PREV':'REAT');
  const action=row.acoes.find(x=>x.startsWith('Desligado:')||x.startsWith('Religado:'));
  setText('decision-text',action?action.split(' — ')[0].toUpperCase():(row.tempestade?'TEMPESTADE DE POEIRA':row.noite?'NOITE MARCIANA':'MONITORAMENTO'));
  setText('terminal-output',summarizeActions(row,sim.diario[state.index]));
  setText('scene-weather',row.tempestade?'● TEMPESTADE DE POEIRA':row.noite?'◉ OPERAÇÃO NOTURNA':'◉ CÉU LIMPO');
  setText('scene-caption',`SOL ${row.hora<8?'02':'01'} · ${hour} · ${state.mode.toUpperCase()}`);
  document.querySelectorAll('.module-row').forEach((el,i)=>{
    const off=disabled.has(MODULES[i].name);el.classList.toggle('off',off);
    el.title=MODULES[i].name+' — '+(off?'desligado':'ligado')+(MODULES[i].essential?' (essencial)':'');
    const stateLabel=el.querySelector('.module-state');
    if(stateLabel)stateLabel.textContent=off?'DESLIGADO':'ATIVO';
  });
  setText('reactive-end',pct(comparison.reativo.resumo.amanhecer_pct));
  setText('predictive-end',pct(comparison.preditivo.resumo.amanhecer_pct));
  setText('critical-count','HORAS CRÍTICAS · REAT. / PRED.: '+comparison.reativo.resumo.horas_criticas+' / '+comparison.preditivo.resumo.horas_criticas);
  setText('shutdown-count','MÓDULO-HORAS · REAT. / PRED.: '+comparison.reativo.resumo.modulo_horas_desligados+' / '+comparison.preditivo.resumo.modulo_horas_desligados);
  const t=OFFICIAL.tempestades[sim.tempestade];
  setText('storm-label',t?'TEMPESTADE '+clock(t.inicio)+'–'+clock(t.inicio+3):'SEM TEMPESTADE');
  DOM.timeline.max=sim.linhas.length-1;
  DOM.timeline.value=state.index;
  $('timeline-start').textContent='08H';$('timeline-end').textContent='06H';
  drawBatteryChart(comparison,state.index);
  document.body.dataset.hora=hour;
  document.body.dataset.simulacao=state.scenario;
  document.body.dataset.modo=state.mode;
  document.body.dataset.modulosDesligados=Array.from(disabled).join(',');
}

function makeSVG(tag,attrs={}){const node=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));return node}
function drawBatteryChart(pair,selected){
  const svg=$('battery-chart');svg.replaceChildren();
  const W=360,H=106,left=16,right=353,top=6,bottom=94;
  const x=i=>left+(right-left)*i/pair.reativo.linhas.length;
  const y=p=>bottom-(p/100)*(bottom-top);
  for(const p of [20,50,70])svg.appendChild(makeSVG('line',{x1:left,y1:y(p),x2:right,y2:y(p),stroke:'#6a8e9c','stroke-opacity':'.32','stroke-dasharray':'3 5','stroke-width':'.7'}));
  const defs=[['reativo',COLORS.pink],['preditivo',COLORS.cyan]];
  for(const [key,color] of defs){
    const rows=pair[key].linhas;
    const vals=rows.map(r=>r.bateria_inicio_pct).concat(rows[rows.length-1].bateria_fim_pct);
    const points=vals.map((v,i)=>`${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
    svg.appendChild(makeSVG('polyline',{points,fill:'none',stroke:color,'stroke-width':key===state.mode?2.9:1.6,'stroke-linejoin':'round','stroke-linecap':'round','stroke-opacity':key===state.mode?'1':'.65'}));
    svg.appendChild(makeSVG('circle',{cx:x(selected),cy:y(vals[selected]),r:key===state.mode?4.1:2.9,fill:color,stroke:'#00131a','stroke-width':'1'}));
  }
  svg.appendChild(makeSVG('line',{x1:x(selected),y1:top,x2:x(selected),y2:bottom,stroke:'#e5faff','stroke-opacity':'.5','stroke-dasharray':'2 3','stroke-width':'1'}));
  svg.appendChild(makeSVG('text',{x:'1',y:'11',fill:'#92bbc7','font-size':'10'})).textContent='100';
  svg.appendChild(makeSVG('text',{x:'7',y:'97',fill:'#92bbc7','font-size':'10'})).textContent='0';
}
function render(){if(!OFFICIAL)return;changeRows();paint(performance.now()/1000)}
function startAnimation(){if(state.playing)return;if(state.index>=currentSimulation().linhas.length-1)state.index=0;state.playing=true;DOM.play.textContent='❚❚';DOM.play.setAttribute('aria-label','Pausar')}
function tick(t){
  if(state.playing){
    if(state.last){state.accum+=Math.min((t-state.last)/1000,0.20)*state.speed}
    if(state.accum>=1.5){const hops=Math.floor(state.accum/1.5);state.accum-=hops*1.5;state.index=Math.min(currentSimulation().linhas.length-1,state.index+hops);render();if(state.index>=currentSimulation().linhas.length-1)stop()}
  }
  state.last=t;
  if(OFFICIAL)paint(t/1000);
  requestAnimationFrame(tick);
}

/*
 * A cena em Canvas representa a infraestrutura física, não é mapa real.
 * Movimento e luminosidade são elementos VISUAIS. Estado ligado/desligado,
 * geração, consumo, bateria e tempestade vêm das leituras do Python.
 */
function polygon(ctx,points,fill,stroke=null,width=1){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function dome(ctx,x,y,r,on,color){
  ctx.save();
  ctx.shadowColor=on?color:'#ff3d7f';ctx.shadowBlur=on?14:5;
  const grad=ctx.createLinearGradient(x-r,y-r,x+r,y);
  grad.addColorStop(0,on?'#577989':'#55363d');grad.addColorStop(.55,on?'#1b4656':'#3a2b33');grad.addColorStop(1,'#0d1b2a');
  ctx.beginPath();ctx.ellipse(x,y,r,r*.70,0,Math.PI,2*Math.PI);ctx.lineTo(x+r,y);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  ctx.strokeStyle=on?color:'#cf5677';ctx.lineWidth=2.6;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();ctx.moveTo(x-r*.72,y-r*.35);ctx.quadraticCurveTo(x,y-r*.70,x+r*.72,y-r*.35);ctx.strokeStyle='#a2b6c366';ctx.lineWidth=1;ctx.stroke();
  for(const j of [-1,0,1]){const px=x+j*r*.40;ctx.fillStyle=on?'#7ffff2':'#ff547b';ctx.fillRect(px-5,y-8,10,7)}
  ctx.fillStyle='#081723';ctx.fillRect(x-r-8,y-1,2*r+16,7);ctx.fillStyle=on?'#54f8c8':'#92405b';ctx.fillRect(x-r+2,y+1,2*r-4,2);
  ctx.restore();
}
function drawSolar(ctx,t,active){
  const x=75,y=330;ctx.save();ctx.translate(x,y);
  for(let k=0;k<3;k++){
    const xx=k*44;
    polygon(ctx,[[xx,0],[xx+32,-8],[xx+44,4],[xx+10,13]],active?'#173c52':'#392d3e','#6bcbde',1.5);
    ctx.strokeStyle='#56b4d5aa';ctx.beginPath();ctx.moveTo(xx+14,-3);ctx.lineTo(xx+23,9);ctx.moveTo(xx+30,-6);ctx.lineTo(xx+39,6);ctx.moveTo(xx+5,4);ctx.lineTo(xx+37,-2);ctx.stroke();
    ctx.strokeStyle='#5b7684';ctx.beginPath();ctx.moveTo(xx+25,11);ctx.lineTo(xx+25,21);ctx.stroke();
  }
  ctx.restore();
}
function drawTurbine(ctx,t,active){
  ctx.save();const x=901,y=258;ctx.strokeStyle='#b7d4dc';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+96);ctx.stroke();
  ctx.translate(x,y);ctx.rotate(active?t*1.8:0);
  for(let i=0;i<3;i++){ctx.rotate(Math.PI*2/3);polygon(ctx,[[0,0],[7,-11],[3,-75],[-7,-67]],'#9bc1ce','#d4eaf3',1.2)}
  ctx.fillStyle='#46f0ff';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();
}
function resetParticles(){particles=Array.from({length:60},(_,i)=>({x:(i*67)%980,y:(i*83)%410,phase:i*11,size:1+i%3}))}
function paint(t){
  if(!OFFICIAL||!CONTEXT)return;
  const c=CONTEXT,W=DOM.canvas.width,H=DOM.canvas.height;
  const row=currentRow();const disabled=new Set(row.desligados);const h=row.hora;
  const day=h>=6&&h<18;const dust=row.tempestade;
  const g=c.createLinearGradient(0,0,0,H);
  if(day){g.addColorStop(0,dust?'#5b2025':'#44293c');g.addColorStop(.55,dust?'#92391b':'#dc7148');g.addColorStop(1,dust?'#b55329':'#d89167')}
  else{g.addColorStop(0,'#0a1326');g.addColorStop(.62,'#30243c');g.addColorStop(1,'#6d3b46')}
  c.fillStyle=g;c.fillRect(0,0,W,H);
  if(!day){c.fillStyle='#e1f0ff';for(let i=0;i<46;i++){const sx=(i*237)%W,sy=(i*71)%215;c.globalAlpha=.25+.4*Math.sin(i+t*.3)**2;c.fillRect(sx,sy,1.3,1.3)}c.globalAlpha=1}
  if(day){const sg=c.createRadialGradient(670,100,5,670,100,98);sg.addColorStop(0,'#ffeab88a');sg.addColorStop(.28,'#ffca9570');sg.addColorStop(1,'#ffd3ad00');c.fillStyle=sg;c.fillRect(570,10,200,200);c.fillStyle=dust?'#e69f76':'#ffd5a7';c.beginPath();c.arc(670,100,25,0,Math.PI*2);c.fill()}
  polygon(c,[[0,245],[105,224],[195,234],[310,202],[420,230],[590,197],[710,228],[830,190],[980,220],[980,H],[0,H]],day?'#aa563f':'#563349');
  polygon(c,[[0,315],[180,278],[345,310],[510,263],[690,292],[852,267],[980,309],[980,H],[0,H]],day?'#854137':'#442b42');
  polygon(c,[[0,380],[195,339],[410,352],[630,338],[820,356],[980,342],[980,H],[0,H]],day?'#7a3b32':'#382735');
  const floor=c.createLinearGradient(0,344,0,H);floor.addColorStop(0,day?'#954b3e':'#563543');floor.addColorStop(1,'#251925');c.fillStyle=floor;c.fillRect(0,370,W,102);
  // Núcleo de distribuição / cabos de energia entre instalações.
  c.strokeStyle='#54d4ee88';c.lineWidth=2;c.setLineDash([4,5]);c.beginPath();c.moveTo(145,339);for(const m of MODULES)c.lineTo(m.x,m.y+8);c.stroke();c.setLineDash([]);
  drawSolar(c,t,true);drawTurbine(c,t,true);
  const sizes=[41,56,45,40,45];
  MODULES.forEach((m,i)=>{
    const on=!disabled.has(m.name);
    dome(c,m.x,m.y,sizes[i],on,on?(m.essential?COLORS.green:COLORS.cyan):COLORS.pink);
    c.font='700 14px ui-monospace,Menlo,monospace';c.textAlign='center';c.fillStyle=on?'#dffcff':'#ffabc2';c.shadowColor='#000';c.shadowBlur=5;
    c.fillText(m.abbr,m.x,m.y-53-(sizes[i]-40)*.65);c.shadowBlur=0;
    if(m.essential){c.fillStyle='#a3ffc8';c.font='12px ui-monospace,Menlo,monospace';c.fillText('◆',m.x+22,m.y-35)}
    if(!on){c.fillStyle='#ff3d7faa';c.font='11px ui-monospace,Menlo,monospace';c.fillText('OFF',m.x,m.y+24)}
  });
  // Vento e poeira se movem no cenário, sem alterar qualquer dado operacional.
  if(dust){
    c.fillStyle='#be623328';c.fillRect(0,0,W,H);
    particles.forEach(p=>{
      const x=(p.x+t*(36+p.size*11))%W;
      c.beginPath();c.ellipse(x,p.y,4*p.size,1.1*p.size,-.22,0,Math.PI*2);
      c.fillStyle='rgba(255,185,124,.3)';c.fill();
    });
    c.fillStyle='#ffac7040';c.fillRect(0,390,W,42);
  } else{
    particles.forEach((p,i)=>{if(i%3===0){const x=(p.x+t*4)%W;c.fillStyle='rgba(255,212,170,.14)';c.fillRect(x,p.y+80,1,1)}});
  }
  const vignette=c.createRadialGradient(W/2,H/2,150,W/2,H/2,560);vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,'#0000009a');c.fillStyle=vignette;c.fillRect(0,0,W,H);
}
function attach(){
  if(!OFFICIAL){showError('Não encontrei dados.js. Mantenha index.html, styles.css, app.js e dados.js na mesma pasta painel.');return}
  resetParticles();
  DOM.scenario.addEventListener('change',()=>{state.scenario=DOM.scenario.value;reset()});
  DOM.mode.addEventListener('change',()=>{state.mode=DOM.mode.value;stop();render()});
  DOM.speed.addEventListener('change',()=>{state.speed=Number(DOM.speed.value)||1});
  DOM.restart.addEventListener('click',reset);DOM.next.addEventListener('click',step);
  DOM.play.addEventListener('click',()=>{if(state.playing)stop();else startAnimation()});
  DOM.timeline.addEventListener('input',()=>{stop();state.index=Number(DOM.timeline.value);render()});
  $('read-toggle').addEventListener('click',()=>toggleReading(!state.read));
  window.addEventListener('resize',()=>{if(!state.read&&window.innerWidth<730)toggleReading(true);else resize()});
  document.addEventListener('keydown',ev=>{if(['SELECT','INPUT','BUTTON'].includes(ev.target.tagName))return;if(ev.key===' '){ev.preventDefault();state.playing?stop():startAnimation()}if(ev.key==='ArrowRight')step()});
  const url=new URLSearchParams(window.location.search);
  const requested=url.get('cenario');if(requested&&OFFICIAL.simulacoes[requested])state.scenario=requested;
  const m=url.get('modo');if(m==='reativo'||m==='preditivo')state.mode=m;
  DOM.scenario.value=state.scenario;DOM.mode.value=state.mode;
  const idx=Number(url.get('hora'));if(Number.isInteger(idx)&&idx>=0&&idx<currentSimulation().linhas.length)state.index=idx;
  if(window.innerWidth<730)toggleReading(true);
  else {resize();render()}
  document.body.dataset.pronto='true';
  requestAnimationFrame(tick);
}
window.addEventListener('error',e=>{document.body.dataset.erro=e.message});
attach();

