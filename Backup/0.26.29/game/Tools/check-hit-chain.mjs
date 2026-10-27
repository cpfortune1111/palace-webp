import assert from 'node:assert/strict';
import {compileHitChain,hitChainAllowed} from '../Engine/hit-chain.js';

const reads=[];
assert.deepEqual(compileHitChain({chainid:'first',nochainid:'second,third'},{evaluate:value=>{reads.push(value);return reads.length}}),{chainid:1,nochainid:'2,3'});
assert.deepEqual(reads,['first','second','third']);
assert.deepEqual(compileHitChain({attr:'S,NA'}),{id:0});
assert.deepEqual(compileHitChain({attr:'S,NA',id:-7}),{id:0});
assert.deepEqual(compileHitChain({'reversal.attr':'SCA,NA',id:'caller'},{evaluate:()=>9}),{id:9});
assert.throws(()=>compileHitChain({nochainid:'1,2,3,4,5,6,7,8,9'}),/component count/);
assert.equal(hitChainAllowed({chainid:7},{hitid:6}),false);
assert.equal(hitChainAllowed({chainid:7},{hitid:7,playerid:9},{sourceId:1}),true);
assert.equal(hitChainAllowed({nochainid:'3,7'},{hitid:7,playerid:1},{sourceId:1,lastTargetOwner:1}),false);
assert.equal(hitChainAllowed({nochainid:'7'},{hitid:7,playerid:2},{sourceId:1,hitShake:1}),true);
assert.equal(hitChainAllowed({nochainid:'7'},{hitid:7,playerid:1},{sourceId:1,hitShake:0,lastTargetOwner:2}),true);
assert.equal(hitChainAllowed({chainid:7,nochainid:'7'},{hitid:7,playerid:1},{sourceId:1,hitShake:1}),false);
console.log('Pinned chain/nochain conditions preserve source-ID and target/hitshake gating with eight-component caller compilation');
