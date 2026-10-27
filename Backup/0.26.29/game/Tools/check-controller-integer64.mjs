import assert from 'node:assert/strict';
import {controllerInteger64} from '../Engine/controller-value-conversion.js';

assert.equal(controllerInteger64(4294967297),4294967297);assert.equal(controllerInteger64(-4294967297.9),-4294967297);assert.equal(controllerInteger64('4294967297'),0);assert.equal(controllerInteger64(undefined),0);assert.equal(controllerInteger64(NaN),0);assert.equal(controllerInteger64(true),1);assert.equal(controllerInteger64(-.5),0);
for(const value of [Infinity,-Infinity,2**63,-(2**64)])assert.equal(controllerInteger64(value),-(2**63));
assert.equal(controllerInteger64(-(2**63)),-(2**63));
console.log('Int64 controller extraction preserves wide frame indices, typed zero and pinned Windows/amd64 overflow sentinel; cross-architecture behavior remains uncertified');
