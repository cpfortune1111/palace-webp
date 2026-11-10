export const LP0=[...([4,4,4,4,4,6,4,4,4,4,4,4,4,5,4,4,4,5,4,4,4,5,4,4,4,5,4,4,4,4,4,3,3].map((d,i)=>[i,d])),[33,5],[34,3],[35,3],[36,4],[37,4],[38,3],[39,2],[40,2],[41,4],[34,2],[35,2],[36,3],[37,4],[38,3],[39,2],[40,2],[41,4],[42,3],[43,2],[44,2],[45,2],[46,2],[-1,6]];
export const LP1=Array.from({length:14},(_,i)=>[47+i,i===0?2:i===1?3:4]);
export const K01=Array.from({length:11},(_,i)=>[i,i===0||i===10?30:3]);
export const duration=frames=>frames.reduce((n,f)=>n+f[1],0);
export const CONTINUE_TIMING={lp1:duration(LP0),smoke:duration(LP0)+37,key:duration(LP0)+duration(LP1),glow:duration(LP0)+37+46,ui:duration(LP0)+37+56,choice:duration(LP0)+37+71};
export function sequenceFrame(frames,t){if(t<0)return -1;for(const [f,d]of frames){if(t<d)return f;t-=d}return -1}
export function createContinueFlow(api={}){
 let phase='idle',age=0,tick=0,selected='yes',locked=false,events=new Set();
 const emit=(key,sound,volume=1)=>{if(events.has(key))return;events.add(key);api.sound?.(sound,volume)};
 let elapsed=0;const cues=[{t:4,n:'LP01'}];for(let i=0;i<LP0.length;i++){if([33,41].includes(LP0[i][0]))cues.push({t:elapsed,n:'CMoon090010'});elapsed+=LP0[i][1]}
 cues.push({t:CONTINUE_TIMING.lp1,n:'LP00'},{t:CONTINUE_TIMING.smoke+3,n:'CMoon090011'},{t:CONTINUE_TIMING.glow,n:'K00',v:10**(-10/20)});
 function begin(){phase='cinematic';age=tick=0;selected='yes';locked=false;events.clear()}
 function switchTo(value){if(phase!=='choice'||locked||value===selected)return false;selected=value;api.navigate?.();return true}
 function confirm(){if(phase!=='choice'||locked)return false;locked=true;phase=selected;age=0;api.sound?.(selected==='yes'?'K01':'back',1);if(selected==='yes')api.yes?.();return true}
 function step(){if(phase==='idle'||phase==='done')return;tick++;age++;if(phase==='cinematic'){for(const [i,c]of cues.entries())if(tick>=c.t)emit('cue'+i,c.n,c.v??1);if(tick>=CONTINUE_TIMING.choice){phase='choice';age=0}}else if(phase==='choice'&&age>=600)confirm();else if(phase==='yes'&&age>=261){phase='declaration';age=0;api.declaration?.()}else if(phase==='no'&&age>=duration(K01)){phase='gameover';age=0;api.releaseStage?.()}else if(phase==='gameover'&&age>=225){phase='done';api.logo?.()}}
 return {begin,step,switchTo,confirm,tap(value){if(phase!=='choice')return false;return value===selected?confirm():switchTo(value)},reset(){phase='idle';events.clear()},snapshot:()=>({phase,age,tick,selected,locked,countdown:phase==='choice'?10-Math.floor(age/60):null,uiOpacity:phase==='cinematic'?Math.max(0,Math.min(1,(tick-CONTINUE_TIMING.ui)/15)):['yes','no'].includes(phase)?Math.max(0,1-age/30):phase==='choice'?1:0,highlight:phase==='choice'?(Math.floor(age/2)%2?.6:1):1})};
}
