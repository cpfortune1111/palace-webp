import assert from 'node:assert/strict';
import {cornerPushParameterNames,hitDefCornerPush} from '../Engine/hitdef-cornerpush.js';

const velocities={ground:[-4,0,0],guard:[-3,0,0]};
const legacy=hitDefCornerPush({attr:'S,NA'},{velocities});
assert.equal(cornerPushParameterNames.length,10);
for(const prefix of ['ground','air','down','guard','airguard']){
 assert.equal(legacy[prefix+'.cornerpush.veloff'],Math.fround(-3*1.3));
 assert.equal(legacy[prefix+'.cornerpush.velmul'],Math.fround(0.7));
}
assert.equal(hitDefCornerPush({attr:'A,NA'},{velocities})['ground.cornerpush.veloff'],0);
for(const options of [{ikemen:true},{legacyDefault:0},{ikemen:false,legacyDefault:0}]){
 const modern=hitDefCornerPush({attr:'A,NA'},{velocities,...options});
 assert.equal(modern['ground.cornerpush.veloff'],-4);
 assert.equal(modern['airguard.cornerpush.velmul'],-1);
}
assert.equal(hitDefCornerPush({attr:'S,NA'},{velocities,ikemen:true,legacyDefault:1})['ground.cornerpush.velmul'],Math.fround(0.7));
assert.equal(hitDefCornerPush({attr:'S,NA'},{velocities,ikemen:true,legacyDefault:-1})['ground.cornerpush.velmul'],-1);
const calls=[];
const expressions=Object.fromEntries(cornerPushParameterNames.map((name,index)=>[name,'value'+index]));
const explicit=hitDefCornerPush({attr:'S,NA',...expressions},{velocities,evaluate:expression=>{calls.push(expression);return Number(expression.slice(5))+0.125}});
for(const [index,name] of cornerPushParameterNames.entries())assert.equal(explicit[name],index+0.125);
assert.equal(calls.length,10);
assert.equal(new Set(calls).size,10);
assert.deepEqual(calls,[3,2,5,4,1,0,7,6,9,8].map(index=>'value'+index));
const inherited=hitDefCornerPush({attr:'S,NA','ground.cornerpush.veloff':-12,'ground.cornerpush.velmul':0.25,'air.cornerpush.veloff':0},{velocities});
assert.equal(inherited['air.cornerpush.veloff'],0);
assert.equal(inherited['down.cornerpush.veloff'],-12);
assert.equal(inherited['guard.cornerpush.velmul'],0.25);
console.log('All ten cornerpush expressions, single evaluation, native legacy/modern defaults and inheritance pass; full contact/version certification remains pending');
