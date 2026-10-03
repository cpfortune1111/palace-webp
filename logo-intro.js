export function createLogoIntro(){
 const overlay=document.createElement('canvas');overlay.id='logoIntro';overlay.setAttribute('aria-label','TsukinoAi+ logo animation');overlay.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:100;background:white;touch-action:none';document.body.appendChild(overlay);
 const context=overlay.getContext('2d');let config,started=null,finished=false,animationFrame;let resolveFinished;
 const done=new Promise(resolve=>{resolveFinished=resolve});
 const load=async entry=>{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('Logo image '+entry.file));image.src='./'+entry.file});return {...entry,image}};
 const ready=fetch('./logo-intro.json?v=02360').then(response=>{if(!response.ok)throw Error('Logo configuration');return response.json()}).then(async data=>{config={...data,letters:await Promise.all(data.letters.map(load)),petals:await Promise.all(data.petals.map(load))};return config});
 function finish(){if(finished)return;finished=true;cancelAnimationFrame(animationFrame);overlay.remove();resolveFinished()}
 function render(tick){if(!config||finished)return;overlay.width=Math.round(innerWidth*devicePixelRatio);overlay.height=Math.round(innerHeight*devicePixelRatio);context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.fillStyle='white';context.fillRect(0,0,innerWidth,innerHeight);const scale=Math.min(innerWidth/1280,innerHeight/720);context.translate((innerWidth-1280*scale)/2,(innerHeight-720*scale)/2);context.scale(scale,scale);
  for(const [index,letter] of config.letters.entries()){const progress=Math.max(0,Math.min(1,(tick-config.letterStart-index*config.letterStagger)/config.letterDuration));if(!progress)continue;const bounce=progress===1?0:Math.sin(progress*Math.PI*2.5)*30*Math.pow(1-progress,2);context.save();context.globalAlpha=Math.min(1,progress*3);context.drawImage(letter.image,letter.x,letter.y+bounce,letter.width*letter.scale,letter.height*letter.scale);context.restore()}
  const frame=config.petalFrames.find(frame=>tick>=frame.start&&tick<frame.end);if(frame){const petals=config.petals.find(entry=>entry.item===frame.item);context.drawImage(petals.image,petals.x,petals.y)}
 }
 function animate(now){if(finished)return;if(started===null)started=now;const tick=(now-started)*60/1000;if(tick>=config.duration){finish();return}render(tick);animationFrame=requestAnimationFrame(animate)}
 ready.then(()=>{animationFrame=requestAnimationFrame(animate)}).catch(error=>{console.error('Logo intro',error);finish()});
 return {ready,done,render,finish,get finished(){return finished}};
}
