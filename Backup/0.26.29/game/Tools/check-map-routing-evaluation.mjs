import assert from 'node:assert/strict';
import {applyMapController} from '../Engine/map-controllers.js';

const actor=()=>({maps:new Map(),mapDefaults:new Map()});
const caller=actor(),selected=actor(),parent=actor(),root=actor(),partner=actor();
let counter=0;
const events=[];
const api={
 evaluate:expression=>{events.push(expression);if(expression==='redirect')return 7;if(expression==='missing')return 99;if(expression==='increment')return ++counter;return Number(expression)},
 findActor:id=>id===7?selected:null,
 parentActor:owner=>owner===selected?parent:null,
 rootActor:owner=>owner===selected?root:null,
 teamActors:owner=>owner===selected?[root,partner]:[caller]
};
for(const [type,recipient] of [['MapSet',selected],['ParentMapSet',parent],['RootMapSet',root]]){
 events.length=0;
 applyMapController({type,params:{redirectid:'redirect',map:'"key"',value:'increment'}},caller,api);
 assert.deepEqual(events,['redirect','increment']);
 assert.equal(recipient.maps.get('key'),counter);
 assert.equal(caller.maps.size,0);
}
events.length=0;
applyMapController({type:'TeamMapSet',params:{redirectid:'redirect',map:'"team"',value:'increment'}},caller,api);
assert.deepEqual(events,['redirect','increment']);
assert.equal(root.maps.get('team'),counter);
assert.equal(partner.maps.get('team'),counter);
const previous=counter;
events.length=0;
applyMapController({type:'MapSet',params:{redirectid:'missing',map:'"key"',value:'increment'}},caller,api);
assert.deepEqual(events,['missing']);
assert.equal(counter,previous);
for(const type of ['ParentMapSet','RootMapSet']){
 events.length=0;
 applyMapController({type,params:{map:'"key"',value:'increment'}},caller,api);
 assert.deepEqual(events,['increment']);
 assert.equal(caller.maps.size,0);
}
console.log('Map routing samples redirect then caller RHS once, routes selected parent/root/team, skips RHS for missing redirect but not missing ancestry');
const observed=[],warnings=[];
for(const value of ['7',NaN,undefined]){
 const before=counter;
 applyMapController({type:'MapSet',params:{redirectid:'operand',map:'"key"',value:'increment'}},caller,{...api,evaluate:expression=>expression==='operand'?value:api.evaluate(expression),findActor:id=>{observed.push(id);return null},warn:message=>warnings.push(message)});
 assert.equal(counter,before);
}
assert.deepEqual(observed,[0,0,0]);
assert.deepEqual(warnings,Array(3).fill('invalid RedirectID for MapSet: 0'));
