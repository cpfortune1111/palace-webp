import assert from 'node:assert/strict';
import {applyStateDefTypes} from '../Engine/state-def-types.js';

const actor={type:'C',moveType:'H',physics:'C'},set=(name,value)=>{actor[name]=value};
assert.equal(applyStateDefTypes({}, {set}),true);assert.deepEqual(actor,{type:'S',moveType:'I',physics:'N'});
Object.assign(actor,{type:'C',moveType:'H',physics:'C'});applyStateDefTypes({type:'U',moveType:'u',physics:'U'},{set});assert.deepEqual(actor,{type:'C',moveType:'H',physics:'C'});
applyStateDefTypes({type:'a',physics:'n'},{set});assert.deepEqual(actor,{type:'A',moveType:'I',physics:'N'});
assert.equal(applyStateDefTypes(null,{set}),false);
console.log('Pinned newStateBytecode intrinsic defaults are S/I/N, while explicit U retains the prior field; omission is not U inheritance');
