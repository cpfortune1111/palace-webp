import assert from 'node:assert/strict';
import {applyBindToTargetController} from '../Engine/bind-to-target.js';
import {createTargetList} from '../Engine/target-list.js';
const owner={x:0,y:99,facing:1},target={x:100,y:20,facing:-1,getHit:{hitid:7}},targets=createTargetList();targets.add(2);let binding;
const api={evaluate:Number,findActor:id=>id===2?target:undefined,targets:()=>targets,localScale:()=>1,localCoord:()=>320,split:value=>String(value).split(','),anchor:()=>[4,-10],move:(actor,position)=>{[actor.x,actor.y]=position},bind:(target,owner,settings)=>{binding=settings}};
applyBindToTargetController({type:'BindToTarget',params:{}},owner,api);assert.deepEqual([owner.x,owner.y],[100,99]);assert.deepEqual(binding.position,[0,-79,0]);assert.equal(binding.time,1);
applyBindToTargetController({type:'BindToTarget',params:{id:7,pos:'8,12,head',time:-1}},owner,api);assert.deepEqual([owner.x,owner.y],[88,22]);assert.deepEqual(binding.position,[12,-2,0]);assert.equal(binding.time,-1);
assert.throws(()=>applyBindToTargetController({type:'BindToTarget',params:{pos:'0,0,bad'}},owner,api),/Invalid/);
console.log('BindToTarget first target, default NaN axes, head offsets and reciprocal binding passed');
owner.z=0;target.z=30;owner.scale=1;target.scale=4;
const scaledCaller={scale:2};
applyBindToTargetController({type:'BindToTarget',params:{redirectid:1,id:7,pos:'8,12,foot',posz:4,time:0}},scaledCaller,{...api,findActor:id=>id===1?owner:id===2?target:null,localScale:actor=>actor.scale,move:(actor,position)=>{[actor.x,actor.y,actor.z]=position}});
assert.deepEqual([owner.x,owner.y,owner.z],[384,104,128]);assert.deepEqual(binding.position,[4,13.5,22]);assert.equal(binding.time,0);
const previous=binding;applyBindToTargetController({type:'BindToTarget',params:{id:999}},owner,api);assert.equal(binding,previous);
applyBindToTargetController({type:'BindToTarget',params:{redirectid:999}},owner,api);assert.equal(binding,previous);
assert.throws(()=>applyBindToTargetController({type:'BindToTarget',params:{id:999,pos:'0,0,bad'}},owner,api),/Invalid/);
applyBindToTargetController({type:'BindToTarget',params:{pos:'8,12,head'}},owner,{...api,localCoord:()=>640});assert.deepEqual([owner.x,owner.y],[90,27]);
const seen=[];applyBindToTargetController({type:'BindToTarget',params:{id:999,pos:'8,12,foot',posz:4}},owner,{...api,evaluate:value=>{seen.push(value);return Number(value)}});assert.deepEqual(seen,[999,'8','12',4]);

