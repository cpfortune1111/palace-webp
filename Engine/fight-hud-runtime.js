import {assetUrl} from './asset-paths.js?v=02362';
export function createFightHud(){
 const canvas=document.createElement('canvas');canvas.id='fightHud';canvas.style.cssText='position:fixed;inset:0;z-index:6;pointer-events:none';document.body.appendChild(canvas);
 const backdrop=document.createElement('canvas');backdrop.id='portraitBackdrop';backdrop.style.cssText='position:fixed;inset:0;z-index:3;pointer-events:none';document.body.appendChild(backdrop);const backdropContext=backdrop.getContext('2d');
 const context=canvas.getContext('2d');let fight,timer,fightAtlas,timerAtlas,elapsed=0,mode='infinite',ticks=0;const trails=[{value:1,start:1,target:1,age:10,hold:0},{value:1,start:1,target:1,age:10,hold:0}];
 const load=async prefix=>{const data=await fetch(assetUrl('./'+prefix+'.json?v=02362')).then(response=>response.json());const atlas=new Image();await new Promise((resolve,reject)=>{atlas.onload=resolve;atlas.onerror=reject;atlas.src=assetUrl('./'+prefix+'_atlas.png?v=02362')});return {data,atlas}};
 const ready=Promise.all([load('fight_hud'),load('timer_hud')]).then(([first,second])=>{fight=first.data;fightAtlas=first.atlas;timer=second.data;timerAtlas=second.atlas});
 const fronts=[{value:1,start:1,target:1,age:10},{value:1,start:1,target:1,age:10}];
 function reset(){elapsed=0;ticks=0;for(const trail of [...trails,...fronts]){trail.value=1;trail.start=1;trail.target=1;trail.age=10;trail.hold=0}}
 function setMode(value){mode=value;reset()}
 function step(active,life=[1000,1000]){ticks++;for(let index=0;index<2;index++){const target=Math.max(0,Math.min(1,life[index]/1000)),trail=trails[index];if(target!==trail.target){const healing=target>trail.target;trail.start=trail.value;trail.target=target;trail.age=healing?10:0;trail.hold=healing?0:60;if(healing)trail.value=target}if(trail.hold>0){trail.hold--;continue}trail.age=Math.min(10,trail.age+1);trail.value=trail.start+(trail.target-trail.start)*trail.age/10}if(mode!=='infinite'&&active&&elapsed<Number(mode)*60)elapsed++}
 function stepFront(life){for(let index=0;index<2;index++){const front=fronts[index],target=Math.max(0,Math.min(1,life[index]/1000));if(target!==front.target){front.start=front.value;front.age=target>front.target?10:0;front.target=target}front.age=Math.min(10,front.age+1);front.value=front.start+(front.target-front.start)*(1-(1-front.age/10)**2)}}
 function remaining(){return mode!=='infinite'?Math.max(0,Number(mode)-Math.floor(elapsed/60)):null}
 function render(first,second,{showTimeOver=true}={}){
  const width=visualViewport?.width||innerWidth,height=visualViewport?.height||innerHeight,fit=Math.min(width/1280,height/720),left=(width-1280*fit)/2,top=(height-720*fit)/2;
  const pixelWidth=Math.round(width*devicePixelRatio),pixelHeight=Math.round(height*devicePixelRatio);if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight}canvas.style.width=width+'px';canvas.style.height=height+'px';context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.clearRect(0,0,width,height);if(!fight||!timer)return;
  context.translate(left,top);context.scale(fit,fit);
  if(backdrop.width!==pixelWidth||backdrop.height!==pixelHeight){backdrop.width=pixelWidth;backdrop.height=pixelHeight}backdrop.style.width=width+'px';backdrop.style.height=height+'px';backdropContext.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);backdropContext.clearRect(0,0,width,height);backdropContext.translate(left,top);backdropContext.scale(fit,fit);
  function sprite(data,atlas,frame,x,y,facing=1){const source=data.sprites[frame.group+','+frame.item];if(!source)return;context.save();context.translate(x,y);context.scale(facing,1);context.drawImage(atlas,source.x,source.y,source.w,source.h,-source.axisX+frame.ox,-source.axisY+frame.oy,source.w,source.h);context.restore()}
  for(const [player,life,max] of [[1,first.life,1000],[2,second.life,second.lifeMax||1000]]){
   const facing=player===1?1:-1,anchor=player===1?0:1278,ratio=Math.max(0,Math.min(1,life/max));
   context.save();context.globalAlpha=224/255;sprite(fight,fightAtlas,fight.actions['1001'][0],anchor,0,facing);context.restore();
   sprite(fight,fightAtlas,fight.actions['11'][0],anchor,0,facing);
   for(const [amount,animation] of [[trails[player-1].value,'12'],[fronts[player-1].value,'1311']]){context.save();const edge=player===1?619-458*amount:1278-619;context.beginPath();context.rect(edge,0,458*amount,720);context.clip();sprite(fight,fightAtlas,fight.actions[animation][animation==='1311'?Math.floor(ticks/4)%60:0],anchor,0,facing);context.restore();}
   const background=fight.sprites['51,0'];backdropContext.save();backdropContext.translate(player===1?0:1280,0);backdropContext.scale(facing,1);backdropContext.drawImage(fightAtlas,background.x,background.y,background.w,background.h,-background.axisX,-background.axisY,background.w,background.h);backdropContext.restore();
  }
  sprite(fight,fightAtlas,fight.actions['60'][0],0,0);
  const value=remaining();if(value!==null){const text=String(value).padStart(2,'0');for(let index=0;index<2;index++)sprite(timer,timerAtlas,timer.actions[text[index]][0],index===0?614:642,42)}
  if(value===0&&showTimeOver){context.fillStyle='#ffffff';context.font='bold 30px serif';context.textAlign='center';context.fillText(first.life===second.life?'TIME OVER · DRAW':first.life>second.life?'TIME OVER · P1 WIN':'TIME OVER · P2 WIN',640,180)}
 }
 return {ready,render,animate:()=>{ticks++},step:(active,life=[1000,1000])=>{step(active,life);stepFront(life)},reset,setMode,remaining,remainingExact:()=>mode==='infinite'?null:Math.max(0,Number(mode)-elapsed/60),displayLife:()=>trails.map(trail=>trail.value),displayFront:()=>fronts.map(front=>front.value)};
}
