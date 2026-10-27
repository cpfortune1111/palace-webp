import assert from 'node:assert/strict';
import {applyScreenBoundController,createScreenBoundFlags} from '../Engine/screen-bound.js';
import {applyDepthBoundController,createDepthBoundFlags} from '../Engine/depth-bound.js';
import {applyPosFreezeController} from '../Engine/pos-freeze.js';
import {applyPlayerPushController,createPlayerPushState} from '../Engine/player-push.js';

for(const [operand,expected] of [['1',false],['text',false],[NaN,false],[undefined,false],[0,false],[0.5,true],[-1,true],[Infinity,true]]){
 const actor={};
 const screen=createScreenBoundFlags(),depth=createDepthBoundFlags(),push=createPlayerPushState();
 const api={evaluate:()=>operand,split:value=>String(value).split(','),findActor:()=>null};
 applyScreenBoundController({type:'ScreenBound',params:{value:'operand',movecamera:'operand,operand',stagebound:'operand'}},actor,{...api,flags:()=>screen});
 assert.deepEqual(screen,{screenBound:expected,stageBound:expected,moveCamera:[expected,expected]});
 applyDepthBoundController({type:'DepthBound',params:{value:'operand',movecamera:'operand'}},actor,{...api,flags:()=>depth});
 assert.deepEqual(depth,{enabled:expected,moveCamera:expected});
 applyPosFreezeController({type:'PosFreeze',params:{value:'operand'}},actor,{...api,set:(owner,value)=>{owner.frozen=value}});
 assert.equal(actor.frozen,expected);
 applyPlayerPushController({type:'PlayerPush',params:{value:'operand'}},actor,{...api,state:()=>push});
 assert.equal(push.enabled,expected);
}
let reads=0;
const actor={},screen=createScreenBoundFlags(),depth=createDepthBoundFlags(),api={evaluate:value=>{reads++;return Number(value)},split:value=>String(value).split(',')};
applyScreenBoundController({type:'ScreenBound',params:{}},actor,{...api,flags:()=>screen});
assert.deepEqual(screen,{screenBound:false,stageBound:true,moveCamera:[false,false]});
applyDepthBoundController({type:'DepthBound',params:{}},actor,{...api,flags:()=>depth});
assert.deepEqual(depth,{enabled:false,moveCamera:false});
applyPosFreezeController({type:'PosFreeze',params:{}},actor,{...api,set:(owner,value)=>{owner.frozen=value}});
assert.equal(actor.frozen,true);
assert.equal(reads,2);
console.log('ScreenBound/DepthBound/PosFreeze/PlayerPush boolean extraction rejects strings/undefined and retains distinct omitted defaults');
for(const [type,apply] of [['ScreenBound',applyScreenBoundController],['DepthBound',applyDepthBoundController],['PosFreeze',applyPosFreezeController],['PlayerPush',applyPlayerPushController]])for(const operand of ['2',NaN,undefined]){
 const ids=[],reads=[];
 apply({type,params:{redirectid:'redirect',value:'rhs'}},{},{evaluate:expression=>{reads.push(expression);return expression==='redirect'?operand:1},findActor:id=>{ids.push(id);return null}});
 assert.deepEqual(ids,[0]);
 assert.deepEqual(reads,['redirect']);
}
for(const operand of ['7',NaN,undefined]){
 const state=createPlayerPushState();
 applyPlayerPushController({type:'PlayerPush',params:{priority:'operand'}},{},{evaluate:()=>operand,state:()=>state});
 assert.equal(state.priority,0);
 assert.equal(state.enabled,true);
}
