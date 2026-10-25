import assert from 'node:assert/strict';
import {deferModifyExplodWindow,readModifyExplodGeometry} from '../Engine/modify-explod-geometry.js';
import {applyModifyExplodController} from '../Engine/modify-explod.js';

const reads=[],warnings=[],api={evaluate:value=>{reads.push(value);return value==='text'?'7':Number(value)},split:value=>value.split(','),warn:value=>warnings.push(value)};
assert.deepEqual(readModifyExplodGeometry({angle:'.1',yangle:'20',xangle:'30',xshear:'text'},api),{angle:Math.fround(.1),yangle:20,xangle:30,xshear:0});assert.deepEqual(reads,['.1','20','30','text']);
reads.length=0;const write=deferModifyExplodWindow('1,2,3,4',{...api,scale:.5});assert.deepEqual(reads,[]);assert.deepEqual(write(),[.5,1,1.5,2]);assert.deepEqual(reads,['1','2','3','4']);
reads.length=0;assert.equal(deferModifyExplodWindow('1,2,3',api),null);assert.deepEqual(reads,[]);assert.deepEqual(warnings,['invalid explod window']);assert.throws(()=>deferModifyExplodWindow('1,2,3,4,5',api),/four/);
const visible=[0,0,0,0],sequential=deferModifyExplodWindow('first,previous,previous,previous',{split:api.split,evaluate:value=>value==='first'?1:visible.reduce((sum,value)=>sum+value,0)+1});assert.deepEqual(sequential((axis,value)=>{visible[axis]=value}),[1,2,4,8]);assert.deepEqual(visible,[1,2,4,8]);
const caller={scale:2},owner={scale:4},effects=[{},{}],order=[];let sample=0;
const live={evaluate:value=>{order.push(value);return value==='window'?++sample:Number(value)},split:api.split,findActor:()=>owner,localScale:actor=>actor.scale,ikemenVersion:()=>true,select:(actor,id,index)=>{assert.equal(actor,owner);assert.equal(id,7);assert.equal(index,0);return effects},modify:(effect,actor,changes)=>{effect.geometry=changes.geometry;effect.window=changes.windowWrite()}};
applyModifyExplodController({type:'ModifyExplod',params:{redirectid:'2',index:'0',id:'7',window:'window,window,window,window',angle:'10',yangle:'20',xangle:'30',xshear:'.25',ignorehitpause:'1'}},caller,live);
assert.deepEqual(order,['2','0','7','10','20','30','.25','1',...Array(8).fill('window')]);assert.deepEqual(effects.map(effect=>effect.window),[[.5,1,1.5,2],[2.5,3,3.5,4]]);
order.length=0;applyModifyExplodController({type:'ModifyExplod',params:{redirectid:'2',index:'0',id:'7',vel:'4',velocity:'99'}},caller,{...live,modify:(effect,actor,changes)=>{assert.deepEqual(changes.velocity,[2])}});assert.deepEqual(order,['2','0','7','4']);
order.length=0;applyModifyExplodController({type:'ModifyExplod',params:{window:'window,window,window,window',angle:'10'}},caller,{...live,select:()=>[],modify:()=>{throw Error('No matches')}});assert.deepEqual(order,[]);
console.log('ModifyExplod geometry uses float32, compiler selector/velocity order and per-effect deferred redirected window evaluation after scalar reads');
