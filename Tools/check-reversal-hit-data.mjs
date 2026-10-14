import assert from 'node:assert/strict';
import {reversalHitData} from '../Engine/reversal-hit-data.js';

const previous={damage:12,power:7,fall:true,xvel:99,score:40,targetedBy:[[2,15]]},definition={attr:'S,NA',id:7,fall:false,'fall.xvel':3,'fall.yvel':-4,'fall.zvel':null,'fall.envshake.ampl':-3,'fall.envshake.diradd':10,'down.recovertime':-1},source={playerno:0,playerid:1,teamside:0};
const hit=reversalHitData(previous,definition,source,{ratio:0.5,defaultDownRecovery:60});
assert.deepEqual([hit.damage,hit.power,hit.fall,hit.hitid,hit.playerid],[12,7,true,7,1]);
assert.deepEqual([hit['fall.xvel'],hit['fall.yvel'],hit['fall.zvel'],hit['fall.envshake.ampl']],[1.5,-2,null,-1]);
assert.equal(hit['fall.envshake.diradd'],0);assert.equal(hit['down.recovertime'],60);
assert.equal(hit.xvel,undefined);assert.equal(hit.score,undefined);
assert.deepEqual(previous,{damage:12,power:7,fall:true,xvel:99,score:40,targetedBy:[[2,15]]});
assert.equal(reversalHitData(previous,{...definition,forcenofall:true},source,{defaultDownRecovery:60}).fall,false);
assert.throws(()=>reversalHitData(previous,definition,source),/liedown/);
console.log('Reversal GetHit data selectively resets, retains stacked fields, copies source identity and scales unsigned fall data without ordinary reaction');
