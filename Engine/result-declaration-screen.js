import {createDeclarationScreen} from './declaration-screen.js?v=declaration5';
export function createResultDeclarationScreen(parent,api){
 const view=document.createElement('section');view.id='resultDeclarations';view.hidden=true;view.style.cssText='position:absolute;inset:0;background:#05050d;z-index:5;pointer-events:none';parent.appendChild(view);
 const canvas=document.createElement('canvas');canvas.style.cssText='width:100%;height:100%';view.appendChild(canvas);const context=canvas.getContext('2d');let background,lastTime,accumulator=0;
 const declaration=createDeclarationScreen({sound:api.sound,complete:()=>{hide();api.complete()},error:reason=>console.error('Result declaration',reason)});
 const ready=Promise.all([declaration.ready,Promise.resolve().then(async()=>{background=new Image();background.src='./Stage/Select/background.webp?v=selection8';await background.decode()})]);
 function show(players,winner){if(!background)throw Error('Result declarations not loaded');accumulator=0;lastTime=undefined;view.hidden=false;view.style.opacity='0';declaration.begin(players,{result:true,winner});draw()}
 function hide(){view.hidden=true;declaration.reset();lastTime=undefined}
 function draw(){if(view.hidden)return;const fit=Math.min(innerWidth/1280,innerHeight/720);canvas.width=Math.round(innerWidth*devicePixelRatio);canvas.height=Math.round(innerHeight*devicePixelRatio);context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.fillStyle='#05050d';context.fillRect(0,0,innerWidth,innerHeight);context.translate((innerWidth-1280*fit)/2,(innerHeight-720*fit)/2);context.scale(fit,fit);context.beginPath();context.rect(0,0,1280,720);context.clip();context.globalAlpha=Math.min(1,declaration.snapshot().ticks/30);context.drawImage(background,0,0,1280,720);declaration.draw(context);view.style.opacity='1'}
 function animate(time){if(!view.hidden){if(lastTime!==undefined)accumulator+=Math.min((time-lastTime)/1000,.05)*60;lastTime=time;while(accumulator>=1&&!view.hidden){accumulator--;declaration.step()}draw()}requestAnimationFrame(animate)}requestAnimationFrame(animate);
 return {ready,show,hide,snapshot:()=>({visible:!view.hidden,...declaration.snapshot()})};
}

