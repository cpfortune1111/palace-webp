import assert from 'node:assert/strict';
import {applyStateDefVelocity} from '../Engine/state-def-velocity.js';

const values={x:10,y:20,z:30},order=[],api={expressions:source=>source.split(','),evaluate:expression=>{order.push(expression);return expression==='new x'?values.x+2:expression==='new y'?values.y+3:Number(expression)},setVelocity:(axis,value)=>{values[axis]=value}};
assert.equal(applyStateDefVelocity({},api),false);
assert.equal(applyStateDefVelocity({velset:[]},api),false);
assert.equal(applyStateDefVelocity({velset:' '},api),false);
assert.equal(applyStateDefVelocity({velset:['1.5','new x','new y']},api),true);
assert.deepEqual(values,{x:1.5,y:3.5,z:6.5});
assert.deepEqual(order,['1.5','new x','new y']);
applyStateDefVelocity({velset:[4]},api);
assert.deepEqual(values,{x:4,y:3.5,z:6.5});
applyStateDefVelocity({velset:'0.1,-2'},api);
assert.deepEqual(values,{x:Math.fround(.1),y:-2,z:6.5});
assert.throws(()=>applyStateDefVelocity({velset:[1,2,3,4]},api),/three components/);
assert.throws(()=>applyStateDefVelocity({velset:[null]},api),/empty component/);
console.log('StateDef velocity evaluates/writes XYZ sequentially, retains omitted axes, preserves explicit zero and rounds to float32');
for(const raw of [NaN,'3','Moon']){
 applyStateDefVelocity({velset:['invalid']},{...api,evaluate:()=>raw});
 assert.equal(values.x,0);
 assert.deepEqual([values.y,values.z],[-2,6.5]);
}
