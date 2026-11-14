export const settingsText='color:#fff;font: bold 22px "Arial Rounded MT Bold",Arial,sans-serif;text-shadow:0 0 10px #081450';
const artwork='../Data/Settings/';
export function settingsArt(name,x,y,label,action){
 const image=new Image();
 image.src=new URL(artwork+name+'.webp',import.meta.url);
 image.alt=action?'':label;
 const element=action?document.createElement('button'):image;
 element.style.cssText='position:absolute;left:'+(640+x)+'px;top:'+(360+y)+'px;transform:translate(-50%,-50%);border:0;padding:0;background:none';
 if(action){element.type='button';element.setAttribute('aria-label',label);element.append(image);image.style.display='block';element.onclick=action}
 return element;
}

const positions={l:[85,26,168,52],r:[292,26,168,52],up:[85,106,56,54],down:[85,220,56,54],
 left:[28,163,55,56],right:[142,163,55,56],a:[243,115,70,70],b:[341,115,70,70],x:[243,213,70,70],y:[341,213,70,70]};
const horizontal=[
 ['1l','1r','2l','2r'],['1up','1a','1b','2up','2a','2b'],
 ['1down','1x','1y','2down','2x','2y'],['1left','1right','1a','2left','2right','2a']
];
const vertical=[1,2].flatMap(p=>[['l','up','left','down'],['r','a','x'],['r','b','y'],['up','right','down']].map(row=>row.map(key=>p+key)));
const labels={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',NumpadDecimal:'N.',NumpadDivide:'N/',NumpadMultiply:'N*',NumpadAdd:'N+',NumpadSubtract:'N−'};
const keyText=code=>labels[code]??code.replace(/^Numpad/,'N').replace(/^(Key|Digit)/,'');

export function createKeyConfig(layer,bindings,{back,dim,effect}){
 const buttons=new Map(),titles=[],plates=[];
 let active=null,selected='1l',branch=null;
 const status=document.createElement('div');
 status.style.cssText=settingsText+';position:absolute;top:6px;width:100%;text-align:center;pointer-events:none';
 status.setAttribute('aria-live','polite');layer.append(status);
 function refresh(){
  const current=bindings.get();
  for(const [id,button] of buttons){
   button.textContent=keyText(current['p'+id[0]][id.slice(1)]);
   button.style.opacity=active?.8:1;
   button.style.boxShadow=id===selected?'0 0 12px '+(id[0]==='1'?'#5EDFFF':'#FF67BF'):'none';
  }
  for(let i=0;i<2;i++){
   titles[i].style.opacity=active&&active[0]!==String(i+1)?.8:1;
   plates[i].style.opacity=active?.8:1;
  }
  dim(!!active);
  status.textContent=active?'Press a key for '+active.slice(1).toUpperCase():'';
 }
 function begin(id){active=selected=id;effect('btn-click');refresh()}
 for(const [i,player] of [1,2].entries()){
  const group=document.createElement('div');
  group.style.cssText='position:absolute;width:376px;height:249px;left:'+(640+(i?288:-288)-188)+'px;top:'+(360+(i?-12.5:12.5)-124.5)+'px';
  const plate=new Image();plate.src=new URL(artwork+'Keys.webp',import.meta.url);plate.alt='';group.append(plate);plates.push(plate);
  for(const [key,[x,y,w,h]] of Object.entries(positions)){
   const id=player+key,button=document.createElement('button');button.type='button';
   button.setAttribute('aria-label','P'+player+' '+key.toUpperCase());
   button.style.cssText=settingsText+';position:absolute;left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;transform:translate(-50%,-50%);border:0;border-radius:'+(key.length===1&&key!=='l'&&key!=='r'?'50%':'12px')+';background:transparent;cursor:pointer';
   button.onclick=()=>{if(!active)begin(id)};group.append(button);buttons.set(id,button);
  }
  const title=document.createElement('span');title.textContent='P'+player;
  title.style.cssText=settingsText+';position:absolute;top:254px;left:'+(640+(i?41:-41))+'px;transform:translate(-50%,-50%)';titles.push(title);
  layer.append(group,title);
 }
 const cancel=()=>{effect('btn-back');if(active){active=null;refresh()}else back()};
 function commit(code){
  const player='p'+active[0],key=active.slice(1),next=structuredClone(bindings.get()),old=next[player][key];
  for(const [side,keys] of Object.entries(next))for(const [action,value] of Object.entries(keys))
   if(value===code&&(side!==player||action!==key))keys[action]=old;
  next[player][key]=code;
  if(bindings.save(next)){active=null;refresh()}
 }
 layer.append(settingsArt('Default',-138,188,'Default',()=>{
  effect('btn-click');
  if(active)commit(bindings.defaults['p'+active[0]][active.slice(1)]);
  else if(bindings.save(bindings.defaults))refresh();
 }),settingsArt('Back',138,188,'Back',cancel));
 refresh();
 return function handle(event){
  const code=event.code;
  if(code==='Escape'){if(!event.repeat)cancel();return}
  if(active){
   if(!event.repeat&&/^(Key[A-Z]|Digit[0-9]|Numpad(?:[0-9]|Decimal|Divide|Multiply|Add|Subtract)|Arrow(?:Left|Right|Up|Down))$/.test(code))commit(code);
   return;
  }
  if(code==='Enter'){if(!event.repeat){const target=event.target;if(target instanceof HTMLButtonElement&&layer.contains(target)&&!Array.from(buttons.values()).includes(target))target.click();else begin(selected)}return}
  if(!code.startsWith('Arrow'))return;
  const across=code==='ArrowLeft'||code==='ArrowRight';
  const rows=across?horizontal:vertical;
  const candidates=rows.filter(row=>row.includes(selected));
  const row=candidates.includes(branch)?branch:candidates[0];
  if(!row)return;
  const direction=code==='ArrowLeft'||code==='ArrowUp'?-1:1;
  selected=row[(row.indexOf(selected)+direction+row.length)%row.length];buttons.get(selected).focus();
  branch=row;effect('select');refresh();
 };
}
