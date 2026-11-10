const clamp=n=>Math.max(0,Math.min(1,n)),lerp=(a,b,t)=>a+(b-a)*clamp(t),between=(t,a,b)=>clamp((t-a)/(b-a));
const heartPath='M50,90.6c0-12.2,50-15.6,50-51.9,0-18.3-13.3-29.2-29.2-29.2-11.8,0-20.8,8.9-20.8,8.9,0,0-9-8.9-20.8-8.9S0,20.4,0,38.7c0,36.3,50,39.8,50,51.9Z';
export function settingsPose(t){
 const c=between(t,144,156),h=between(t,20,144),small=between(t,144,160),turn=(Math.max(0,t-152)%30),smooth=n=>(1-Math.cos(Math.PI*clamp(n)))/2;
 const spin=t<152?1:turn<13.5?lerp(1,.2,smooth(turn/13.5)):turn<16.5?.2:lerp(.2,1,smooth((turn-16.5)/13.5));
 const height=t<=144?lerp(860,535,h):t<152?lerp(535,136,between(t,144,152)):136;
 const heart={height,x:0,y:t<=144?20:t<=152?lerp(20,-27,between(t,144,152)):lerp(-27,-252,between(t,152,160)),width:t<=144?lerp(860,535,h):t<=152?lerp(535,120,between(t,144,152)):lerp(120,136,between(t,152,160)),opacity:between(t,20,44),scaleX:spin};
 const top=[[-109,-45,-424,-238],[-70,52,-232,-238],[70,52,232,-238],[109,-45,424,-238]],bottom=[[-72,42,-414,268],[-25.5,66,-138,268],[25.5,66,138,268],[72,42,414,268]];
 const hearts=t<144?[]:[...top.map(p=>({x:lerp(p[0],p[2],small),y:lerp(p[1],p[3],small),width:lerp(136,86,small)})),...bottom.map(p=>({x:lerp(p[0],p[2],small),y:lerp(p[1],p[3],small),width:lerp(136,108,small)}))];
 return {tick:t,background:between(t,28,68),crescent:{x:lerp(-7,28.5,c),y:lerp(6,0,c),height:t<60?lerp(1840,104,t/60):lerp(104,620,c),front:t<=156},heart,hearts,sparkle:{visible:t>=20&&t<133,scale:1-between(t,120,132),progress:.86*between(t,20,120)},trail:{visible:t>=20&&t<132,width:1-between(t,120,132),progress:.86*between(t,20,120)},controls:between(t,160,172)};
}
async function image(name){const img=new Image();img.src=new URL('../Data/Settings/'+name+'.webp?v=02408r38',import.meta.url);await img.decode();return img}
export function createSettingsPresentation(){
 let age=0,active=false,closing=false,closeAge=0,art;const ready=Promise.all(['Crescent','Heart','Sparkle'].map(image)).then(images=>art=images);
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',heartPath);const length=path.getTotalLength(),points=Array.from({length:401},(_,i)=>{const p=path.getPointAtLength(length*(1-i/400));return [p.x-50,p.y-50]});
 const shape=(ctx,img,x,y,w,h,color,blur,alpha=1,sx=1)=>{const pad=32,base=img.naturalWidth-64,extra=pad/base;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(640+x,360+y);ctx.scale(sx,1);ctx.drawImage(img,-w*(.5+extra),-h*(.5+extra),w*(1+2*extra),h*(1+2*extra));ctx.restore()};
 function snapshot(){const pose=settingsPose(age);return {...pose,active,closing,fade:closing?1-between(closeAge,0,20):1,closed:closing&&closeAge>=20}}
 function draw(ctx,background){if(!active||!art)return;const p=snapshot();ctx.save();ctx.globalAlpha=p.fade;if(background){ctx.save();ctx.globalAlpha*=p.background;ctx.drawImage(background.image,0,0,1280,720);ctx.restore()}
 const crescent=()=>shape(ctx,art[0],p.crescent.x,p.crescent.y,p.crescent.height,p.crescent.height,'#FFE868',10);
 if(!p.crescent.front)crescent();
 shape(ctx,art[1],p.heart.x,p.heart.y,p.heart.width,p.heart.height,'#E763B9',5,p.heart.opacity,p.heart.scaleX);
 if(p.trail.visible||p.sparkle.visible){ctx.save();ctx.globalAlpha*=p.heart.opacity;ctx.translate(640+p.heart.x,360+p.heart.y);ctx.scale(p.heart.scaleX,1);const scale=p.heart.width/100,index=Math.min(400,Math.floor(p.sparkle.progress*400));
 if(p.trail.visible){ctx.beginPath();for(let i=0;i<=index;i++){const [x,y]=points[i];i?ctx.lineTo(x*scale,y*scale):ctx.moveTo(x*scale,y*scale)}ctx.strokeStyle='#fff';ctx.lineWidth=2.5*p.trail.width;ctx.setLineDash([120,80,70,20,30,10,20]);ctx.shadowColor='rgba(255,255,255,'+p.trail.width+')';ctx.shadowBlur=2;if(p.trail.width>0)ctx.stroke()}
 if(p.sparkle.visible&&p.sparkle.scale>0){const [x,y]=points[index],size=100*p.sparkle.scale;ctx.drawImage(art[2],x*scale-size/2,y*scale-size/2,size,size);}ctx.restore()}
 for(const h of p.hearts)shape(ctx,art[1],h.x,h.y,h.width,h.width,'#E763B9',5);
 if(p.crescent.front)crescent();ctx.restore()}
 return {ready,begin(){age=0;active=true;closing=false;closeAge=0},close(){closing=true;closeAge=0},reset(){active=false;closing=false},step(seconds){if(active){age+=seconds*60;if(closing)closeAge+=seconds*60}},draw,snapshot,seek(t){age=Math.max(0,t)}};
}
