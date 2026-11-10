import {createRoundPresentation} from './round-presentation.js?v=02408r35';
import {assetUrl} from './asset-paths.js?v=02362';
export function createRoundView(api){
 const canvas=document.createElement('canvas');canvas.id='roundAnnouncements';canvas.style.cssText='position:fixed;inset:0;z-index:7;pointer-events:none';document.body.appendChild(canvas);const context=canvas.getContext('2d');
 const buttons=document.createElement('div');buttons.id='matchActions';buttons.hidden=true;buttons.style.cssText='position:fixed;left:50%;top:45%;transform:translateX(-50%);z-index:20';
 for(const [label,action] of [['再戰',api.rematch],['主頁',api.menu]]){const button=document.createElement('button');button.textContent=label;button.addEventListener('click',action);buttons.appendChild(button)}document.body.appendChild(buttons);
 const presentation=createRoundPresentation(api),ready=presentation.ready;
 let icons,iconAtlas,digits,digitAtlas;
 const statisticsReady=Promise.all([['win_icons','webp'],['timer_hud','png']].map(async ([name,extension])=>{const value=await fetch(assetUrl('./'+name+'.json?v=02362')).then(response=>response.json()),image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=assetUrl('./'+name+'_atlas.'+extension+'?v=02362')});return {value,image}})).then(([first,second])=>{icons=first.value;iconAtlas=first.image;digits=second.value;digitAtlas=second.image});
 function render(snapshot){const width=innerWidth,height=innerHeight,fit=Math.min(width/1280,height/720),pixelWidth=Math.round(width*devicePixelRatio),pixelHeight=Math.round(height*devicePixelRatio);if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight}context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);context.clearRect(0,0,width,height);context.translate((width-1280*fit)/2,(height-720*fit)/2);context.scale(fit,fit);if(!snapshot||!snapshot.mode||api.isHome())return;
  const statistics=api.statistics();context.shadowBlur=0;
  if(icons)for(const player of [1,2]){const position=icons.settings['p'+player+'.pos'],offset=icons.settings['p'+player+'.iconoffset'];for(const [index,win] of statistics.icons[player-1].slice(0,icons.settings.useiconupto).entries())for(const type of [win.type,...(win.perfect?['perfect']:[])]){const sprite=icons.sprites[icons.types[type].join(',')];context.drawImage(iconAtlas,sprite.x,sprite.y,sprite.w,sprite.h,position[0]+offset[0]*index-sprite.axisX,position[1]+offset[1]*index-sprite.axisY,sprite.w,sprite.h)}}
  if(digits)for(const player of [1,2]){const text=String(Math.round(Math.max(0,Math.min(9999999,statistics.totals[player-1])))),sprites=[...text].map(value=>digits.sprites[digits.actions[value][0].group+','+digits.actions[value][0].item]),scale=.4,width=sprites.reduce((sum,sprite)=>sum+sprite.w*scale,0);let x=player===1?160:1120-width;for(const sprite of sprites){context.drawImage(digitAtlas,sprite.x,sprite.y,sprite.w,sprite.h,x,130-sprite.axisY*scale,sprite.w*scale,sprite.h*scale);x+=sprite.w*scale}}
  presentation.draw(context);
 }
 return {ready:Promise.all([ready,statisticsReady]),render,message:presentation.message,snapshot:presentation.snapshot,showMatch:()=>{buttons.hidden=false},hideMatch:()=>{buttons.hidden=true;presentation.message('')}};
}
