import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {motionConstant,motionConstantNames} from '../Engine/motion-constants.js';

const audit=JSON.parse(readFileSync(new URL('../Docs/CONST-AUDIT.json',import.meta.url),'utf8'));
assert.deepEqual([...motionConstantNames].sort(),audit.rows.filter(row=>/^(velocity|movement)\./.test(row.name)).map(row=>row.name).sort());
const {originalMotionConstants:values}=JSON.parse(readFileSync(new URL('./fixtures/motion-constants.json',import.meta.url),'utf8'));
const unscaled=new Set(['velocity.air.gethit.airrecover.mul.x','velocity.air.gethit.airrecover.mul.y','velocity.ground.gethit.ko.xmul','movement.stand.friction','movement.crouch.friction','movement.airjump.num']);
for(const name of motionConstantNames){
 assert.deepEqual(motionConstant(name.toUpperCase(),values),{handled:true,value:values[name]});
 assert.equal(motionConstant(name,values,{subjectLocalCoord:1280,expressionLocalCoord:320}).value,unscaled.has(name)?values[name]:Math.fround(values[name]*.25),name);
 assert.equal(motionConstant(name,values,{subjectLocalCoord:320,expressionLocalCoord:1280}).value,unscaled.has(name)?values[name]:Math.fround(values[name]*4),name);
}
assert.deepEqual(motionConstant('size.xscale',values),{handled:false});
assert.deepEqual(motionConstant('movement.yaccel'),{handled:false});
assert.deepEqual(motionConstant('movement.yaccel',{}),{handled:false});
assert.deepEqual(motionConstant('movement.yaccel',{'movement.yaccel':'Infinity'}),{handled:true,value:Infinity});
assert.equal(motionConstant('movement.airjump.num',{'movement.airjump.num':-2147483648}).value,-2147483648);
assert.throws(()=>motionConstant('movement.yaccel',values,{subjectLocalCoord:0}),/Invalid motion/);
console.log('All 85 native Velocity/Movement names preserve float32, integer and dimensionless values with caller-coordinate conversion');
