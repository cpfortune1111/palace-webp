import assert from 'node:assert/strict';
import {applyRoundTimeController} from '../Engine/round-time-controller.js';

let current=600,maximum=5940;const reads=[],writes=[],api={time:()=>({current,maximum}),evaluate:value=>{reads.push(value);return value},setTime:value=>{current=value;writes.push(value)}};
assert.equal(applyRoundTimeController({type:'Other'},api),false);
applyRoundTimeController({type:'RoundTimeSet',params:{value:123.9,redirectid:'not evaluated'}},api);assert.equal(current,123);assert.deepEqual(reads,[123.9]);
applyRoundTimeController({type:'RoundTimeAdd',params:{value:60}},api);assert.equal(current,183);
applyRoundTimeController({type:'RoundTimeSet',params:{value:99999}},api);assert.equal(current,5940);
applyRoundTimeController({type:'RoundTimeAdd',params:{value:-99999}},api);assert.equal(current,0);
current=100;applyRoundTimeController({type:'RoundTimeAdd',params:{value:2147483647}},api);assert.equal(current,0);
maximum=-1;const count=reads.length,writeCount=writes.length;applyRoundTimeController({type:'RoundTimeSet',params:{value:120}},api);assert.equal(reads.length,count);assert.equal(writes.length,writeCount);
assert.throws(()=>applyRoundTimeController({type:'RoundTimeAdd',params:{}},api),/Missing/);
console.log('RoundTimeSet/Add use native signed tick values, int32 addition wrap and timer bounds; unlimited mode skips payload and pinned redirectid is not evaluated');
