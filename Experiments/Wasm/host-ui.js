import {createWasmHost,validateMatch} from './host-runtime.js?on-demand=1';
import {createRoundView} from '../../Engine/round-flow-view.js';
const startup=document.getElementById('status');startup.textContent='Preparing protected assets…';
const registration=await navigator.serviceWorker.register(new URL('./asset-worker.js?on-demand=1',import.meta.url),{type:'module',scope:new URL('./',import.meta.url).pathname,updateViaCache:'none'});
const installingWorker=registration.installing||registration.waiting;
if(installingWorker&&installingWorker.state!=='activated')await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Asset service update timed out')),60000);installingWorker.addEventListener('statechange',()=>{if(installingWorker.state==='activated'){clearTimeout(timer);resolve()}else if(installingWorker.state==='redundant'){clearTimeout(timer);reject(Error('Asset service update failed'))}})});
await navigator.serviceWorker.ready;
if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
await new Promise((resolve,reject)=>{const channel=new MessageChannel();const timer=setTimeout(()=>reject(Error('Asset service timed out')),60000);channel.port1.onmessage=event=>{clearTimeout(timer);event.data.ok?resolve():reject(Error(event.data.error))};navigator.serviceWorker.controller.postMessage({type:'palace-pack',url:new URL('./Pack/manifest.json',import.meta.url).href},[channel.port2])});
const [{createPalaceMenu},{createFightHud},{createPageBackground}]=await Promise.all([import('../../Engine/palace-menu.js'),import('../../Engine/fight-hud-runtime.js'),import('../../Engine/page-background.js')]);
createPageBackground();const hud=createFightHud();let shell,choice,currentConfig,winner=0,latest,round=0,hits=[0,0],priorHits=[0,0],koTicks=0;
let scoreRound=0,closedScores=[0,0],currentScores=[0,0];
const roundStatistics={icons:[[],[]],totals:[0,0]};
const roundView=createRoundView({isHome:()=>!shell||shell.isHome(),statistics:()=>roundStatistics,tick:()=>latest?.ticks||0,rematch:()=>{},menu:()=>shell.showHome()});
function resetRoundStatistics(){scoreRound=0;closedScores=[0,0];currentScores=[0,0];roundStatistics.icons=[[],[]];roundStatistics.totals=[0,0]}
function trackRoundStatistics(value){
 if(scoreRound&&value.round!==scoreRound)closedScores=closedScores.map((score,i)=>score+currentScores[i]);
 scoreRound=value.round;currentScores=value.fighters.map(actor=>Number(actor.score)||0);
 roundStatistics.totals=closedScores.map((score,i)=>score+currentScores[i]);
 roundStatistics.icons=(value.wins||[0,0]).map(count=>Array.from({length:Math.min(4,count)},()=>({type:'n',perfect:false})));
}
const emblemLoads=new Map();
function prepareEmblem(character){
 if(character==='SailorVenus')return hud.ready;
 if(emblemLoads.has(character))return emblemLoads.get(character);
 const task=(async()=>{
  const folder=character.replace('Sailor',''),base='./Char/'+folder+'/Battle/';
  const response=await fetch(base+folder.toLowerCase()+'_full.json');
  if(!response.ok)throw Error('Character emblem HTTP '+response.status);
  const data=await response.json(),images=[],pages=new Set();
  for(const action of [950,951,952])for(const frame of data.actions[String(action)]||[]){const sprite=data.sprites[frame.group+','+frame.item];if(sprite&&!frame.empty)pages.add(sprite.page||0)}
  await Promise.all([...pages].map(async page=>{const image=new Image();image.src=base+data.atlasFiles[page];await image.decode();images[page]=image}));
  hud.setCharacterEmblem(character,data,images);
 })();emblemLoads.set(character,task);return task;
}
const runtime=createWasmHost({onSnapshot:value=>{trackRoundStatistics(value);latest=value;if(value.round!==round){round=value.round;priorHits=[0,0];hud.reset();hud.setMode(currentConfig.timer)}if(value.totalHits)hits=[...value.totalHits];else for(let i=0;i<2;i++){const current=value.fighters[i].hits;if(current>priorHits[i])hits[i]+=current-priorHits[i];priorHits[i]=current}startup.textContent='WASM · Round '+value.round;hud.step(false,value.fighters.map(x=>x.life/x.lifeMax*1000));if(Number.isFinite(value.timer))hud.setRoundTime(value.timer);},onResult:async(w,stats)=>{winner=w;runtime.pause(true);const matches=stats?.statsLog?.matches||stats?.matches||[],last=matches.at(-1);const totals=last?.totalScore||latest?.fighters.map(x=>x.score)||[0,0];await shell.showResult(w,{koTime:(last?.matchTime||0)/60,hits,totals});},onError:error=>{startup.textContent=error.message;shell?.loading.fail(error,()=>shell.showHome())}});
shell=createPalaceMenu({pause:value=>runtime.pause(value),ready:progress=>{progress?.(1);return Promise.all([hud.ready,roundView.ready])},prepareCharacters:async players=>{choice={...choice,players};await Promise.all([...new Set(players)].map(prepareEmblem))},prepareStage:async stage=>{choice={...choice,stage}},keyConfig:()=>openKeys(),start:async(mode,timer,selected)=>{choice=selected;currentConfig=validateMatch(mode,timer,selected,shell.options.difficulty);hits=[0,0];priorHits=[0,0];koTicks=0;round=0;resetRoundStatistics();hud.setMode(timer);await runtime.start(currentConfig);shell.resultDeclarations.prepare?.(selected.players).catch(error=>console.warn('Result preparation',error));}});
window.wasmPreview={shell,runtime,snapshot:()=>latest,config:()=>currentConfig,statistics:()=>structuredClone(roundStatistics)};
document.getElementById('hud').querySelector('b').textContent='Moon Palace · WASM Preview';document.getElementById('buildid').textContent='On-demand assets v1 · native battle runtime';document.getElementById('detail').textContent='';
document.getElementById('inputMode').onchange=event=>{document.body.dataset.inputMode=event.target.value==='touch'?'touch':event.target.value==='keyboard'?'keyboard':matchMedia('(pointer:coarse)').matches?'touch':'keyboard'};
document.body.dataset.inputMode=matchMedia('(pointer:coarse)').matches?'touch':'keyboard';
const defaults={p1:{left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',x:'KeyZ',y:'KeyX',a:'KeyA',b:'KeyS',l:'KeyQ',r:'KeyW'},p2:{left:'Numpad4',right:'Numpad6',up:'Numpad8',down:'Numpad5',x:'Numpad0',y:'NumpadDecimal',a:'Numpad1',b:'Numpad2',l:'NumpadDivide',r:'NumpadMultiply'}};
let bindings=structuredClone(defaults);try{const saved=JSON.parse(localStorage.getItem('palace-keyboard-bindings-v1'));if(saved&&Object.values(defaults).every((row,i)=>Object.keys(row).every(k=>typeof saved['p'+(i+1)]?.[k]==='string')))bindings=saved}catch{}
function openKeys(){const dialog=document.createElement('dialog');dialog.style.cssText='background:#21192e;color:white;border:1px solid #ff3ea7;border-radius:16px';const title=document.createElement('h2');title.textContent='Key Config';dialog.append(title);const draft=structuredClone(bindings);for(const player of ['p1','p2'])for(const action of Object.keys(defaults[player])){const label=document.createElement('label');label.style.cssText='display:block';const input=document.createElement('input');input.value=draft[player][action];input.onkeydown=event=>{event.preventDefault();draft[player][action]=event.code;input.value=event.code};label.append(player.toUpperCase()+' '+action.toUpperCase()+' ',input);dialog.append(label)}const save=document.createElement('button');save.textContent='Save';save.onclick=()=>{bindings=draft;localStorage.setItem('palace-keyboard-bindings-v1',JSON.stringify(bindings));dialog.close();dialog.remove()};dialog.append(save);document.body.append(dialog);dialog.showModal()}
document.addEventListener('keydown',event=>{if(shell.isHome()||event.target.closest('input,select,dialog'))return;if(event.code==='Escape'){event.preventDefault();runtime.release();shell.showHome();return}for(const player of ['p1','p2'])for(const[action,code]of Object.entries(bindings[player]))if(event.code===code){event.preventDefault();runtime.input(defaults[player][action],true,event.key)}},true);
document.addEventListener('keyup',event=>{for(const player of ['p1','p2'])for(const[action,code]of Object.entries(bindings[player]))if(event.code===code)runtime.input(defaults[player][action],false,event.key)},true);
const stick=document.getElementById('stick'),knob=document.getElementById('stickKnob');let owner=null,active=new Set();
function stickState(x,y){const r=stick.getBoundingClientRect(),maximum=r.width*.34;let dx=x-r.left-r.width/2,dy=y-r.top-r.height/2;const magnitude=Math.hypot(dx,dy);if(magnitude>maximum){dx*=maximum/magnitude;dy*=maximum/magnitude}knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;const on=Math.hypot(dx,dy)/maximum>.28,vertical=Math.abs(dy)>Math.abs(dx)*.57735026919,neutral=Math.abs(dx)<=Math.abs(dy)*.26794919243;const next=new Set();if(on&&vertical)next.add(dy<0?'ArrowUp':'ArrowDown');if(on&&!neutral)next.add(dx<0?'ArrowLeft':'ArrowRight');for(const code of active)if(!next.has(code))runtime.input(code,false);for(const code of next)if(!active.has(code))runtime.input(code,true);active=next}
function clearStick(){for(const code of active)runtime.input(code,false);active.clear();owner=null;knob.style.transform='translate(-50%,-50%)'}
stick.onpointerdown=event=>{if(owner!==null||shell.isHome())return;event.preventDefault();owner=event.pointerId;stick.setPointerCapture(event.pointerId);stickState(event.clientX,event.clientY)};stick.onpointermove=event=>{if(event.pointerId===owner){event.preventDefault();stickState(event.clientX,event.clientY)}};for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,event=>{if(event.pointerId===owner)clearStick()});
const touchOwners=new Map();for(const button of document.querySelectorAll('.touchButton')){const pointers=new Set(),code=defaults.p1[button.dataset.action];touchOwners.set(button,pointers);button.onpointerdown=event=>{if(shell.isHome())return;event.preventDefault();pointers.add(event.pointerId);button.setPointerCapture(event.pointerId);runtime.input(code,true);button.classList.add('pressed')};for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,event=>{if(pointers.delete(event.pointerId)&&!pointers.size){runtime.input(code,false);button.classList.remove('pressed')}});button.oncontextmenu=event=>event.preventDefault()}
function clearTouch(){clearStick();for(const[button,pointers]of touchOwners){pointers.clear();button.classList.remove('pressed')}runtime.release()};addEventListener('blur',clearTouch);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTouch()});
const debug=document.createElement('div'),target=document.createElement('select');for(const text of ['RANDOM','P1','P2']){const option=document.createElement('option');option.textContent=text;target.append(option)}const kill=document.createElement('button');kill.textContent='KILL PLAYER';kill.onclick=()=>runtime.kill(target.selectedIndex||Math.random()<.5?target.selectedIndex||1:2);const one=document.createElement('button');one.textContent='ALL 1HP';one.onclick=()=>runtime.all1hp();for(const button of [kill,one])button.style.cssText='font-size:11px;padding:3px 6px;border-radius:4px';debug.append(kill,target,one);document.getElementById('inputPanel').append(debug);
function render(){roundView.render(latest&&!shell.isHome()?{mode:currentConfig.mode}:null);if(latest&&!shell.isHome()){const actors=latest.fighters.map((value,i)=>({...value,character:currentConfig.players[i],lifebarName:currentConfig.players[i].replace(/([a-z])([A-Z])/g,'$1 $2')}));hud.render(...actors,{showTimeOver:false})}else{for(const id of ['fightHud','portraitBackdrop'])document.getElementById(id)?.getContext('2d').clearRect(0,0,innerWidth*devicePixelRatio,innerHeight*devicePixelRatio)}requestAnimationFrame(render)}requestAnimationFrame(render);
startup.textContent='WASM preview ready';
document.getElementById('dbgPlay').onclick=()=>runtime.pause(false,false);
document.getElementById('dbgPause').onclick=()=>runtime.pause(true,false);
document.getElementById('dbgBoxes').hidden=true;
document.getElementById('dbgTrace').onclick=()=>{
 const url=URL.createObjectURL(new Blob([JSON.stringify({config:currentConfig,snapshot:latest},null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='moon-palace-wasm-state.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
document.getElementById('p2Punch').onclick=()=>{runtime.input('Numpad0',true);setTimeout(()=>runtime.input('Numpad0',false),100)};
let guardKeys=new Set();
function clearGuard(){for(const code of guardKeys)runtime.input(code,false);guardKeys.clear()}
setInterval(()=>{
 const next=new Set(),guard=document.getElementById('p2Guard').value;
 if(!document.hidden&&!shell.isHome()&&latest?.roundState===2&&currentConfig?.mode!=='watch'&&document.getElementById('p2Control').value==='dummy'&&guard!=='none'){
  next.add(latest.fighters[1].facing<0?'Numpad6':'Numpad4');if(guard==='crouch')next.add('Numpad5');
 }
 for(const code of guardKeys)if(!next.has(code))runtime.input(code,false);
 for(const code of next)if(!guardKeys.has(code))runtime.input(code,true);
 guardKeys=next;
},100);
addEventListener('blur',clearGuard);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearGuard()});
