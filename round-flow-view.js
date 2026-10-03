export function createRoundView(api){
 const canvas=document.createElement('canvas');canvas.id='roundAnnouncements';canvas.style.cssText='position:fixed;inset:0;z-index:7;pointer-events:none';document.body.appendChild(canvas);const context=canvas.getContext('2d');
 const buttons=document.createElement('div');buttons.id='matchActions';buttons.hidden=true;buttons.style.cssText='position:fixed;left:50%;top:45%;transform:translateX(-50%);z-index:20';
 for(const [label,action] of [['再戰',api.rematch],['主頁',api.menu]]){const button=document.createElement('button');button.textContent=label;button.addEventListener('click',action);buttons.appendChild(button)}document.body.appendChild(buttons);
 let data,atlas,message='',animation=null,animationStart=0;const ready=fetch('./round_hud.json?v=02346').then(response=>response.json()).then(async value=>{data=value;atlas=new Image();await new Promise((resolve,reject)=>{atlas.onload=resolve;atlas.onerror=reject;atlas.src='./round_hud_atlas.webp?v=02346'})});
 function render(snapshot){const width=innerWidth,height=innerHeight,fit=Math.min(width/1280,height/720),pixelWidth=Math.round(width*devicePixelRatio),pixelHeight=Math.round(height*devicePixelRatio);if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight}context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.clearRect(0,0,width,height);context.translate((width-1280*fit)/2,(height-720*fit)/2);context.scale(fit,fit);if(!snapshot||!snapshot.mode||snapshot.mode==='training'||api.isHome())return;
  context.textAlign='center';context.fillStyle='#fff';context.shadowColor='#101025';context.shadowBlur=8;context.font='bold 26px Georgia';context.fillText(snapshot.wins[0]+' — '+snapshot.wins[1],640,115);
  let drawn=false;
  if(animation&&data){let elapsed=0;const age=api.tick()-animationStart;const frame=data.actions[String(animation)].find(frame=>{elapsed+=Math.max(1,frame.time);return age<elapsed});if(frame){const sprite=data.sprites[frame.group+','+frame.item];context.shadowBlur=0;context.drawImage(atlas,sprite.x,sprite.y,sprite.w,sprite.h,640-sprite.axisX+frame.ox,-sprite.axisY+frame.oy,sprite.w,sprite.h);drawn=true}else animation=null}
  if(message&&!drawn){context.font='bold 42px Georgia';context.fillText(message,640,178)}
 }
 return {ready,render,message:value=>{message=value;if(value==='FIGHT'||value==='K.O.'){animation=value==='FIGHT'?80:200;animationStart=api.tick()}else if(value)animation=null},showMatch:()=>{buttons.hidden=false},hideMatch:()=>{buttons.hidden=true;animation=null;message=''}};
}
