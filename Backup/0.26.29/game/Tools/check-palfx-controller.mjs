import assert from 'node:assert/strict';
import {createPalFxDefinition,evaluatePalFxDefinition,applyPalFxController} from '../Engine/palfx-controller.js';

assert.equal(createPalFxDefinition().time,0);
const result=evaluatePalFxDefinition({time:-1,color:128,hue:256,add:'1,2,3',mul:'256,128,512',sinadd:'10,20,30,-60',sincolor:'40,-30',invertall:-0.5,invertblend:99},Number,{mugen11:true});
assert.equal(result.time,-1);assert.equal(result.color,0.5);assert.equal(result.hue,0.5);
assert.deepEqual(result.sinadd,[-10,-20,-30]);assert.equal(result.sincolor,-40);assert.deepEqual(result.cycleTime,[60,0,30,0]);
assert.equal(result.invertall,true);assert.equal(result.invertblend,2);
assert.equal(evaluatePalFxDefinition({},Number,{mugen11:true}).invertblend,-2);
assert.throws(()=>evaluatePalFxDefinition({mul:'1,2'},Number),/not enough/);
assert.throws(()=>evaluatePalFxDefinition({sincolor:'10'},Number),/not enough/);
const caller={},target={},evaluated=[];
const api={evaluate:value=>{evaluated.push(value);return Number(value)},findActor:id=>id===2?target:null,ownsPalette:actor=>actor===target,set:(actor,value)=>actor.palfx=value};
applyPalFxController({type:'PalFX',params:{time:10}},caller,api);assert.deepEqual(evaluated,[]);
applyPalFxController({type:'PalFX',params:{redirectid:2,time:10,sincolor:'20,-60'}},caller,api);
assert.deepEqual(evaluated,[2,10,'-60','-60','20']);assert.equal(target.palfx.sincolor,-20);
console.log('PalFX native defaults, signed cycles, scaling and inversion parameter policy passed');