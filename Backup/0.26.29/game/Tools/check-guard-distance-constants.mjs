import assert from 'node:assert/strict';
import {guardDistanceConstant} from '../Engine/guard-distance-constants.js';

const defaults={normal:{x:[240,30],y:[50,60],z:[7,8]},projectile:{x:[80,10],y:[25,26],z:[11,12]}};
for(const [prefix,range]of [['size.attack.dist',defaults.normal],['size.proj.attack.dist',defaults.projectile]]){
 assert.deepEqual(guardDistanceConstant(prefix,defaults),{handled:true,value:range.x[0]});
 for(const [suffix,axis,index]of [['width.front','x',0],['width.back','x',1],['height.top','y',0],['height.bottom','y',1],['depth.top','z',0],['depth.bottom','z',1]]){
  assert.equal(guardDistanceConstant(prefix+'.'+suffix,defaults).value,range[axis][index]);
  assert.equal(guardDistanceConstant((prefix+'.'+suffix).toUpperCase(),defaults,{subjectLocalCoord:1280,expressionLocalCoord:320}).value,Math.fround(range[axis][index]/4));
 }
}
assert.deepEqual(guardDistanceConstant('size.attack.dist.width',defaults),{handled:false});
assert.deepEqual(guardDistanceConstant('data.attack',defaults),{handled:false});
assert.throws(()=>guardDistanceConstant('size.attack.dist',defaults,{subjectLocalCoord:0}),/coordinates/);
console.log('All fourteen native guard-distance Const names/aliases preserve components and caller-coordinate units');
