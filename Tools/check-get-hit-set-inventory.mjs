import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getHitVarSetFields} from '../Engine/get-hit-var-set.js';

const source=await readFile(process.argv[2],'utf8'),start=source.indexOf('func (c *CharCompiler) getHitVarSet('),end=source.indexOf('\nfunc ',start+1);
assert.ok(start>=0&&end>start,'Pinned GetHitVarSet compiler block missing');
const native=[...source.slice(start,end).matchAll(/c\.(?:paramValue\(is, sc,|stateParam\(is,)\s*"([^"]+)"/g)].map(match=>match[1]),mapped=['redirectid',...getHitVarSetFields.map(field=>field[0])];
assert.equal(new Set(mapped).size,mapped.length);assert.deepEqual([...mapped].sort(),[...native].sort());
console.log(JSON.stringify({controller:'GetHitVarSet',pinnedParameterNames:native.length,absentNameHooks:0,certified:0,pending:'Native resource-consumption scheduler, full phase/version/query parity'}));
