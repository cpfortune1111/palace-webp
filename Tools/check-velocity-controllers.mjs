import assert from 'node:assert/strict';
import {applyVelocityController} from '../Engine/velocity-controllers.js';

const caller={vx:2,vy:3,localScale:2},target={vx:4,vy:5,localScale:1};
const api={evaluate:value=>value==='caller'?caller.vx:Number(value),findActor:id=>id===7?target:null};
const run=(type,params)=>applyVelocityController({type,params},caller,api);
run('VelSet',{x:'6'});assert.deepEqual([caller.vx,caller.vy],[6,3]);
run('VelAdd',{redirectid:'7',x:'caller',y:'-2'});assert.deepEqual([target.vx,target.vy],[16,1]);
run('VelMul',{redirectid:'7',x:'0.5',y:'3'});assert.deepEqual([target.vx,target.vy],[8,3]);
run('VelSet',{redirectid:'99',x:'100'});assert.equal(caller.vx,6);
run('VelSet',{y:'0.1'});assert.equal(caller.vy,Math.fround(0.1));
assert.equal(run('Null',{}),false);
assert.throws(()=>run('VelSet',{z:'1'}),/Z physics/);
console.log('Velocity caller evaluation, redirection, local scale, float32 and omitted axes passed');
