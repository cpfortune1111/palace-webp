import assert from 'node:assert/strict';
import {applyMapController} from '../Engine/map-controllers.js';

const actor={maps:new Map(),mapDefaults:new Map()},sampled=[];
const api={evaluate:expression=>{sampled.push(expression);return Number(expression)}};
applyMapController({type:'MapSet',params:{'map( Var(0) )':'7'}},actor,api);
assert.equal(actor.maps.get('var(0)'),7);
assert.deepEqual(sampled,['7']);
applyMapController({type:'MapSet',params:{'map("Quoted")':'8'}},actor,api);
assert.equal(actor.maps.get('"quoted"'),8);
applyMapController({type:'MapSet',params:{map:'"Var(0)"',value:'10'}},actor,api);
assert.equal(actor.maps.get('var(0)'),10);
applyMapController({type:'MapSet',params:{map:String.raw`"A\nB"`,value:'11'}},actor,api);
assert.equal(actor.maps.get(String.raw`a\nb`),11);
const before=sampled.length;
assert.throws(()=>applyMapController({type:'MapSet',params:{map:'UnquotedName',value:'12'}},actor,api),/enclosed/);
assert.throws(()=>applyMapController({type:'MapSet',params:{map:'""',value:'12'}},actor,api),/empty/);
assert.equal(sampled.length,before);
applyMapController({type:'MapReset',params:{exclude:'"Var(0)"'}},actor,api);
assert.deepEqual([...actor.maps],[['var(0)',10]]);
assert.equal(sampled.length,before);
assert.throws(()=>applyMapController({type:'MapReset',params:{exclude:'Var(0)'}},actor,api),/enclosed/);
for(const operator of ['=',':=']){
 applyMapController({type:'MapSet',params:{map:'Map(Embedded) '+operator+' 17',value:'999'}},actor,api);
 assert.equal(actor.maps.get('embedded'),17);
}
applyMapController({type:'MapSet',params:{map:'Var(0):=9',value:'12'}},actor,api);
assert.equal(actor.maps.get('0'),9);
applyMapController({type:'MapSet',params:{map:'map = " padded "',value:'18'}},actor,api);
assert.equal(actor.maps.get(' padded '),18);
assert.throws(()=>applyMapController({type:'MapSet',params:{map:'"contains=sign"',value:'19'}},actor,api),/embedded/);
assert.throws(()=>applyMapController({type:'MapSet',params:{map:'Map(12name)=3'}},actor,api),/token/);
assert.throws(()=>applyMapController({type:'MapSet',params:{map:'Map("name")=3'}},actor,api),/embedded/);
assert.throws(()=>applyMapController({type:'MapSet',params:{map:'"name"',value:' '}},actor,api),/Missing/);
console.log('Map controller names and reset exclusions are static source text, never evaluated expressions; shorthand quotes and backslashes remain literal');
