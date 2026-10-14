import assert from 'node:assert/strict';
import {createMoveHitData,markMoveHitData,finishMoveHitData,getMoveHitVar} from '../Engine/move-hit-data.js';

const hit=createMoveHitData();
assert.equal(getMoveHitVar(hit,'playerno').value,1);
markMoveHitData(hit,{playerid:88,playerno:1},{overridden:true});
assert.deepEqual(['frame','playerid','id','playerno','overridden'].map(name=>getMoveHitVar(hit,name).value),[1,88,88,2,1]);
finishMoveHitData(hit,{paused:true});assert.equal(hit.frame,true);
finishMoveHitData(hit);assert.equal(hit.frame,false);assert.equal(hit.playerid,88);
hit.sparkx=3;hit['cornerpush.veloff']=7;
assert.equal(getMoveHitVar(hit,'sparkx',{ratio:2}).value,6);
assert.equal(getMoveHitVar(hit,'cornerpush.veloff',{ratio:2}).value,7);
assert.equal(getMoveHitVar(hit,'uniqhit',{uniqueTargets:3}).value,3);
assert.equal(getMoveHitVar(hit,'cornerpush.velmul').handled,false);
console.log('Pinned MoveHitVar dispatch models aliases, default player number, paused frame reset and spark-only coordinate conversion');
