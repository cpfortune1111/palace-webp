import assert from 'node:assert/strict';
import {assertCommandBuffers,applyAssertCommandController} from '../Engine/assert-command.js';

const command=(name,bufferTime=4)=>({definition:{name,bufferTime},buffer:10}),first={commands:[command('attack'),command('attack'),command('Jump',0)]},second={commands:[command('attack')]},warnings=[];
assert.equal(assertCommandBuffers([first,second],'attack',1,{warn:value=>warnings.push(value)}),3);assert.deepEqual(first.commands.map(value=>value.buffer),[1,1,10]);assert.equal(second.commands[0].buffer,1);
assert.equal(assertCommandBuffers([first],'attack',-2,{}),2);assert.equal(first.commands[0].buffer,-2);
assert.equal(assertCommandBuffers([first],'',0,{randomIndex:count=>{assert.equal(count,2);return 1}}),1);assert.equal(first.commands[2].buffer,1);
assert.equal(assertCommandBuffers([first],'',0,{randomIndex:()=>0}),2);assert.equal(first.commands[0].buffer,4);
assert.equal(assertCommandBuffers([first],'Attack',1,{warn:value=>warnings.push(value)}),0);assert.equal(warnings.length,1);
assert.equal(assertCommandBuffers([{commands:[]}],'',1,{randomIndex:()=>{throw Error('Empty random selection')}}),0);
const caller={id:1},target={id:2},reads=[],writes=[],api={evaluate:value=>{reads.push(value);return value},findActor:id=>id===2?target:null,assert:(...args)=>writes.push(args)};
applyAssertCommandController({type:'AssertCommand',params:{name:'"Attack"',redirectid:2,'buffer.time':3}},caller,api);assert.deepEqual(reads,[2,3]);assert.deepEqual(writes,[[target,'Attack',3]]);
applyAssertCommandController({type:'AssertCommand',params:{name:'""'}},caller,api);assert.deepEqual(writes.at(-1),[caller,'',1]);
reads.length=0;applyAssertCommandController({type:'AssertCommand',params:{name:'"Attack"',redirectid:99,'buffer.time':7}},caller,api);assert.deepEqual(reads,[99]);
assert.throws(()=>applyAssertCommandController({type:'AssertCommand',params:{name:'var(0)'}},caller,api),/not enclosed/);
console.log('AssertCommand overwrites duplicate buffers with native signed time, preserves case, defaults to one and supports grouped random/default-time selection');
