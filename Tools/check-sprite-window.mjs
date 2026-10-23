import assert from 'node:assert/strict';
import {compileSpriteWindow,spriteWindowRect} from '../Engine/sprite-window.js';

const reads=[],warnings=[],api={split:value=>value.split(','),evaluate:value=>{reads.push(value);return Number(value)},warn:value=>warnings.push(value)};
assert.equal(compileSpriteWindow(undefined,api),null);assert.deepEqual(reads,[]);
assert.equal(compileSpriteWindow('1,2,3',api),null);assert.deepEqual(reads,[]);assert.deepEqual(warnings,['invalid explod window']);
assert.throws(()=>compileSpriteWindow('1,2,3,4,5',api),/four/);
assert.deepEqual(compileSpriteWindow('1,2,3,4',api),[1,2,3,4]);assert.deepEqual(reads,['1','2','3','4']);
assert.deepEqual(compileSpriteWindow('a,b,c,d',{...api,evaluate:()=> '12'}),[0,0,0,0]);
assert.equal(spriteWindowRect([0,0,0,0],{origin:[9,9],scale:[2,2]}),null);
assert.deepEqual(spriteWindowRect([10,20,-10,-20],{origin:[100,200],scale:[-2,3],pixelRatio:2}),{x:160,y:280,width:80,height:240});
assert.deepEqual(spriteWindowRect([-.9,-.9,.9,.9],{origin:[0,0],scale:[1,1]}),{x:0,y:0,width:1,height:1});
assert.deepEqual(spriteWindowRect([1,1,1,3],{origin:[0,0],scale:[1,1]}),{x:1,y:1,width:0,height:2});
console.log('Sprite windows preserve four-value extraction, zero sentinel, facing, sorted corners and native-style integer rectangles');
