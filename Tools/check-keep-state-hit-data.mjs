import assert from 'node:assert/strict';
import {keepStateHitData} from '../Engine/keep-state-hit-data.js';
const result=keepStateHitData({xvel:6,animtype:2,guarded:true,hittime:9},{xvel:20,animtype:5,guarded:false,hittime:20,damage:10,playerid:7,frame:true});
assert.deepEqual([result.xvel,result.animtype,result.guarded,result.hittime,result.damage,result.playerid,result.keepstate],[6,2,true,9,10,7,true]);
assert.equal(keepStateHitData(null,{damage:10}).hittime,-1);
console.log('HitDef keepstate preserves prior reaction/velocity data while updating independent source identity and damage');
