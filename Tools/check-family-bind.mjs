import assert from 'node:assert/strict';
import {applyFamilyBindController} from '../Engine/family-bind.js';
const root={},parent={},caller={scale:2},helper={scale:1,bindFacing:-1};let binding;
const api={evaluate:Number,findActor:id=>id===9?helper:null,localScale:actor=>actor.scale,split:value=>String(value).split(','),root:actor=>actor===helper?root:null,parent:actor=>actor===helper?parent:null,setFacing:(actor,value)=>{actor.bindFacing=value},getFacing:actor=>actor.bindFacing??0,bind:(actor,binder,settings)=>{binding={binder,...settings}}};
applyFamilyBindController({type:'BindToRoot',params:{redirectid:9,pos:'4,8,12'}},caller,api);assert.equal(binding.binder,root);assert.deepEqual(binding.position,[8,16,24]);assert.equal(binding.time,1);assert.equal(binding.facing,-1);
applyFamilyBindController({type:'BindToParent',params:{redirectid:9,facing:0,time:-1}},caller,api);assert.equal(binding.binder,parent);assert.equal(binding.facing,-1);assert.equal(binding.time,-1);
applyFamilyBindController({type:'BindToParent',params:{redirectid:9,facing:3}},caller,api);assert.equal(binding.facing,1);
const previous=binding;applyFamilyBindController({type:'BindToRoot',params:{redirectid:999}},caller,api);assert.equal(binding,previous);
console.log('Family bindings defaults, redirected scale, root/parent and persistent facing passed');
const seen=[];applyFamilyBindController({type:'BindToRoot',params:{redirectid:9,time:2,facing:-1,pos:'4,8'}},caller,{...api,evaluate:value=>{seen.push(value);return Number(value)}});assert.deepEqual(seen,[9,2,-1,'4','8']);

