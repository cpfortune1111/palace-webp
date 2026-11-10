export const energyConfig={color:'#FF00FF',initial:5,maximum:230,densityPower:2.6,speed:20,glow:1,converge:183,fill:30,white:33,hold:15};
const clamp=n=>Math.max(0,Math.min(1,n));
export function createContinueEnergy(config={}){
 const c={...energyConfig,...config};let rays=[];
 function reset(){rays=Array.from({length:c.maximum},()=>({angle:Math.random()*Math.PI*2,distance:650+Math.random()*700,length:20+Math.random()*100,speed:c.speed*(.8+Math.random()*.5),depth:.25+Math.random()*.75,offset:Math.random()*100}))}
 function draw(ctx,t,x=642,y=138){if(t>=c.converge+c.fill){const p=clamp((t-c.converge-c.fill)/c.white);ctx.fillStyle='rgb(255,'+Math.round(p*255)+',255)';ctx.fillRect(0,0,1280,720);return}if(!rays.length)reset();const progress=clamp(t/c.converge),count=Math.round(c.initial+(c.maximum-c.initial)*progress**c.densityPower);ctx.save();ctx.globalCompositeOperation='lighter';
 const radius=50+1100*progress**2,glow=ctx.createRadialGradient(x,y,0,x,y,radius);glow.addColorStop(0,'rgba(255,0,255,'+(.1+.75*progress)*c.glow+')');glow.addColorStop(.35,'rgba(255,0,255,'+(.45*progress)+')');glow.addColorStop(1,'rgba(255,0,255,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,1280,720);
 for(const r of rays.slice(0,count)){const d=((r.distance-(t-r.offset)*r.speed)%r.distance+r.distance)%r.distance,near=1-clamp(d/r.distance),len=r.length*(.3+near*2)*r.depth,cos=Math.cos(r.angle),sin=Math.sin(r.angle),ax=x+cos*d,ay=y+sin*d,bx=x+cos*(d+len),by=y+sin*(d+len),g=ctx.createLinearGradient(ax,ay,bx,by);g.addColorStop(0,'rgba(255,80,255,'+(.3+.7*near)+')');g.addColorStop(1,'rgba(255,0,255,0)');ctx.strokeStyle=g;ctx.lineWidth=(.5+3*near)*r.depth;ctx.shadowColor=c.color;ctx.shadowBlur=6;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke()}
 ctx.restore();if(t>=c.converge){ctx.save();ctx.globalAlpha=clamp((t-c.converge)/c.fill);ctx.fillStyle=c.color;ctx.fillRect(0,0,1280,720);ctx.restore()}if(t>=c.converge+c.fill){const p=clamp((t-c.converge-c.fill)/c.white);ctx.fillStyle='rgb(255,'+Math.round(p*255)+',255)';ctx.fillRect(0,0,1280,720)}}
 return {reset,draw,clear(){rays=[]},snapshot:()=>({count:rays.length,config:{...c}})};
}
