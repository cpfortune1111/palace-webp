import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';

const reference=await readFile(process.argv[2],'utf8'),start=reference.indexOf('func (c *CharCompiler) modifyPlayer('),end=reference.indexOf('func (c *CharCompiler) assertCommand(',start);
assert.ok(start>=0&&end>start,'Pinned compiler block missing');
const names=[...reference.slice(start,end).matchAll(/c\.(?:paramValue\(is, sc,|stateParam\(is,)\s*"([^"]+)"/g)].map(match=>match[1]);
const ledger=JSON.parse(await readFile(new URL('../Docs/MODIFY-PLAYER-PARAMETERS.json',import.meta.url),'utf8')),listed=[...ledger.partial,...ledger.unimplemented];
assert.equal(new Set(listed).size,listed.length);assert.deepEqual([...listed].sort(),[...names].sort());
assert.equal(ledger.certifiedParameters,0);assert.ok(ledger.pending.length);
for(const test of ledger.tests)await access(new URL(test,import.meta.url));
const runtime=await readFile(new URL('../Engine/modify-player.js',import.meta.url),'utf8'),supported=runtime.match(/if\(!\[(.*?)\]\.includes\(name\)\)/)?.[1];
assert.ok(supported,'Runtime whitelist missing');
assert.deepEqual([...supported.matchAll(/'([^']+)'/g)].map(match=>match[1]).sort(),[...ledger.partial].sort());
console.log(JSON.stringify({parameters:names.length,partial:ledger.partial.length,unimplemented:ledger.unimplemented.length,certified:0}));
