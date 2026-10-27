import assert from 'node:assert/strict';
import {rootEnemyList,nativeEnemyEligible,p2EnemyList} from '../Engine/enemy-selection.js';

const source={player:1,teamSide:0,x:90},roots=[{player:1,id:1,teamSide:1,x:0},{player:2,id:2,teamSide:2,x:100},{player:3,id:3,teamSide:0,x:90}];
assert.deepEqual(rootEnemyList(source,roots).map(actor=>actor.id),[1,2]);
assert.deepEqual(rootEnemyList(source,roots,{near:true}).map(actor=>actor.id),[2,1]);
assert.equal(nativeEnemyEligible(source,{...roots[0],disabled:true}),false);
assert.equal(nativeEnemyEligible(source,{...roots[0],standby:true}),false);
assert.deepEqual(rootEnemyList({...source,teamSide:1},roots).map(actor=>actor.id),[2]);
assert.deepEqual(rootEnemyList({...source,x:50},roots,{near:true}).map(actor=>actor.id),[1,2]);
assert.equal(rootEnemyList(source,[{...roots[0],kind:'helper'}]).length,0);
const caller={player:1,teamSide:1,x:0,z:0,facing:1},front={player:2,id:2,teamSide:2,x:20,z:0},behind={player:2,id:3,teamSide:2,x:-5,z:0},helper={kind:'helper',helperType:2,player:2,instanceId:4,teamSide:2,x:1,z:0};
assert.deepEqual(p2EnemyList(caller,[front,behind]).map(actor=>actor.id),[2,3]);
assert.equal(p2EnemyList(caller,[front,helper])[0],helper);
assert.equal(p2EnemyList(caller,[front,{...helper,overKo:true}])[0],front);
assert.equal(p2EnemyList(caller,[front,{...helper,helperType:1}])[0],front);
assert.equal(p2EnemyList(caller,[front,{...helper,z:10}],{depth:true})[0],front);
assert.equal(rootEnemyList(caller,[front,helper],{near:true})[0],front);
console.log('Pinned root enemy roster excludes neutral/disabled/standby targets, observes source team and sorts nearest ties by actor ID');
