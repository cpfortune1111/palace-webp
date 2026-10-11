import assert from 'node:assert/strict';
import {applyMapController} from '../Engine/map-controllers.js';

const createActor=()=>({maps:new Map(),mapDefaults:new Map([['default',5],['restored',6]])});
const root=createActor(),parent=createActor(),child=createActor(),partner=createActor(),enemy=createActor();
let warnings=0;
const api={evaluate:expression=>typeof expression==='string'&&expression.startsWith('"')?JSON.parse(expression):Number(expression),findActor:id=>id===3?child:null,parentActor:actor=>actor===child?parent:null,rootActor:actor=>actor===root?null:root,teamActors:()=>[root,partner],warn:()=>warnings++};
const run=(type,params,actor=child)=>applyMapController({type,params},actor,api);
run('MapSet',{map:'"MiXeD"',value:'2'});assert.equal(child.maps.get('mixed'),2);
run('MapAdd',{map:'"mixed"',value:'3'});assert.equal(child.maps.get('mixed'),5);
run('ParentMapSet',{map:'"count"',value:'7'});assert.equal(parent.maps.get('count'),7);
run('ParentMapAdd',{map:'"count"',value:'2'});assert.equal(parent.maps.get('count'),9);
run('RootMapSet',{map:'"count"',value:'10'});run('RootMapAdd',{map:'"count"',value:'2'});assert.equal(root.maps.get('count'),12);
run('TeamMapSet',{map:'"team"',value:'4'});run('TeamMapAdd',{map:'"team"',value:'3'});
assert.equal(root.maps.get('team'),7);assert.equal(partner.maps.get('team'),7);assert.equal(enemy.maps.size,0);assert.equal(child.maps.has('team'),false);
run('MapSet',{'map("name")':'"text"'});run('MapAdd',{map:'"name"',value:'3'});assert.equal(child.maps.get('name'),'text');assert.equal(warnings,1);
run('MapSet',{map:'"default"',value:'10'});run('MapSet',{map:'"keep.value"',value:'11'});
run('MapReset',{exclude:'"KEEP"'});assert.deepEqual([...child.maps].sort(),[['default',5],['keep.value',11],['restored',6]]);
run('MapSet',{redirectid:'3',map:'"redirected"',value:'8'},root);assert.equal(child.maps.get('redirected'),8);
run('MapReset',{redirectid:'3'},root);assert.deepEqual([...child.maps].sort(),[['default',5],['restored',6]]);
run('MapSet',{map:'"float"',value:'1.25'});run('MapAdd',{map:'"float"',value:'2'});assert.equal(child.maps.get('float'),3.25);
run('MapSet',{map:'"integer"',value:'2147483647'});run('MapAdd',{map:'"integer"',value:'1'});assert.equal(child.maps.get('integer'),-2147483648);
const exclusions={};
for(let index=1;index<=8;index++){
 const name='preserve'+index;
 run('MapSet',{map:JSON.stringify(name),value:String(index)});
 exclusions[index===1?'exclude':'exclude'+index]=JSON.stringify(name);
}
run('MapReset',exclusions);
for(let index=1;index<=8;index++)assert.equal(child.maps.get('preserve'+index),index);
run('MapReset',{});
assert.deepEqual([...child.maps].sort(),[['default',5],['restored',6]]);
run('ParentMapSet',{map:'"unused"',value:'1'},root);assert.equal(root.maps.has('unused'),false);
assert.equal(run('Null',{}),false);
console.log('All nine map controllers: ownership, case, strings, redirect IDs, reset defaults and exclusions passed');
