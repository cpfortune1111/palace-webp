export function logoLetterPose(tick,index,config){
 const age=tick-config.letterStart-index*config.letterStagger;
 if(age<0)return {alpha:0,y:36};
 const duration=config.letterDuration-17*index/9,progress=Math.min(1,age/(duration-1));
 const anchors=[[0,36],[22/57,-30],[42/57,14],[1,0]];
 let offset=0;
 for(let segment=1;segment<anchors.length;segment++){const [start,startY]=anchors[segment-1],[end,endY]=anchors[segment];if(progress<=end){const ease=(1-Math.cos(Math.PI*(progress-start)/(end-start)))/2;offset=startY+(endY-startY)*ease;break}}
 return {alpha:Math.min(1,(age+1)/6),y:offset};
}

export function createLogoIntro(){
 const overlay=document.createElement('canvas');overlay.id='logoIntro';overlay.setAttribute('aria-label','TsukinoAi+ logo animation');overlay.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:100;background:white;touch-action:none';document.body.appendChild(overlay);
 const context=overlay.getContext('2d');let config,lastFrame=null,tick=0,finished=false,animationFrame;let resolveFinished;
 const done=new Promise(resolve=>{resolveFinished=resolve});
 const load=async entry=>{const image=new Image();image.src='./'+entry.file;await image.decode();const bitmap=await createImageBitmap(image);return {...entry,image:bitmap}};
 const ready=fetch('./logo-intro.json?v=02361').then(response=>{if(!response.ok)throw Error('Logo configuration');return response.json()}).then(async data=>{
  const [letters,petals]=await Promise.all([Promise.all(data.letters.map(load)),Promise.all(data.petals.map(load))]);
  const staging=document.createElement('canvas');staging.width=1280;staging.height=720;const stagingContext=staging.getContext('2d');for(const entry of [...letters,...petals]){stagingContext.clearRect(0,0,1280,720);stagingContext.drawImage(entry.image,0,0)}
  config={...data,letters,petals};return config;
 });
 function finish(){if(finished)return;finished=true;cancelAnimationFrame(animationFrame);document.removeEventListener('visibilitychange',resetFrame);for(const entry of [...config.letters,...config.petals])entry.image.close();overlay.remove();resolveFinished()}
 function render(atTick){if(!config||finished)return;const width=Math.round(innerWidth*devicePixelRatio),height=Math.round(innerHeight*devicePixelRatio);if(overlay.width!==width||overlay.height!==height){overlay.width=width;overlay.height=height}context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.fillStyle='white';context.fillRect(0,0,innerWidth,innerHeight);const scale=Math.min(innerWidth/1280,innerHeight/720);context.translate((innerWidth-1280*scale)/2,(innerHeight-720*scale)/2);context.scale(scale,scale);
  for(const [index,letter] of config.letters.entries()){const pose=logoLetterPose(atTick,index,config);if(!pose.alpha)continue;context.save();context.globalAlpha=pose.alpha;context.drawImage(letter.image,letter.x,letter.y+pose.y,letter.width*letter.scale,letter.height*letter.scale);context.restore()}
  const frame=config.petalFrames.find(frame=>atTick>=frame.start&&atTick<frame.end);if(frame){const petals=config.petals.find(entry=>entry.item===frame.item);context.drawImage(petals.image,petals.x,petals.y)}
 }
 function resetFrame(){lastFrame=null}
 document.addEventListener('visibilitychange',resetFrame);
 function animateLogo(now){if(finished)return;if(document.hidden){lastFrame=null;animationFrame=requestAnimationFrame(animateLogo);return}if(lastFrame!==null)tick+=Math.max(0,Math.min(1,(now-lastFrame)*60/1000));lastFrame=now;if(tick>=config.duration){finish();return}render(tick);animationFrame=requestAnimationFrame(animateLogo)}
 ready.then(()=>{render(0);animationFrame=requestAnimationFrame(animateLogo)}).catch(error=>{console.error('Logo intro',error);overlay.setAttribute('aria-label','動畫載入失敗，請重新整理');overlay.width=innerWidth;overlay.height=innerHeight;context.fillStyle='white';context.fillRect(0,0,innerWidth,innerHeight);context.fillStyle='#444';context.font='18px system-ui';context.textAlign='center';context.fillText('動畫載入失敗，請重新整理',innerWidth/2,innerHeight/2)});
 return {ready,done,render,get tick(){return tick},get finished(){return finished}};
}
