const root='../Data/Movelist/';
const files=['SkillFrame','SkillBG','BGSparkA','BGSparkB','BGSparkC','Moon SNES','Jupiter SNES','Venus SNES','Neptune SNES','Saturn SNES'];
const colors={Moon:'f77ad3 18428e 0884af',Mercury:'96f0ff 104dce 05a7aa',Mars:'d0304c 7b1829 7b45b5',Jupiter:'4ac76b 005518 efa2bd',Venus:'f9e97b 393cb5 f7aa08',Pluto:'963036 290c21 7b2052',Neptune:'08bea5 001439 105984',Uranus:'ffdd65 21307b 4265ef',ChibiMoon:'ff6796 733073 f78ac6',Saturn:'7371d6 291c7b 9455c6',TuxedoMask:'9c3073 18418c 3975ff',SuperMoon:'cc99ff 2244bb 77bbcc',LadySwatheshia:'bb44aa 000044 33ccdd'};
const clamp=(x,max=1)=>Math.max(0,Math.min(max,x));
export function createMoveList({parent=document.body,preview=false,settings}={}){
 const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;
 canvas.hidden=true;canvas.setAttribute('aria-label','Move list. Enter to resume');
 canvas.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100vw,177.7778vh);height:min(56.25vw,100vh);z-index:100;touch-action:none';
 if(preview)canvas.style.cssText="width:100%;height:auto;touch-action:none";
 parent.append(canvas);
 const ctx=canvas.getContext('2d'),bg=document.createElement('canvas');bg.width=976;bg.height=544;
 const sparkleC=document.createElement("canvas");sparkleC.width=bg.width;sparkleC.height=bg.height;
 const sparkle= sparkleC.getContext("2d");
 const strips=[0,1].map(()=>Object.assign(document.createElement("canvas"),{width:1,height:544}));
 const layer=bg.getContext('2d'),images={},columns=[[],[]],scroll=[0,0];const displayed=[null,null],previous=[null,null],changed=[0,0];let start=0,frame=0,side=0,drag=null;
 const ready=Promise.all(files.map(async name=>{const img=new Image();img.src=new URL(root+name+'.webp',import.meta.url);await img.decode();images[name]=img}));
 ready.catch(console.error);
 function move(index,amount){scroll[index]=clamp(scroll[index]+amount,Math.max(0,columns[index].length*544-544))}
 function open(members){
  columns.forEach((_,i)=>{
   const unique=new Map();
   for(const {character,mode='snes'} of members.filter((_,n)=>n%2===i)){
    const name=character.replace(/^Sailor/,'');
    unique.set(name+'/'+mode,{name,mode});
   }
   columns[i]=[...unique.values()];scroll[i]=0;displayed[i]=columns[i][0]?.name;previous[i]=displayed[i];changed[i]=0;
  });
  start=performance.now();side=0;canvas.hidden=false;cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);
 }
 function close(){canvas.hidden=true;drag=null;cancelAnimationFrame(frame)}
 function gradient(name){
  const [a,b,c]=(colors[name]||colors.Moon).split(' ');
  const g=layer.createLinearGradient(0,0,0,544);
  function midpoint(from,to){
   const channels=[0,2,4].map(i=>Math.round((parseInt(from.slice(i,i+2),16)+parseInt(to.slice(i,i+2),16))/2));
   return 'rgb('+channels.join(',')+')';
  }
  const gradientStops=[[.05,'#'+a],[.29,midpoint(a,b)],[.45,'#'+b],[.65,'#'+b],[.77,midpoint(b,c)],[.95,'#'+c]];
  for(const [position,color] of gradientStops)g.addColorStop(position,color);
  return g;
 }
 function frameImage(w,h){
  const image=images.SkillFrame;if(!image)return;
  const sx=[132,232,1044,1144],sy=[97,140,685,713];
  if(w===1012&&h===616){ctx.drawImage(image,2,0);return}
  const x=640-w/2,y=405-h/2;
  const bx=Math.min(100,w/2),top=Math.min(43,h/2),bottom=Math.min(28,h/2);
  const dx=[x,x+bx,x+w-bx,x+w],dy=[y,y+top,y+h-bottom,y+h];
  for(let j=0;j<3;j++)for(let i=0;i<3;i++){
   const dw=dx[i+1]-dx[i],dh=dy[j+1]-dy[j];
   if(dw>0&&dh>0)ctx.drawImage(image,sx[i],sy[j],sx[i+1]-sx[i],sy[j+1]-sy[j],dx[i],dy[j],dw,dh);
  }
 }
 function draw(now){
  if(canvas.hidden)return;
  ctx.clearRect(0,0,1280,720);
  const w=220+792*clamp((now-start)/120),h=56+560*clamp((now-start-120)/150);
  if(h>56){
   layer.clearRect(0,0,976,544);
   const current=columns.map((list,i)=>list[Math.floor(scroll[i]/544)]?.name);
   current.forEach((name,i)=>{if(name!==displayed[i]){previous[i]=displayed[i];displayed[i]=name;changed[i]=now}});
   const colorPass=(i)=>{const bitmap=strips[i];const paint=bitmap.getContext("2d");paint.globalAlpha=1;paint.fillStyle=gradient(previous[i]);paint.fillRect(0,0,1,544);paint.globalAlpha=clamp((now-changed[i])/160);paint.fillStyle=gradient(displayed[i]);paint.fillRect(0,0,1,544);return bitmap};
   const left=colorPass(0),right=colorPass(1);layer.drawImage(left,0,0,508,544);
   layer.drawImage(right,508,0,468,544);
   for(let x=468;x<508;x++){layer.globalAlpha=(x-468)/40;layer.drawImage(right,x,0)}
   const config=settings?.()??{independent:true,layers:[
    {name:'BGSparkC',blend:'screen',opacity:.8,visible:true},
    {name:'BGSparkB',blend:'overlay',opacity:.8,visible:true},
    {name:'BGSparkA',blend:'source-over',opacity:.8,visible:true}
   ]};
   layer.globalAlpha=1;
   if(images.BGSparkC){
    sparkle.globalCompositeOperation='source-over';sparkle.clearRect(0,0,976,544);
    sparkle.drawImage(bg,0,0);
    sparkle.globalCompositeOperation='destination-in';
    sparkle.fillStyle=sparkle.createPattern(images.BGSparkC,'repeat-x');
    sparkle.fillRect(0,0,976,544);
    sparkle.globalCompositeOperation='source-over';
   }
   if(config.independent){
    layer.globalCompositeOperation='destination-in';layer.fillStyle='rgba(0,0,0,.8)';
    layer.fillRect(0,0,976,544);
   }
   for(const {name,blend,opacity,visible} of config.layers){
    if(!visible||!images[name])continue;
    layer.globalAlpha=opacity;layer.globalCompositeOperation=blend;
    if(name==='BGSparkC'){layer.drawImage(sparkleC,0,0)}else{layer.fillStyle=layer.createPattern(images[name],'repeat-x');layer.fillRect(0,0,976,544)}
   }
   layer.globalAlpha=1;layer.globalCompositeOperation='source-over';
   ctx.save();if(w<1012||h<616){ctx.beginPath();ctx.rect((1280-w)/2+18,405-h/2+43,w-36,Math.max(0,h-71));ctx.clip()}
   ctx.beginPath();ctx.roundRect(152,140,976,544,[12,12,40,40]);ctx.clip();
   ctx.globalAlpha=config.independent?1:.8;ctx.drawImage(bg,152,140);ctx.globalAlpha=1;
   ctx.fillStyle='#db9900';ctx.fillRect(640,184,1,468);
   columns.forEach((list,i)=>{
    ctx.save();ctx.beginPath();ctx.rect(152+i*488,140,488,544);ctx.clip();
    list.forEach(({name,mode},index)=>{
     const image=images[name+' '+mode.toUpperCase()],y=140+index*544-scroll[i];
     if(image)ctx.drawImage(image,152+i*488,y);
    });
    ctx.restore();
   });ctx.restore();
  }
  frameImage(w,h);frame=requestAnimationFrame(draw);
 }
 canvas.onpointerdown=e=>{if(!e.isPrimary)return;side=e.clientX<innerWidth/2?0:1;drag={id:e.pointerId,y:e.clientY};canvas.setPointerCapture(e.pointerId)};
 canvas.onpointermove=e=>{if(drag?.id!==e.pointerId)return;move(side,(drag.y-e.clientY)*720/canvas.getBoundingClientRect().height);drag.y=e.clientY};
 canvas.onlostpointercapture=()=>drag=null;
 canvas.addEventListener('wheel',e=>{e.preventDefault();move(e.clientX<innerWidth/2?0:1,e.deltaY)},{passive:false});
 return {ready,open,close,get active(){return !canvas.hidden},key(code){if(code==='ArrowLeft')side=0;if(code==='ArrowRight')side=1;if(code==='ArrowUp'||code==='ArrowDown')move(side,code==='ArrowUp'?-42:42)}};
}

