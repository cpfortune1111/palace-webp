import assert from 'node:assert/strict';
import {changeAnimationReference} from '../Engine/change-animation-reference.js';
const order=[],api={split:value=>value.split(','),evaluate:value=>{order.push(value);return value.trim()==='"S"'?'S':value.trim()==='""'?'':Number(value)}};
assert.deepEqual(changeAnimationReference('S 40',api),{prefix:'s',action:40});assert.deepEqual(order,[' 40']);
order.length=0;assert.deepEqual(changeAnimationReference('"S",40.9',api),{prefix:'s',action:40});assert.deepEqual(order,['"S"','40.9']);
order.length=0;assert.deepEqual(changeAnimationReference('"S",40.9',{...api,actionFirst:true}),{prefix:'s',action:40});assert.deepEqual(order,['40.9','"S"']);
assert.deepEqual(changeAnimationReference('"",-2',api),{prefix:'',action:-2});assert.deepEqual(changeAnimationReference('F120',api),{prefix:'f',action:120});
assert.throws(()=>changeAnimationReference('S1,2',api),/Invalid/);assert.throws(()=>changeAnimationReference('1,2',api),/must be a string/);assert.throws(()=>changeAnimationReference('S1,',api),/Invalid/);
console.log('ChangeAnim own/literal/dynamic prefix syntax, typed action and prefix-before-number evaluation pass');
