// Haptics are optional hardware feedback; absence must not affect simulation.
export function sourceFeedback(params,evaluate,player=1){
 const ticks=Math.max(0,evaluate(params.time??'60')),duration=Math.min(5000,ticks*1000/60);
 const amplitude=String(params.ampl??'128').split(',')[0],strength=Math.max(0,Math.min(1,evaluate(amplitude)/255));
 if(!duration||!strength)return;
 try{
  const pads=globalThis.navigator?.getGamepads?.()||[],target=params.self!==undefined&&evaluate(params.self)?player:3-player,motor=pads[target-1]?.vibrationActuator;let rumble=false;
  const waveform=String(params.waveform??'sine').toLowerCase(),strongMagnitude=waveform==='square'||waveform==='off'?0:strength,weakMagnitude=waveform==='sine'||waveform==='off'?0:strength;
  if(motor?.playEffect){rumble=true;Promise.resolve(motor.playEffect('dual-rumble',{duration,strongMagnitude,weakMagnitude})).catch(()=>{})}
  if(!rumble)globalThis.navigator?.vibrate?.(duration);
 }catch{/* Unavailable devices and permission restrictions are non-fatal. */}
}
