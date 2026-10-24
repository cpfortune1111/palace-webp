import assert from 'node:assert/strict';
import {nativeDataPrefix} from '../Engine/native-data-prefix.js';
import {compileSoundReference} from '../Engine/sound-reference.js';

for(const prefix of ['F','S','M'])assert.deepEqual(nativeDataPrefix(prefix+'var(0), 1'),{prefix:prefix.toLowerCase(),value:'var(0), 1'});
assert.deepEqual(nativeDataPrefix('statetype'),{prefix:'',value:'statetype'});
assert.deepEqual(nativeDataPrefix('sin(0)'),{prefix:'',value:'sin(0)'});
assert.deepEqual(nativeDataPrefix('Froot,var(0)'),{prefix:'',value:'Froot,var(0)'});
assert.deepEqual(nativeDataPrefix('F var(0),1'),{prefix:'f',value:' var(0),1'});
assert.deepEqual(nativeDataPrefix('FFFvar(0),1',{prefixes:['fff']}),{prefix:'fff',value:'var(0),1'});
const reads=[],result=compileSoundReference('Fvar(0),var(1)',{split:value=>value.split(','),evaluate:expression=>{reads.push(expression);return expression==='var(0)'?7:1}});
assert.deepEqual(result,{common:true,group:7,item:1});assert.deepEqual(reads,['var(0)','var(1)']);
const dynamicReads=[],dynamic=compileSoundReference('selector,group,item',{split:value=>value.split(','),evaluate:expression=>{dynamicReads.push(expression);return {selector:'F',group:7,item:1}[expression]}});
assert.deepEqual(dynamic,{common:true,group:7,item:1});assert.deepEqual(dynamicReads,['selector','group','item']);
const omittedReads=[];assert.deepEqual(compileSoundReference('Fvar(0)',{split:value=>value.split(','),evaluate:expression=>{omittedReads.push(expression);return 7}}),{common:true,group:7,item:0});assert.deepEqual(omittedReads,['var(0)']);
assert.throws(()=>compileSoundReference('prefix,group,item',{split:value=>value.split(','),evaluate:()=>7}),/requires a string/);
assert.throws(()=>compileSoundReference('M7,0',{split:value=>value.split(','),evaluate:Number}),/Unsupported sound resource prefix/);
console.log('Pinned lexical data-prefix rules recognize dynamic triggers, preserve ordinary trigger words and choose longest configured prefixes');
