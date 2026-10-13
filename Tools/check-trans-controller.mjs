import assert from 'node:assert/strict';
import {compileTransParameters,applyTransController} from '../Engine/trans-controller.js';

assert.deepEqual(compileTransParameters({trans:'add1'}),{type:'add',alpha:[255,128]});
assert.deepEqual(compileTransParameters({trans:'addalpha',alpha:'12'}),{type:'add',alpha:['12',0]});
assert.deepEqual(compileTransParameters({trans:'sub',alpha:'12,34'},{mugen:true}),{type:'sub',alpha:[255,255]});
assert.deepEqual(compileTransParameters({trans:'sub',alpha:'12,34'}),{type:'sub',alpha:['12','34']});
assert.throws(()=>compileTransParameters({alpha:'12,34'}),/without trans/);
assert.equal(compileTransParameters({trans:'invalid'},{strict:false}),null);
const caller={},target={},evaluated=[];
applyTransController({type:'Trans',params:{redirectid:'2.9',trans:'addalpha',alpha:'300.9,-4'}},caller,{evaluate:value=>{evaluated.push(value);return Number(value)},findActor:id=>id===2?target:null,set:(actor,value)=>actor.trans=value});
assert.deepEqual(target.trans,{type:'add',alpha:[255,0]});
assert.deepEqual(evaluated,['2.9','300.9','-4']);
assert.equal(caller.trans,undefined);
console.log('Trans defaults, Mugen sub locking, strict validation and redirected clamped alpha passed');