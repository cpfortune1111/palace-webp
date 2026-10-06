export function createMenuEntrance(parent,{loading,onFrame,ready,progress,show}){
 const white=document.createElement('div');white.id='selectionWhiteTransition';white.style.cssText='position:absolute;inset:0;z-index:80;background:white;pointer-events:none;display:none';parent.appendChild(white);let active=false,serial=0;
 function frames(duration,callback,token){return new Promise(resolve=>{let last,age=0;function animate(time){if(token!==serial){resolve(false);return}if(last!==undefined)age+=Math.min((time-last)/1000,.05)*60;last=time;callback(Math.min(1,age/duration));if(age>=duration)resolve(true);else requestAnimationFrame(animate)}requestAnimationFrame(animate)})}
 async function run(mode){if(active)return;active=true;const token=++serial;white.style.display='block';white.style.opacity='0';try{
  if(!await frames(90,amount=>{onFrame(amount);white.style.opacity=String(Math.max(0,(amount-.5)*2))},token))return;
  loading.show();const timer=setInterval(()=>loading.update(Math.min(.99,progress())),50);try{await Promise.all([ready(),frames(15,()=>{},token)])}finally{clearInterval(timer)}if(token!==serial)return;
  loading.update(1);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));show(mode);onFrame(0);loading.hide();
  await frames(30,amount=>white.style.opacity=String(1-amount),token);
 }catch(error){loading.fail(error,()=>{cancel();show(null)});return}finally{if(token===serial){active=false;white.style.display='none'}}}
 function cancel(){serial++;active=false;white.style.display='none';onFrame(0);loading.hide()}
 return {run,cancel,get active(){return active}};
}

