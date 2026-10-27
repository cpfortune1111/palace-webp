import assert from 'node:assert/strict';
import {applyPositionController} from '../Engine/position-controllers.js';

const caller={x:10,y:20,facing:1,localScale:2},target={x:0,y:0,facing:-1,localScale:1,groundLevel:10,platformY:2};
const api={evaluate:value=>value==='caller'?caller.x:Number(value),findActor:id=>id===7?target:null,cameraX:250};
const run=(type,params)=>applyPositionController({type,params},caller,api);
run('PosSet',{redirectid:'7',x:'caller',y:'3'});assert.deepEqual([target.x,target.y],[270,18]);
run('PosAdd',{redirectid:'7',x:'5',y:'-2'});assert.deepEqual([target.x,target.y],[260,14]);
run('PosSet',{x:'5'});assert.deepEqual([caller.x,caller.y],[130,20]);
run('PosSet',{redirectid:'99',x:'100'});assert.equal(caller.x,130);
run('PosAdd',{y:'0.1'});assert.equal(caller.y,Math.fround(20+Math.fround(0.1)));
assert.equal(run('Null',{}),false);
run('PosSet',{z:'1'});assert.equal(caller.z,1);
run('PosSet',{redirectid:7,z:'3'});assert.equal(target.z,6);
run('PosAdd',{redirectid:7,z:'-2'});assert.equal(target.z,2);
console.log('Position camera/ground origins, caller evaluation, redirection, facing and local scale passed');
