import assert from 'node:assert/strict';
import {applyTransformSprite} from '../Engine/transform-sprite.js';

const caller={scale:4,window:[0,0,0,0]},target={scale:1,window:[0,0,0,0]},reads=[];
const api={evaluate:expression=>{reads.push([expression,[...target.window]]);return expression==='target'?7:Number(expression)},findActor:id=>id===7?target:null,split:value=>value.split(','),localScale:actor=>actor.scale,window:actor=>actor.window};
assert.equal(applyTransformSprite({type:'TransformSprite',params:{redirectid:'target',window:'1,2,3,4'}},caller,api),true);
assert.deepEqual(target.window,[4,8,12,16]);assert.deepEqual(reads.map(row=>row[0]),['target','1','2','3','4']);assert.deepEqual(reads[2][1],[4,0,0,0]);
reads.length=0;applyTransformSprite({type:'TransformSprite',params:{redirectid:'99',window:'1,2,3,4'}},caller,api);assert.deepEqual(reads.map(row=>row[0]),['99']);
const warnings=[];applyTransformSprite({type:'TransformSprite',params:{window:'1,2'}},caller,{...api,warn:value=>warnings.push(value)});assert.deepEqual(warnings,['invalid TransformSprite window']);
assert.deepEqual(caller.window,[0,0,0,0]);
assert.throws(()=>applyTransformSprite({type:'TransformSprite',params:{projection:'1'}},caller,api),/not implemented/);
assert.throws(()=>applyTransformSprite({type:'TransformSprite',params:{}},caller,api),/at least one/);
assert.equal(applyTransformSprite({type:'Null'},caller,api),false);
console.log('TransformSprite windows preserve redirected scaling, original caller evaluation, sequential writes and explicit unsupported branches');
applyTransformSprite({type:'TransformSprite',params:{redirectid:'target',xshear:'0.1'}},caller,{...api,setShear:(actor,value)=>actor.xshear=value});
assert.equal(target.xshear,Math.fround(.1));assert.equal(caller.xshear,undefined);
