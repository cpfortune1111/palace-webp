import assert from 'node:assert/strict';
import {compileSoundReference} from '../Engine/sound-reference.js';

const api={split:value=>value.split(','),evaluate:value=>value.trim()==='(7)'?7:Number(value)};
assert.deepEqual(compileSoundReference('F7, 1',api),{common:true,group:7,item:1});
assert.deepEqual(compileSoundReference(' f (7), 0 ',api),{common:true,group:7,item:0});
assert.deepEqual(compileSoundReference('S7, 1',api),{common:false,group:7,item:1});
assert.deepEqual(compileSoundReference('7.9, -1.9',api),{common:false,group:7,item:-1});
assert.throws(()=>compileSoundReference('F7',api),/group and item/);
console.log('Common/own sound prefixes route evaluated int32 group/item pairs; full PlaySnd parameters and prefix/version grammar remain uncertified');
