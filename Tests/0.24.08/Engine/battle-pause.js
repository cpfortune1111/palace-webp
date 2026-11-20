import {createMoveList} from './move-list.js?v=pauseHUD1';
import {createKeyConfig,settingsArt,settingsText} from './key-config-screen.js?v=centerPress1';
import {touchOnly,inputSwitchRow} from './input-layout.js?v=pauseHUD1';
export function createBattlePause({members,canPause,pause,resume,shell,bindings}){
 let config=null,page='movelist',readyToInteract=false,dim=false;
 const surface=document.createElement('div');surface.id='battlePauseSurface';surface.hidden=true;
 surface.style.cssText='position:fixed;left:50%;top:50%;width:1280px;height:720px;transform-origin:center;z-index:102;pointer-events:none';document.body.append(surface);
 const controls=document.createElement('div');controls.id='battlePauseSettings';controls.style.cssText='position:absolute;inset:0;pointer-events:none';surface.append(controls);
 const toolbar=document.createElement('div');toolbar.id='battlePauseButtons';toolbar.style.cssText=surface.style.cssText+';z-index:400';document.body.append(toolbar);
 function layout(){const fit=Math.min(innerWidth/1280,innerHeight/720);for(const el of [surface,toolbar])el.style.transform=`translate(-50%,-50%) scale(${fit})`};layout();addEventListener('resize',layout);
 function icon(name,x,y,label,action){const b=document.createElement('button'),img=new Image();b.type='button';b.ariaLabel=label;b.style.cssText=`position:absolute;left:${640+x}px;top:${360+y}px;translate:-50% -50%;padding:0;border:0;background:transparent;pointer-events:auto;filter:drop-shadow(0 2px 2px #0004)`;img.src=new URL('../Data/Movelist/'+name+'.webp?v=pauseHUD1',import.meta.url);img.style.display='block';b.append(img);b.onclick=action;toolbar.append(b);return b}
 const play=icon('Pause',-589,-200,'Pause battle',()=>list.active?close():open());
 const toggle=icon('Settings',561,-160,'Switch to settings',()=>{if(!list.active)return;const next=page==='movelist'?'settings':'movelist';if(list.switchView(next)){config=null;shell().audio.effect('btn-click')}});toggle.hidden=true;
 const list=createMoveList({alternate(ctx,view,opacity){const image=shell().settingsBackground();ctx.globalAlpha=opacity;ctx.filter=dim?'brightness(.8)':'none';if(image)ctx.drawImage(image,152,140,976,544);ctx.filter='none';ctx.globalAlpha=1},phase(state){
  readyToInteract=!state.transitioning;surface.hidden=!list.active;
  if(state.view!==page){page=state.view;render()}
  controls.style.opacity=String(state.opacity);controls.inert=!readyToInteract||page==='movelist';
  toggle.firstChild.src=new URL('../Data/Movelist/'+(page==='movelist'?'Settings':'Movelist')+'.webp?v=pauseHUD1',import.meta.url);toggle.ariaLabel=page==='movelist'?'Switch to settings':'Switch to movelist';
 }});
 function render(){controls.replaceChildren();config=null;dim=false;if(page==='movelist')return;
  const content=document.createElement('div');content.style.cssText='position:absolute;inset:0;pointer-events:auto;clip-path:inset(140px 152px 36px round 12px 12px 40px 40px)';controls.append(content);
  const title=settingsArt('TSettings',0,-162,'Settings');content.append(title);
  if(page==='config'){
   const layer=document.createElement('div');layer.style.cssText='position:absolute;inset:0';content.append(layer);
   config=createKeyConfig(layer,bindings,{effect:name=>shell().audio.effect(name),dim:value=>{dim=value;title.style.filter=value?'brightness(.8)':''},back:()=>{dim=false;list.switchView('settings')}});layer.querySelector('[aria-live]').style.top='146px';return;
  }
  const box=document.createElement('div');box.style.cssText=settingsText+';position:absolute;top:268px;left:50%;translate:-50% 0;width:600px';
  for(const [key,label] of [['master','Master Volume'],['bgm','BGM Volume'],['sfx','SFX Volume']]){
   const row=document.createElement('label');row.style.cssText='display:flex;align-items:center;gap:24px;margin:16px 0';const caption=document.createElement('span'),input=document.createElement('input'),value=document.createElement('span');caption.textContent=label;caption.style.width='200px';input.type='range';input.min=0;input.max=100;input.value=shell().options[key];input.style.width='236px';input.ariaLabel=label;value.style.width='70px';value.textContent=input.value+'%';input.oninput=()=>{shell().options[key]=+input.value;value.textContent=input.value+'%';shell().saveOptions()};row.append(caption,input,value);box.append(row)
  }
  box.append(inputSwitchRow());content.append(box);
  const button=settingsArt('Config',-138,170,'Key Config',()=>{if(list.switchView('config'))shell().audio.effect('btn-click')});button.disabled=touchOnly();if(button.disabled)button.style.filter='grayscale(1)';content.append(button,settingsArt('Back',138,170,'Back to movelist',()=>list.switchView('movelist')));
 }
 function open(){if(!canPause()||list.active)return;page='movelist';config=null;pause();list.open(members());surface.hidden=false;render();play.firstChild.src=new URL('../Data/Movelist/Play.webp',import.meta.url);play.ariaLabel='Resume battle';toggle.hidden=false;shell().audio.effect('btn-click')}
 function close(){if(!list.active)return;list.close();dim=false;surface.hidden=true;toggle.hidden=true;controls.replaceChildren();config=null;dim=false;page='movelist';play.firstChild.src=new URL('../Data/Movelist/Pause.webp',import.meta.url);play.ariaLabel='Pause battle';resume();shell().audio.effect('btn-click')}
 return {ready:list.ready,open,close,get active(){return list.active},get view(){return page},key(event){if(config){config(event);return}if(event.code==='Enter'&&!event.repeat)close();else if(page==='movelist')list.key(event.code)}};
}
