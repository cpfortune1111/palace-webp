import {createDeclarationFlow} from './declaration-flow.js?v=02377';
import {createQuotePortrait,preloadQuoteAssets,quoteDuration} from './quote-animation.js?v=02377';
export function createDeclarationScreen(api){
 const portraits=[createQuotePortrait(),createQuotePortrait()];let assets,variants=[],active=false;
 const ready=Promise.all([preloadQuoteAssets(),...portraits.map(portrait=>portrait.ready)]).then(([value])=>{assets=value});
 const flow=createDeclarationFlow({variant:player=>variants[player-1],playing:()=>portraits.some(portrait=>portrait.playing),play:()=>{},startVoice:player=>{const portrait=portraits[player-1];portrait.set(variants[player-1].id);portrait.step(0,audio=>api.sound?api.sound(audio):audio)},complete:()=>{active=false;api.complete()}});
 function begin(players,options={}){if(players.some(identifier=>identifier!=='SailorVenus'))throw Error('Quote animation unavailable');variants=players.map((identifier,index)=>{const available=options.result?(options.winner===index+1?['9020','9021']:['9030','9031']):['9011','9012'],id=available[Math.floor(Math.random()*available.length)];return {id,cues:[],duration:quoteDuration(assets.manifest.actions[id])}});portraits.forEach(portrait=>portrait.set(options.result?'9019':'9010'));active=true;flow.begin(options);api.start?.()}
 function reset(){active=false;portraits.forEach(portrait=>portrait.stop());flow.reset()}
 function draw(context){if(!active&&flow.snapshot().phase!=='done')return;const {ticks,result,winner,movement,loserOpacity}=flow.snapshot(),progress=Math.min(1,ticks/90),ease=1-(1-progress)**3;portraits.forEach((portrait,index)=>{const center=result?(index?1000:280):(index?1000+(1-ease)*450:280-(1-ease)*450),vertical=360+(result?60:0)+(result&&winner?(index+1===winner?-60:60)*movement:0);portrait.draw(context,center-640,vertical-360,1280,720,(result?1:progress)*(result&&winner&&index+1!==winner?loserOpacity:1),index?-1:1)});const fade=flow.fade();if(fade){context.save();context.globalAlpha=fade;context.fillStyle='black';context.fillRect(0,0,1280,720);context.restore()}}
 function step(){if(!active)return;portraits.forEach(portrait=>portrait.step(1,audio=>api.sound?api.sound(audio):audio));flow.step()}
 return {ready,begin,reset,draw,step,opacity:flow.acsOpacity,active:()=>active,snapshot:()=>({...flow.snapshot(),active,variants:variants.map(variant=>variant.id),portraits:portraits.map(portrait=>portrait.snapshot())})};
}

