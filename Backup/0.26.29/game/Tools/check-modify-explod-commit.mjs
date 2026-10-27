import assert from 'node:assert/strict';
import {commitModifyExplodEffects} from '../Engine/modify-explod-commit.js';
import {applyModifyExplodController} from '../Engine/modify-explod.js';

const owner={},effects=[{priority:1,angle:2,ignore:0},{priority:3,angle:4,ignore:0}],trace=[],snapshots=[];
const changes={windowWrite:write=>{for(let axis=0;axis<4;axis++){snapshots.push(effects.map(effect=>[effect.priority,effect.angle,effect.ignore]));write(axis,snapshots.length)}}};
commitModifyExplodEffects(effects,owner,changes,{modify:(effect,actor,values,phase)=>{assert.equal(actor,owner);assert.equal(values,changes);trace.push([effects.indexOf(effect),phase]);if(phase==='beforeWindow')effect.priority=7;else{effect.angle=30;effect.ignore=1}}});
assert.deepEqual(trace,[[0,'beforeWindow'],[1,'beforeWindow'],[0,'afterWindow'],[1,'afterWindow']]);assert.deepEqual(snapshots,Array.from({length:8},()=>[[7,2,0],[7,4,0]]));assert.deepEqual(effects.map(effect=>effect.window),[[1,2,3,4],[5,6,7,8]]);assert.deepEqual(effects.map(effect=>[effect.priority,effect.angle,effect.ignore]),[[7,30,1],[7,30,1]]);
assert.notEqual(effects[0].window,effects[1].window);
const api={evaluate:Number,split:value=>value.split(','),select:()=>effects,ikemenVersion:()=>false,localScale:()=>1,modify:()=>{throw Error('Incorrect fallback')}};
assert.throws(()=>applyModifyExplodController({type:'ModifyExplod',params:{window:'1,2,3,4'}},owner,api),/requires a batch commit/);
let commits=0;applyModifyExplodController({type:'ModifyExplod',params:{window:'1,2,3,4'}},owner,{...api,commitBatch:(selected,actor,values)=>{assert.equal(selected,effects);assert.equal(actor,owner);assert.equal(typeof values.windowWrite,'function');commits++}});assert.equal(commits,1);
console.log('ModifyExplod batch commit exposes all prior-field writes across selected effects before any window, and no later-field writes until all windows finish');
