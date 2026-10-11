import assert from 'node:assert/strict';
import {resolveHitPriority} from '../Engine/hit-priority.js';
const cases=[
 ['Hit','Hit',[true,true]],['Hit','Miss',[true,false]],['Hit','Dodge',[false,false]],
 ['Miss','Hit',[false,true]],['Miss','Miss',[false,false]],['Miss','Dodge',[false,false]],
 ['Dodge','Hit',[false,false]],['Dodge','Miss',[false,false]],['Dodge','Dodge',[false,false]]
];
for(const [left,right,expected] of cases){
 assert.deepEqual(resolveHitPriority('6, '+left,'6, '+right),expected);
 assert.deepEqual(resolveHitPriority('7, '+left,'6, '+right),[true,false]);
 assert.deepEqual(resolveHitPriority('6, '+left,'7, '+right),[false,true]);
}
assert.deepEqual(resolveHitPriority(undefined,undefined),[true,true]);
assert.deepEqual(resolveHitPriority('6','6, mIsS'),[true,false]);
assert.throws(()=>resolveHitPriority('6, invalid','6, Hit'),/Invalid HitDef priority/);
console.log('All Hit/Miss/Dodge ties, unequal priorities and defaults passed');
