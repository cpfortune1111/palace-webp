import assert from 'node:assert/strict';
import {clearActorRegistry} from '../Engine/actor-registry-cleanup.js';
import {createHitStateStore} from '../Engine/hit-state-store.js';
import {createJuggleState} from '../Engine/juggle-state.js';
import {createActorUnhittableTime} from '../Engine/actor-unhittable-time.js';
import {createNativeHitCounters} from '../Engine/native-hit-counters.js';
import {createContactPowerScheduler} from '../Engine/contact-power-scheduler.js';
const kept=new Set(['kept']),value={clock:7},map=new Map([['kept',value],['gone',{}],['root1',{}]]);clearActorRegistry(map,kept);assert.equal(map.get('kept'),value);assert.equal(map.size,1);
const hit=createHitStateStore(),juggle=createJuggleState(),invulnerable=createActorUnhittableTime(),counts=createNativeHitCounters();let tick=1;const payments=[],power=createContactPowerScheduler({findActor:key=>({key}),addPower:(actor,value)=>payments.push([actor.key,value]),compatibility:()=> 'ikemen',tick:()=>tick});
for(const key of ['kept','gone','root1']){hit.sample(key,1,{moveType:'H',fall:true});juggle.set(key,9);juggle.sampleFall(key,1,true);invulnerable.set(key,12,1);counts.contact(key,key,{numHits:3,side:0});power.credit(key,17)}
for(const store of [hit,juggle,invulnerable,counts,power])store.clear(kept);
assert.equal(hit.value('kept'),2);assert.equal(hit.sample('kept',1,{moveType:'I'}),2);assert.equal(hit.value('gone'),0);assert.equal(juggle.cost('kept'),9);assert.equal(juggle.sampleFall('kept',1,false),true);assert.equal(juggle.cost('gone'),0);assert.equal(invulnerable.remaining('kept'),12);assert.equal(invulnerable.remaining('root1'),0);invulnerable.prepare('kept',2);assert.equal(invulnerable.remaining('kept'),11);assert.deepEqual(counts.actor('kept'),{uniqHitCount:1,receivedHits:3});assert.deepEqual(counts.actor('gone'),{uniqHitCount:0,receivedHits:0});assert.equal(counts.comboCount(0),0);assert.equal(power.pending('kept'),17);assert.equal(power.pending('root1'),0);tick++;power.finish();assert.deepEqual(payments,[['kept',17]]);
for(const store of [hit,juggle,invulnerable,counts,power])store.clear();clearActorRegistry(map);assert.equal(map.size,0);assert.equal(hit.value('kept'),0);assert.equal(juggle.cost('kept'),0);assert.equal(invulnerable.remaining('kept'),0);assert.deepEqual(counts.actor('kept'),{uniqHitCount:0,receivedHits:0});
console.log('Preserved actor registries retain identity and hit/fall/invulnerability/power clocks, remove roots/deleted Helpers and fully clear on forced reset');
