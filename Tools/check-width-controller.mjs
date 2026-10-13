import assert from 'node:assert/strict';
import {applyWidthController,createWidthModifiers,widthWorldExtents} from '../Engine/width-controller.js';
const caller={localCoord:640},owner={localCoord:320,width:createWidthModifiers()},api={evaluate:Number,findActor:id=>id===2?owner:null,localCoord:actor=>actor.localCoord,split:value=>String(value).split(','),write:(actor,field,value)=>{actor.width[field]=value}};
applyWidthController({type:'Width',params:{redirectid:2,value:'8,12'}},caller,api);assert.deepEqual(owner.width,{player:[4,6],edge:[4,6]});
applyWidthController({type:'Width',params:{redirectid:2,edge:20,player:'4,8',value:'invalid'}},caller,api);assert.deepEqual(owner.width,{player:[2,4],edge:[10,0]});
assert.deepEqual(widthWorldExtents(40,30,-1,owner.width.player),{left:42,right:34});
assert.deepEqual(widthWorldExtents(40,30,1,[-80,0]),{left:40,right:-30});
assert.deepEqual(widthWorldExtents(0,0,1,[-20,-10],false),{left:-10,right:-20});
assert.throws(()=>applyWidthController({type:'Width',params:{}},caller,api),/Missing/);
const previous=owner.width;applyWidthController({type:'Width',params:{redirectid:999,value:10}},caller,api);assert.equal(owner.width,previous);
console.log('Width defaults, float32 redirection, native precedence and facing extents passed');

