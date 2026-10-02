export function createFightHud(){
 const canvas=document.createElement('canvas');canvas.id='fightHud';canvas.style.cssText='position:fixed;inset:0;z-index:6;pointer-events:none';document.body.appendChild(canvas);
 const context=canvas.getContext('2d');let fight,timer,fightAtlas,timerAtlas,elapsed=0,mode='infinite',ticks=0;const trails=[{value:1,delay:0},{value:1,delay:0}];
 const load=async prefix=>{const data=await fetch('./'+prefix+'.json?v=02341').then(response=>response.json());const atlas=new Image();await new Promise((resolve,reject)=>{atlas.onload=resolve;atlas.onerror=reject;atlas.src='./'+prefix+'_atlas.png?v=02341'});return {data,atlas}};
 const ready=Promise.all([load('fight_hud'),load('timer_hud')]).then(([first,second])=>{fight=first.data;fightAtlas=first.atlas;timer=second.data;timerAtlas=second.atlas});
 function reset(){elapsed=0;ticks=0;for(const trail of trails){trail.value=1;trail.delay=0}}
 function setMode(value){mode=value;reset()}
 function step(active,life=[1000,1000]){ticks++;for(let index=0;index<2;index++){const target=Math.max(0,Math.min(1,life[index]/1000)),trail=trails[index];if(target>=trail.value){trail.value=target;trail.delay=30}else if(trail.delay>0)trail.delay--;else trail.value=Math.max(target,trail.value-.01)}if(mode==='99'&&active&&elapsed<5940)elapsed++}
 function remaining(){return mode==='99'?Math.max(0,99-Math.floor(elapsed/60)):null}
 function render(first,second){
  const width=visualViewport?.width||innerWidth,height=visualViewport?.height||innerHeight,fit=Math.min(width/1280,height/720),left=(width-1280*fit)/2,top=(height-720*fit)/2;
  const pixelWidth=Math.round(width*devicePixelRatio),pixelHeight=Math.round(height*devicePixelRatio);if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight}canvas.style.width=width+'px';canvas.style.height=height+'px';context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.clearRect(0,0,width,height);if(!fight||!timer)return;
  context.translate(left,top);context.scale(fit,fit);
  function sprite(data,atlas,frame,x,y,facing=1){const source=data.sprites[frame.group+','+frame.item];if(!source)return;context.save();context.translate(x,y);context.scale(facing,1);context.drawImage(atlas,source.x,source.y,source.w,source.h,-source.axisX+frame.ox,-source.axisY+frame.oy,source.w,source.h);context.restore()}
  for(const [player,life,max] of [[1,first.life,1000],[2,second.life,second.lifeMax||1000]]){
   const facing=player===1?1:-1,anchor=player===1?0:1278,ratio=Math.max(0,Math.min(1,life/max));
   context.save();context.globalAlpha=224/255;sprite(fight,fightAtlas,fight.actions['1001'][0],anchor,0,facing);context.restore();
   sprite(fight,fightAtlas,fight.actions['11'][0],anchor,0,facing);
   for(const [amount,animation] of [[Math.max(ratio,trails[player-1].value),'12'],[ratio,'1311']]){context.save();const edge=player===1?619-458*amount:1278-619;context.beginPath();context.rect(edge,0,458*amount,720);context.clip();sprite(fight,fightAtlas,fight.actions[animation][animation==='1311'?Math.floor(ticks/4)%60:0],anchor,0,facing);context.restore();}
  }
  sprite(fight,fightAtlas,fight.actions['60'][0],0,0);
  const value=remaining();if(value===null){context.fillStyle='#fff';context.font='bold 58px serif';context.textAlign='center';context.fillText('∞',642,102)}else{const text=String(value).padStart(2,'0');for(let index=0;index<2;index++)sprite(timer,timerAtlas,timer.actions[text[index]][0],642-58+index*58,42)}
  if(value===0){context.fillStyle='#ffffff';context.font='bold 30px serif';context.textAlign='center';context.fillText(first.life===second.life?'TIME OVER · DRAW':first.life>second.life?'TIME OVER · P1 WIN':'TIME OVER · P2 WIN',640,180)}
 }
 return {ready,render,step,reset,setMode,remaining};
}
