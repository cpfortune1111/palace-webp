import assert from 'node:assert/strict';
import {readModifyExplodAnimation} from '../Engine/modify-explod-animation-reference.js';
import {applyModifyExplodController} from '../Engine/modify-explod.js';

const order=[],api={ikemen:true,evaluate:value=>{order.push(value);return value==='prefix'?'F':value==='"S"'?'S':Number(value)},split:value=>value.split(',')};
assert.deepEqual(readModifyExplodAnimation({anim:'F120',animplayerno:'2',spriteplayerno:'1'},api),{action:120,prefix:'f',animationPlayer:2,spritePlayer:1});assert.deepEqual(order,['2','1','120']);
order.length=0;assert.deepEqual(readModifyExplodAnimation({anim:'prefix, 40.9'},api),{action:40,prefix:'f',animationPlayer:0,spritePlayer:0});assert.deepEqual(order,[' 40.9','prefix']);
order.length=0;assert.deepEqual(readModifyExplodAnimation({anim:'"S",0'},api),{action:0,prefix:'s',animationPlayer:0,spritePlayer:0});assert.deepEqual(order,['0','"S"']);
order.length=0;assert.equal(readModifyExplodAnimation({anim:'prefix, 40',animplayerno:'2',spriteplayerno:'1'},{...api,ikemen:false}),null);assert.deepEqual(order,['2','1']);
assert.deepEqual(readModifyExplodAnimation({anim:'-1'},api),{action:-1,prefix:'',animationPlayer:0,spritePlayer:0});
assert.throws(()=>readModifyExplodAnimation({anim:'1,0'},api),/requires a string/);
assert.throws(()=>readModifyExplodAnimation({anim:'F1,0'},api),/Invalid/);
order.length=0;const writes=[];applyModifyExplodController({type:'ModifyExplod',params:{animplayerno:'2',spriteplayerno:'1'}},{},{...api,ikemenVersion:()=>true,localScale:()=>1,select:()=>[{}],modify:changes=>writes.push(changes)});assert.deepEqual(order,['2','1']);assert.deepEqual(writes,[]);
console.log('ModifyExplod animation references preserve action-before-dynamic-prefix evaluation, player operand order, standalone selectors and MUGEN animation lock');
