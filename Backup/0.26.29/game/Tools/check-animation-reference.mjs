import assert from 'node:assert/strict';
import {compileAnimationReference} from '../Engine/animation-reference.js';

const order=[],api={split:source=>source.split(','),evaluate:source=>{order.push(source);const text=source.trim();return text.startsWith('"')?JSON.parse(text):text==='fvar(0)'?45:text==='var(0)'?46:Number(text)}};
assert.deepEqual(compileAnimationReference('120',{...api,commonDefault:true}),{prefix:'f',action:120});
assert.deepEqual(compileAnimationReference('120',api),{prefix:'',action:120});
assert.deepEqual(compileAnimationReference('S120',{...api,commonDefault:true}),{prefix:'s',action:120});
assert.deepEqual(compileAnimationReference('Fvar(0)',api),{prefix:'f',action:46});
assert.deepEqual(compileAnimationReference('fvar(0)',api),{prefix:'f',action:46});
assert.deepEqual(compileAnimationReference('"",120',{...api,commonDefault:true}),{prefix:'',action:120});
order.length=0;assert.deepEqual(compileAnimationReference('"F",-1',api),{prefix:'f',action:-1});assert.deepEqual(order,['"F"','-1']);
assert.deepEqual(compileAnimationReference('120.9',api),{prefix:'',action:120});
assert.throws(()=>compileAnimationReference('1,2',api),/requires a string/);
assert.throws(()=>compileAnimationReference('',api),/action number/);
console.log('Animation reference common defaults, explicit/dynamic prefixes, signed action conversion and expression ordering pass');
