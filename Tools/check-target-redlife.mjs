import assert from 'node:assert/strict';
import {applyTargetRedLifeController} from '../Engine/target-redlife.js';
import {createTargetList} from '../Engine/target-list.js';
const owner={},target={life:100,finalDefense:2,getHit:{hitid:7}},targets=createTargetList();targets.add(2);
const writes=[],api={evaluate:Number,findActor:id=>id===1?owner:id===2?target:null,targets:()=>targets,excluded:()=>false,resource:actor=>actor,compatibility:()=> 'mugen',add:(actor,value)=>writes.push(value)};
const apply=params=>applyTargetRedLifeController({type:'TargetRedLifeAdd',params},owner,api);
apply({id:7,value:-20});apply({id:7,value:20});apply({redirectid:1,id:7,index:0,value:-1000,absolute:1});
assert.deepEqual(writes,[-10,20,-1000]);
apply({id:7,value:1000});assert.equal(writes.at(-1),99);
applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{value:20}},owner,{...api,compatibility:()=> 'ikemen'});assert.equal(writes.at(-1),10);
applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{value:-20}},owner,{...api,excluded:()=>true});assert.equal(writes.length,5);
assert.throws(()=>apply({}),/Missing/);
apply({id:999,value:-20});apply({redirectid:999,value:-20});assert.equal(writes.length,5);
applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{value:0}},owner,{...api,resource:()=>{throw Error('Zero must not resolve resources')}});assert.equal(writes.length,5);
target.life=0;apply({value:10});assert.equal(writes.at(-1),-1);
applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{value:10}},owner,{...api,compatibility:()=> 'ikemen'});assert.equal(writes.at(-1),0);
target.life=100;
applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{redirectid:1,value:20}},owner,{...api,compatibility:actor=>actor===owner?'mugen':'ikemen'});assert.equal(writes.at(-1),20);
console.log('TargetRedLifeAdd selection, native healing compatibility, defence and nonlethal limits passed');
const ordered=[];
applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{id:'id',absolute:'flag',value:'zero'}},owner,{...api,evaluate:expression=>{ordered.push(expression);return expression==='id'?7:expression==='flag'?1:0}});
assert.deepEqual(ordered,['id','flag','zero']);
applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{value:-20,absolute:'flag'}},owner,{...api,evaluate:expression=>expression==='flag'?NaN:Number(expression)});
assert.equal(writes.at(-1),-10);
for(const [ikemen,expected] of [[[0,0,9],20],[[0,99,0],10]]){
 applyTargetRedLifeController({type:'TargetRedLifeAdd',params:{value:20,absolute:0}},owner,{...api,compatibility:()=>ikemen[1]?'mugen':'ikemen',versionData:{engineVersions:{mugen:[1,1],ikemen}}});
 assert.equal(writes.at(-1),expected);
}
