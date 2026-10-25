import assert from 'node:assert/strict';
import {animationPresence,changeAnimationNumber,changeAnimationElement} from '../Engine/animation-presence.js';
const frames=[{time:4},{time:-1},{time:0}];
for(const [elem,time,expected]of [[1,3,{elem:1,tick:3}],[1,4,{elem:1,tick:0}],[2,100,{elem:2,tick:100}],[2,-1,{elem:2,tick:0}],[0,3,{elem:1,tick:0}],[4,3,{elem:1,tick:0}],[3,1,{elem:3,tick:0}]])assert.deepEqual(changeAnimationElement(frames,elem,time),expected);
assert.equal(changeAnimationElement(undefined,1,0),null);
assert.deepEqual(animationPresence(0,[{}]),{exists:true,frame:true});assert.deepEqual(animationPresence(0,[]),{exists:true,frame:false});assert.deepEqual(animationPresence(999,undefined),{exists:false,frame:false});assert.deepEqual(animationPresence(-1,[{}]),{exists:false,frame:false});assert.deepEqual(animationPresence(-2,undefined),{exists:true,frame:false});assert.deepEqual(animationPresence(0,[{empty:true}]),{exists:true,frame:true});
for(const [input,expected]of [[-1,0],[-3,0],[-2,-2],[4.9,4],['4',0],[undefined,0]])assert.equal(changeAnimationNumber(input),expected);
console.log('Animation existence differs from current frame; pinned empty -2 stays valid and other negative ChangeAnim values normalize to zero');
