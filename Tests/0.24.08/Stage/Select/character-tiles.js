import {mirrorCharacters} from './disco-interface.js?v=layers2';

const foreground={Moon:'Moo',Jupiter:'Jup',Venus:'Ven',Neptune:'Nep',Saturn:'Sat'};
const offset=-52;

export function createCharacterTiles(parent){
 const layer=document.createElement('div');
 layer.style.cssText='position:absolute;left:50%;top:50%;width:1280px;height:720px;pointer-events:none;overflow:hidden';
 parent.appendChild(layer);
 const entries=[];
 function image(name,blend){
  const img=new Image();
  img.style.cssText='position:absolute;left:0;top:'+offset+'px;width:1280px;height:720px;mix-blend-mode:'+blend;
  img.src=new URL('./Tiles/'+name+'.webp',import.meta.url);
  layer.appendChild(img);
  return img;
 }
 for(const [name,id] of Object.entries(mirrorCharacters)){
  const base=image(name,'hard-light');
  const top=foreground[name]?image(foreground[name],'normal'):null;
  entries.push({id,base,top,opacity:0.4});
 }
 return {
  ready:Promise.all(entries.flatMap(({base,top})=>top?[base.decode(),top.decode()]:[base.decode()])),
  resize(width){layer.style.transform='translate(-50%,-50%) scale('+width/1280+')'},
  hide(value){layer.hidden=value},
  update({players,available}){
   for(const entry of entries){
    entry.opacity=!available.includes(entry.id)?.4:players.includes(entry.id)?1:.8;
    entry.base.style.opacity=entry.opacity;
    if(entry.top)entry.top.style.opacity=entry.opacity;
   }
  },
  capture(ctx){
   if(layer.hidden)return;
   ctx.save();
   for(const {base,top,opacity} of entries){
    ctx.globalAlpha=opacity;
    ctx.globalCompositeOperation='hard-light';
    ctx.drawImage(base,0,offset);
    if(top){ctx.globalCompositeOperation='source-over';ctx.drawImage(top,0,offset)}
   }
   ctx.restore();
  }
 };
}
