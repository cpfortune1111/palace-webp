import {createDeclarationScreen} from './declaration-screen.js?v=02378';
import {createReportCard} from './report-card.js?v=02378';
export function createResultDeclarationScreen(parent,api){
 const view=document.createElement('section');view.id='resultDeclarations';view.hidden=true;view.style.cssText='position:absolute;inset:0;background:#05050d;z-index:5';parent.appendChild(view);
 const canvas=document.createElement('canvas');canvas.style.cssText='width:100%;height:100%';view.appendChild(canvas);const context=canvas.getContext('2d'),report=createReportCard();let background,lastTime,accumulator=0,reportVisible=false,reportStarted=false;
 const style=document.createElement('style');style.textContent='@font-face{font-family:BlackQuality;src:url("./Data/ACS/BlackQuality.ttf")}';view.appendChild(style);
 const declaration=createDeclarationScreen({sound:api.sound,complete:()=>{reportVisible=true},error:reason=>console.error('Result declaration',reason)});
 const ready=Promise.all([declaration.ready,report.ready,Promise.resolve().then(async()=>{background=new Image();background.src='./Stage/Select/background.webp?v=selection8';await background.decode();await document.fonts.load('48px BlackQuality')})]);
 function show(players,winner,statistics){if(!background)throw Error('Result declarations not loaded');accumulator=0;lastTime=undefined;reportVisible=false;reportStarted=false;view.hidden=false;report.begin(players[(winner||1)-1],winner||1,statistics);declaration.begin(players,{result:true,winner});draw()}
 function hide(){view.hidden=true;declaration.reset();lastTime=undefined;reportVisible=false}
 function continueReport(){if(view.hidden||!reportVisible)return;hide();api.complete()}
 view.addEventListener('pointerdown',event=>{const fit=Math.min(innerWidth/1280,innerHeight/720),left=(innerWidth-1280*fit)/2,top=(innerHeight-720*fit)/2;if(reportVisible&&event.clientX>=left&&event.clientX<=left+1280*fit&&event.clientY>=top&&event.clientY<=top+720*fit){event.preventDefault();continueReport()}});
 function handleKey(event){if(view.hidden)return false;if(reportVisible&&!event.repeat&&['Enter','KeyZ','KeyA','KeyX','KeyS','KeyY','KeyB','Numpad0','Numpad1','Numpad2','NumpadDecimal'].includes(event.code))continueReport();return true}
 function draw(){if(view.hidden)return;const fit=Math.min(innerWidth/1280,innerHeight/720);canvas.width=Math.round(innerWidth*devicePixelRatio);canvas.height=Math.round(innerHeight*devicePixelRatio);context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.fillStyle='#05050d';context.fillRect(0,0,innerWidth,innerHeight);context.translate((innerWidth-1280*fit)/2,(innerHeight-720*fit)/2);context.scale(fit,fit);context.beginPath();context.rect(0,0,1280,720);context.clip();const state=declaration.snapshot();if(!reportStarted&&(reportVisible||state.phase==='loserFade')){reportStarted=true;api.reportStart?.()}const blend=reportVisible?1:state.phase==='loserFade'?Math.min(1,state.age/30):0;context.globalAlpha=1-blend;context.drawImage(background,0,0,1280,720);context.globalAlpha=1;report.background(context,blend);declaration.draw(context);report.draw(context,blend)}
 function animate(time){if(!view.hidden){if(lastTime!==undefined&&!document.hidden)accumulator+=Math.min((time-lastTime)/1000,.05)*60;lastTime=time;while(accumulator>=1&&!view.hidden){accumulator--;declaration.step();report.step(1)}draw()}requestAnimationFrame(animate)}requestAnimationFrame(animate);
 return {ready,show,hide,handleKey,snapshot:()=>({visible:!view.hidden,reportVisible,report:report.snapshot(),...declaration.snapshot()})};
}

