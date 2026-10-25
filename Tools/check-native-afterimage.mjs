import assert from 'node:assert/strict';
import {createNativeAfterImage,setupNativeAfterImage,nativeAfterImageActive,recordNativeAfterImage,nativeAfterImageDraws,copyNativeAfterImageSettings,applyNativeAfterImageController} from '../Engine/native-afterimage.js';

const snapshot=t=>({source:t,args:[t,0],matrix:[1,0,0,1,t,0],priority:4});
{
 const state=createNativeAfterImage();Object.assign(state,{time:4,length:6,framegap:1,timegap:2});setupNativeAfterImage(state);
 const image=snapshot(1);recordNativeAfterImage(state,image);image.args[0]=999;image.matrix[4]=999;assert.equal(state.imgs[0].args[0],1);assert.equal(state.imgs[0].matrix[4],1);
 for(let tick=2;tick<=15;tick++)recordNativeAfterImage(state,snapshot(tick));assert.equal(state.reccount,8);assert.equal(nativeAfterImageActive(state),false);
 assert.deepEqual(state.palettes[1].add,[40,40,55]);assert.deepEqual(state.palettes[1].mul,[78,78,165]);
 state.time=-1;const draws=nativeAfterImageDraws(state,-10);assert.ok(draws.every(image=>image.priority<=-12));assert.ok(nativeAfterImageDraws(state,20).every(image=>image.priority<=-12));
 state.ignorehitpause=false;const before=state.timecount;recordNativeAfterImage(state,snapshot(16),{record:false,hitpause:true});assert.equal(state.timecount,before);
}
for(const ikemen of [false,true]){
 const state=createNativeAfterImage();Object.assign(state,{time:-1,length:12,framegap:3});setupNativeAfterImage(state,{ikemen});
 for(let tick=1;tick<=13;tick++)recordNativeAfterImage(state,snapshot(tick));
 assert.deepEqual(nativeAfterImageDraws(state,4,{ikemen}).map(image=>image.source),ikemen?[10,7,4,1]:[11,8,5]);
 const before=state.reccount;recordNativeAfterImage(state,snapshot(14),{record:false});assert.equal(state.reccount,before);
 recordNativeAfterImage(state,snapshot(15),{record:false,hitpause:true});assert.equal(state.reccount,before+1);
 const destination=createNativeAfterImage();destination.imgs=[snapshot(999)];destination.reccount=7;destination.lastTick=88;
 copyNativeAfterImageSettings(destination,state);assert.equal(destination.imgs[0].source,999);assert.equal(destination.reccount,7);assert.equal(destination.lastTick,88);assert.equal(destination.palettes[0],state.palettes[0]);assert.notEqual(destination.add,state.add);
 const fresh=copyNativeAfterImageSettings(null,state);assert.equal(fresh.imgs.length,1);assert.equal(fresh.palettes.length,1);assert.equal(fresh.reccount,0);
}
const owner={},warnings=[],reads=[];let current;
const api={evaluate:value=>{reads.push(value);return Number(value)},split:value=>String(value).split(','),findActor:id=>id===1?owner:null,get:()=>current,set:(_actor,state)=>current=state,ikemen:()=>false,mugen11:()=>true,warn:value=>warnings.push(value)};
applyNativeAfterImageController({type:'AfterImage',params:{time:-1,length:100,timegap:0,palbright:'1,2',palinvertall:1}},owner,api);
assert.equal(current.length,60);assert.equal(current.timegap,1);assert.deepEqual(current.base.add,[1,2,30]);assert.equal(current.base.invertblend,3);assert.equal(warnings.length,2);
current.timecount=9;const history=current.imgs;applyNativeAfterImageController({type:'AfterImageTime',params:{time:5,value:77}},owner,api);assert.equal(current.time,5);assert.equal(current.timecount,0);assert.equal(current.imgs,history);
applyNativeAfterImageController({type:'AfterImageTime',params:{value:1}},owner,api);assert.equal(current.time,0);
reads.length=0;applyNativeAfterImageController({type:'AfterImage',params:{redirectid:99,time:'unreachable'}},owner,api);assert.deepEqual(reads,[99]);
current=null;reads.length=0;applyNativeAfterImageController({type:'AfterImageTime',params:{time:'unreachable'}},owner,api);assert.deepEqual(reads,[]);
console.log('Native AfterImage history, version sampling, pause, configuration sync and controller checks passed');
