import {createDeclarationFlow} from './declaration-flow.js?v=02408r7';
import {createQuotePortrait,quoteDuration} from './quote-animation.js?v=02408r12';
export function createDeclarationScreen(api){
 const portraits=[createQuotePortrait(),createQuotePortrait()];let variants=[],active=false,preparedPlayers=[];
 const ready=Promise.all(portraits.map(p=>p.ready));
 async function prepare(players){await Promise.all(players.map(async(character,index)=>{await portraits[index].select(character);await portraits[index].prepare('all')}));preparedPlayers=[...players]}
 const flow=createDeclarationFlow({variant:player=>variants[player-1],voiceTick:player=>portraits[player-1].tick,startVoice:player=>portraits[player-1].set(variants[player-1].id),play:()=>{},playing:()=>portraits.some(p=>p.playing),complete:()=>{active=false;api.complete()}});
 function begin(players,options={}){
  if(players.some((c,i)=>preparedPlayers[i]!==c))throw Error('Selected portrait declarations were not prepared');
  variants=players.map((c,index)=>{const actions=portraits[index].manifest.actions;let ids=options.result?(options.winner===index+1?['9020','9021']:options.reason==='time'?['9040','9041']:['9030','9031']):['9011','9012'];ids=ids.filter(id=>actions[id]);if(!ids.length)ids=['9030','9031'].filter(id=>actions[id]);const id=ids[Math.floor(Math.random()*ids.length)];return {id,cues:[],duration:quoteDuration(actions[id])}});
  portraits.forEach(p=>p.set(options.result?'9019':'9010'));active=true;flow.begin(options);api.start?.();
 }
 function reset(){active=false;portraits.forEach(p=>p.stop());flow.reset()}
 function draw(context){if(!active&&flow.snapshot().phase!=='done')return;const{ticks,result,winner,movement,loserOpacity}=flow.snapshot(),progress=Math.min(1,ticks/90),ease=1-(1-progress)**3;
  portraits.forEach((p,index)=>{const center=result?(index?1000:280):(index?1000+(1-ease)*450:280-(1-ease)*450),vertical=360+(result?60:0)+(result&&winner?(index+1===winner?-60:60)*movement:0);p.draw(context,center-640,vertical-360,1280,720,(result?1:progress)*(result&&winner&&index+1!==winner?loserOpacity:1),index?-1:1)});
  const fade=flow.fade();if(fade){context.save();context.globalAlpha=fade;context.fillStyle='black';context.fillRect(0,0,1280,720);context.restore()}
 }
 function step(){if(!active)return;portraits.forEach(p=>p.step(1,audio=>api.sound?api.sound(audio):audio));flow.step()}
 return {ready,prepare,begin,reset,draw,step,opacity:flow.acsOpacity,active:()=>active,snapshot:()=>({...flow.snapshot(),active,variants:variants.map(v=>v.id),portraits:portraits.map(p=>p.snapshot())})};
}
