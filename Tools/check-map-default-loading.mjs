import assert from 'node:assert/strict';
import {initializeStoredMaps,readStoredMapValue,writeStoredMapValue,cloneStoredMapValues} from '../Engine/map-value-types.js';
import {applyMapController} from '../Engine/map-controllers.js';

const current=new Map(),defaults=new Map();
const bundle={mapDefaults:{Integer:3,Float:3,Text:'3',Fraction:1.23456789,Infinite:'Infinity',NotANumber:'NaN'},mapDefaultTypes:{Integer:'int',Float:'float',Text:'string',Fraction:'float',Infinite:'float',NotANumber:'float'}};
initializeStoredMaps(current,defaults,JSON.parse(JSON.stringify(bundle)));
for(const storage of [current,defaults]){
 assert.deepEqual(readStoredMapValue(storage,'integer'),{type:'int',value:3});
 assert.deepEqual(readStoredMapValue(storage,'float'),{type:'float',value:3});
 assert.deepEqual(readStoredMapValue(storage,'text'),{type:'string',value:'3'});
 assert.deepEqual(readStoredMapValue(storage,'fraction'),{type:'float',value:Math.fround(1.23456789)});
 assert.deepEqual(readStoredMapValue(storage,'infinite'),{type:'float',value:Infinity});
 assert.deepEqual(readStoredMapValue(storage,'notanumber'),{type:'float',value:NaN});
}
const helper={maps:cloneStoredMapValues(defaults),mapDefaults:cloneStoredMapValues(defaults)};
writeStoredMapValue(helper.maps,'float',{type:'int',value:99});
applyMapController({type:'MapReset',params:{}},helper,{evaluate:Number});
assert.deepEqual(readStoredMapValue(helper.maps,'float'),{type:'float',value:3});
assert.deepEqual(readStoredMapValue(helper.maps,'notanumber'),{type:'float',value:NaN});
writeStoredMapValue(helper.maps,'notanumber',{type:'undefined',value:NaN});
assert.deepEqual(readStoredMapValue(helper.maps,'notanumber'),{type:'undefined',value:NaN});
applyMapController({type:'MapReset',params:{}},helper,{evaluate:Number});
assert.deepEqual(readStoredMapValue(helper.maps,'notanumber'),{type:'float',value:NaN});
initializeStoredMaps(current,defaults,{mapDefaults:{float:3}});
assert.deepEqual(readStoredMapValue(current,'float'),{type:'int',value:3});
assert.equal(current.size,1);
initializeStoredMaps(current,defaults,{});
assert.equal(current.size,0);
assert.equal(defaults.size,0);
assert.throws(()=>initializeStoredMaps(current,defaults,{mapDefaults:{bad:1},mapDefaultTypes:{bad:'bool'}}),/Invalid imported/);
console.log('Typed bundle Map defaults survive JSON, root initialization, Helper copies and reset; legacy bundles and fresh matches clear stale tags');
