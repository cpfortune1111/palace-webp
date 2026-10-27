const players=['SailorVenus','SailorMoon','SailorJupiter','SailorNeptune','SailorSaturn'];
export function validateMatch(mode,timer,choice,difficulty=4){
 if(!['arcade','vs','training','watch'].includes(mode))throw Error('Invalid game mode');
 if(!choice||choice.players?.length!==2||choice.players.some(x=>!players.includes(x)))throw Error('Invalid character selection');
 if(choice.stage!==undefined&&!['training','moon'].includes(choice.stage))throw Error('Invalid stage selection');
 const hardware=choice.hardware||['snes','snes'],command=choice.command||['normal','normal'];
 if(hardware.length!==2||hardware.some(x=>!['snes','saturn'].includes(x)))throw Error('Unsupported hardware selection');
 if(command.length!==2||command.some(x=>!['normal','auto'].includes(x)))throw Error('Invalid command mode');
 const acs=mode==='training'?[Array(6).fill(0),Array(6).fill(0)]:(choice.acs||[Array(6).fill(0),Array(6).fill(0)]);
 if(acs.length!==2||acs.some(row=>row.length!==6||row.some(x=>!Number.isInteger(x)||x<0||x>5)||row.reduce((n,v)=>n+v,0)>(mode==='arcade'?10:15)))throw Error('Invalid ACS allocation');
 if(timer!=='infinite'&&(!/^\d+$/.test(String(timer))||Number(timer)<15||Number(timer)>99))throw Error('Invalid round timer');
 return {mode,timer:String(timer),players:[...choice.players],hardware:[...hardware],command:[...command],acs:acs.map(x=>[...x]),difficulty:Math.max(1,Math.min(8,Math.round(difficulty))),stage:choice.stage||'training'};
}
export function createWasmHost({container=document.body,onSnapshot=()=>{},onResult=()=>{},onError=()=>{},pack='./Pack/manifest.json'}={}){
 let frame,session,winner=0,lastSnapshot,settle,rejectStart,timeout;
 const held=new Map();
 function send(kind,value={}){frame?.contentWindow?.postMessage({palaceWasm:1,token:session,kind,...value},location.origin)}
 function stop(){clearTimeout(timeout);release();frame?.remove();frame=null;if(rejectStart)rejectStart(Error('Battle start cancelled'));settle=rejectStart=null}
 function release(){for(const[code,key]of held)send('input',{code,key,down:false});held.clear()}
 function input(code,down,key=code){if(down){if(held.has(code))return;held.set(code,key)}else held.delete(code);send('input',{code,key,down})}
 addEventListener('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden)release()});
 addEventListener('message',event=>{
  if(!frame||event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.token!==session)return;
  const {kind,value}=event.data;
  if(kind==='snapshot'){lastSnapshot=value;onSnapshot(value);if(settle){clearTimeout(timeout);settle();settle=rejectStart=null}}
  if(kind==='winner')winner=Number(value);
  if(kind==='matchEnded'){const result=lastSnapshot;stop();Promise.resolve(onResult(winner,value,result)).catch(onError)}
  if(kind==='error'||kind==='exit'&&value!==0){const error=Error('Battle engine: '+String(value));clearTimeout(timeout);rejectStart?.(error);settle=rejectStart=null;onError(error)}
 });
 async function start(config){stop();session=crypto.randomUUID();winner=0;lastSnapshot=null;frame=document.createElement('iframe');frame.title='Moon Palace battle';frame.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:1;pointer-events:none';frame.src=new URL('./host-frame.html',import.meta.url);container.appendChild(frame);
  return new Promise((resolve,reject)=>{settle=resolve;rejectStart=reject;timeout=setTimeout(()=>{rejectStart?.(Error('Battle loading timed out'));settle=rejectStart=null},180000);frame.onload=()=>send('start',{config,pack})})
 }
 return {start,stop,input,release,pause:(value,hide=true)=>{if(value)release();if(frame)frame.style.visibility=value&&hide?'hidden':'visible';send('control',{control:{paused:!!value}})},kill:player=>send('control',{control:{kill:player}}),all1hp:()=>send('control',{control:{all1hp:true}}),snapshot:()=>lastSnapshot};
}
