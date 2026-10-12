import assert from 'node:assert/strict';
import {downHitParameters} from '../Engine/down-hit.js';

const defender={type:'L',y:0},params={'air.velocity':'-8,-10','down.velocity':'-3,-5','down.hittime':12};
assert.deepEqual(downHitParameters(defender,params),{velocity:[-3,-5],hittime:12,ctrltime:12,state:5080,suppressBounce:true});
assert.equal(downHitParameters(defender,{...params,'down.bounce':1}).suppressBounce,false);
assert.deepEqual(downHitParameters({...defender,y:-1},params).velocity,[-8,-10]);
assert.equal(downHitParameters({...defender,y:-1},params).state,5020);
assert.equal(downHitParameters(defender,{}).hittime,20);
assert.deepEqual(downHitParameters(defender,{'air.velocity':'1,2'}).velocity,[1,2]);
assert.equal(downHitParameters({type:'S',y:0},params),null);
assert.throws(()=>downHitParameters(defender,{'down.velocity':'1,2,3'}),/Z component/);
console.log('Native down velocity fallback, timers, grounded/air state and bounce suppression passed');
