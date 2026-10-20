import assert from 'node:assert/strict';
import {excludesLegacyHelperFeedback} from '../Engine/helper-force-feedback.js';

const helper={kind:'helper',instanceId:1001},root={player:1},reads=[];
const api={evaluate:value=>{reads.push(value);return Number(value)},split:value=>String(value).split(','),findActor:id=>id===1?root:id===1001?helper:null,opponent:()=>root};
assert.equal(excludesLegacyHelperFeedback({type:'ForceFeedback',params:{time:6,ampl:'110,-1,-.3',freq:'128,2',waveform:'square'}},helper,api),true);
assert.deepEqual(reads,[6,'128','2','110','-1','-.3',1]);
assert.equal(excludesLegacyHelperFeedback({type:'ForceFeedback',params:{self:0}},helper,api),false);
assert.equal(excludesLegacyHelperFeedback({type:'ForceFeedback',params:{redirectid:1}},helper,api),false);
assert.equal(excludesLegacyHelperFeedback({type:'ForceFeedback',params:{redirectid:1001}},root,api),true);
assert.equal(excludesLegacyHelperFeedback({type:'ForceFeedback',params:{redirectid:99}},helper,api),true);
assert.equal(excludesLegacyHelperFeedback({type:'ForceFeedback',params:{lo:1}},helper,api),false);
assert.equal(excludesLegacyHelperFeedback({type:'ForceFeedback',params:{hi:1}},helper,api),false);
assert.equal(excludesLegacyHelperFeedback({type:'Null',params:{}},helper,api),false);
console.log('Pinned legacy ForceFeedback Helper exclusion evaluates supplied numeric fields and never masks root/new-API output requirements; full ForceFeedback remains uncertified');
