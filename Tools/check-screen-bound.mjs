import assert from 'node:assert/strict';
import {createScreenBoundFlags,applyScreenBoundController,screenBoundInterval} from '../Engine/screen-bound.js';
const owner={flags:createScreenBoundFlags()},api={evaluate:Number,findActor:id=>id===2?owner:null,flags:actor=>actor.flags,split:value=>String(value).split(',')};
applyScreenBoundController({type:'ScreenBound',params:{}},owner,api);assert.deepEqual(owner.flags,{screenBound:false,stageBound:true,moveCamera:[false,false]});
applyScreenBoundController({type:'ScreenBound',params:{redirectid:2,value:1,movecamera:-1,stagebound:0}},{},api);assert.deepEqual(owner.flags,{screenBound:true,stageBound:false,moveCamera:[true,false]});
assert.deepEqual(screenBoundInterval(owner.flags,{left:-100,right:100},{left:-50,right:50},{left:10,right:20}),{left:-90,right:80});
owner.flags.screenBound=false;assert.deepEqual(screenBoundInterval(owner.flags,{left:-100,right:100},{left:-50,right:50}),{left:-Infinity,right:Infinity});
assert.deepEqual(createScreenBoundFlags(false),{screenBound:false,stageBound:true,moveCamera:[false,false]});
console.log('ScreenBound native defaults, redirected booleans, optional stage flag and intervals passed');

