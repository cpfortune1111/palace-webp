import assert from 'node:assert/strict';
import {hitPowerParameters} from '../Engine/hit-power-parameters.js';

assert.deepEqual(hitPowerParameters({damage:'101,20',attr:'S, NA'}),{hitGetPower:70,guardGetPower:35,hitGivePower:60,guardGivePower:30});
assert.deepEqual(hitPowerParameters({damage:'101,20',attr:'A, HP'}),{hitGetPower:0,guardGetPower:0,hitGivePower:60,guardGivePower:30});
assert.deepEqual(hitPowerParameters({damage:'101,20',getpower:'-9',givepower:'0,7'}),{hitGetPower:-9,guardGetPower:-4,hitGivePower:0,guardGivePower:7});
assert.equal(hitPowerParameters({damage:100},{constants:{'default.attack.lifetopowermul':0.25}}).hitGetPower,25);
const reads=[];
const values=hitPowerParameters({damage:100,getpower:'first,second',givepower:'third,fourth'},{evaluate:expression=>{reads.push(expression);return reads.length}});
assert.deepEqual(reads,['first','second','third','fourth']);
assert.deepEqual(values,{hitGetPower:1,guardGetPower:2,hitGivePower:3,guardGivePower:4});
assert.throws(()=>hitPowerParameters({damage:10,getpower:'1,2,3'}),/component count/);
assert.throws(()=>hitPowerParameters({damage:10,givepower:'1,'}),/component count/);
console.log('HitDef power defaults use raw damage, float32 products, super attributes, component inheritance and single supplied-expression evaluation');
