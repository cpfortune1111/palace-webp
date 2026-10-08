import {assetUrl} from './asset-paths.js?v=02362';
export function createMenuAudio(home,settings){
 const ambient=new Audio(),effects={};ambient.loop=true;let context='',homeGain=0,homeTarget=0,ambientGain=0,ambientTarget=0;
 const names=['logo','select-mode','select-settings','btn-click','btn-back','acs-add','acs-minus','select'];
 const ready=Promise.all([...names.map(async name=>{const response=await fetch(assetUrl('./Data/Sound/'+name+'.mp3'));if(!response.ok)throw Error('Sound '+name);effects[name]=URL.createObjectURL(await response.blob())}),fetch(assetUrl('./Data/Sound/BGM-report.mp3')).then(async response=>{if(!response.ok)throw Error('Selection music');ambient.src=URL.createObjectURL(await response.blob());ambient.load()})]);
 function volume(){const options=settings(),gain=options.master*options.bgm/10000;home.volume=gain*homeGain;ambient.volume=gain*ambientGain}
 function play(track){track.play().catch(()=>{})}
 function effect(name){if(!effects[name])return;const clip=new Audio(effects[name]),options=settings();clip.volume=options.master*options.sfx/10000;play(clip)}
 function begin(next){if(context===next&&ambientTarget===1)return;context=next;ambient.currentTime=0;ambientGain=0;ambientTarget=1;volume();play(ambient)}
 function step(seconds){const move=(value,target)=>value<target?Math.min(target,value+seconds*2):Math.max(target,value-seconds*2);homeGain=move(homeGain,homeTarget);ambientGain=move(ambientGain,ambientTarget);volume();if(!homeGain&&!homeTarget)home.pause();if(!ambientGain&&!ambientTarget)ambient.pause()}
 return {ready,effect,volume,step,homeStart(){homeTarget=1;volume();if(home.paused)play(home)},fadeHomeOut(){homeTarget=0},beginSelection(){begin('selection')},beginReport(){begin('report')},fadeAmbientOut(){ambientTarget=0},retry(){if(homeTarget&&home.paused)play(home);if(ambientTarget&&ambient.paused)play(ambient)},snapshot:()=>({context,homeGain,homeTarget,ambientGain,ambientTarget,time:ambient.currentTime})};
}

