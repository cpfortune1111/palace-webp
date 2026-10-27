import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const helper=source.match(/^function selfAnimationExists\([^\n]+/m)?.[0];
assert.ok(helper,'Missing actual own-animation query');
assert.match(source,/animationIds:new Set\(Object\.keys\(all\.actions\)\)/);
const profiles=new Map([
 ['Own',{animationIds:new Set(['0','777']),data:{actions:{0:[{time:1}]}}}],
 ['Other',{animationIds:new Set(['0','888']),data:{actions:{0:[{time:1}],888:[{time:1}]}}}],
 ['Legacy',{}]
]);
const context=vm.createContext({characterProfiles:profiles,battleCharacters:['Own','Other'],roundCharDat:{actions:{333:[{time:1}]}},lifecycleDat:null,specialDat:null,airDat:null,reactionDat:null,fallDat:null,guardDat:null,gethitDat:null,turnDat:null,attackDat:null,dat:null});
vm.runInContext(helper,context);
assert.equal(vm.runInContext('selfAnimationExists(1,777)',context),true);
assert.equal(vm.runInContext('selfAnimationExists(1,888)',context),false);
assert.equal(vm.runInContext('selfAnimationExists(2,888)',context),true);
assert.equal(vm.runInContext('selfAnimationExists(2,777)',context),false);
assert.equal(profiles.get('Own').data.actions[777],undefined);
vm.runInContext("battleCharacters[0]='Legacy'",context);
assert.equal(vm.runInContext('selfAnimationExists(1,333)',context),true);
assert.equal(vm.runInContext('selfAnimationExists(1,888)',context),false);
console.log('Actual own animation lookup uses complete imported IDs independently of preloaded frames, with explicit legacy own tables');
