import assert from 'node:assert/strict';
import {consumeGetHitResources,prepareGetHitResourceQueue,queueGetHitResources} from '../Engine/get-hit-resource-consumer.js';
import {executeLifeAddition} from '../Engine/resource-controllers.js';

const legacy={damage:20,redlife:10};prepareGetHitResourceQueue(legacy);assert.equal(legacy.damage,0);assert.equal(legacy.redlife,0);
const queued=queueGetHitResources(legacy,{damage:20,redlife:2,dizzypoints:6});
assert.equal(queueGetHitResources(queued,{damage:10}).damage,30);
const actor={life:1000,lifeMax:1000,redLife:1000,getHit:{kill:0}};queued.damage=5;
consumeGetHitResources(queued,{moveType:'H',overrideIndex:-1,apply:(field,value)=>{if(field==='damage')executeLifeAddition(actor,value,{kill:true,absolute:true})}});
assert.equal(actor.life,995);assert.equal(actor.getHit.kill,0);assert.equal(queued.damage,0);

for(const [moveType,keepstate,overrideIndex,eligible] of [['H',false,-1,true],['I',false,-1,false],['I',true,-1,true],['I',true,2,false],['H',true,2,true]]){
 const hit={damage:20,redlife:10,dizzypoints:5,guardpoints:-3,keepstate,hitid:7},writes=[];
 consumeGetHitResources(hit,{moveType,overrideIndex,apply:(field,amount)=>writes.push([field,amount])});
 assert.deepEqual(writes,eligible?[['damage',-20],['redlife',-10],['dizzypoints',-5],['guardpoints',3]]:[]);
 assert.deepEqual(hit,{damage:0,redlife:0,dizzypoints:0,guardpoints:0,keepstate,hitid:7});
 consumeGetHitResources(hit,{moveType,overrideIndex,apply:()=>{throw Error('Resource consumed twice')}});
}
assert.throws(()=>consumeGetHitResources({damage:2},{moveType:'H',apply:()=>{}}),/HitOverride index/);
console.log('Pinned GetHit resource consumption order, H/KeepState/override gating, negative values and one-time clearing pass; full scheduler/profile certification remains pending');
