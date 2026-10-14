import assert from 'node:assert/strict';
import {applyHeightController} from '../Engine/height-controller.js';
const root={coord:320},other={coord:640},api={evaluate:Number,findActor:id=>id===2?other:null,localCoord:actor=>actor.coord,split:value=>String(value).split(','),write:(actor,value)=>{actor.height=value}};
applyHeightController({type:'Height',params:{value:'10'}},root,api);assert.deepEqual(root.height,[10,0]);
applyHeightController({type:'Height',params:{redirectid:2,value:'-10,20'}},root,api);assert.deepEqual(other.height,[-20,40]);
applyHeightController({type:'Height',params:{redirectid:99,value:'bad'}},root,api);assert.deepEqual(root.height,[10,0]);
assert.throws(()=>applyHeightController({type:'Height',params:{}},root,api),/Missing Height/);
console.log('Height float pair/default bottom, redirection/localcoord ratio and missing recipient passed');
