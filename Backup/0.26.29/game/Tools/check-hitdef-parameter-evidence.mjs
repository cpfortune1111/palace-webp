import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';

const ledger=JSON.parse(await readFile(new URL('../Docs/HITDEF-PARAMETER-EVIDENCE.json',import.meta.url),'utf8')),keys=new Set();
assert.match(ledger.scope,/not the complete/);
for(const row of ledger.rows){
 const key=row.controller+'.'+row.parameter;
 assert.equal(keys.has(key),false,'Duplicate parameter evidence: '+key);keys.add(key);
 assert.ok(['Partial','Preparatory','Certified'].includes(row.status));
 assert.ok(row.runtime&&row.tests.length);
 for(const test of row.tests)await access(new URL(test,import.meta.url));
 if(row.status==='Certified')assert.equal(row.pending.length,0);else assert.ok(row.pending.length);
}
assert.equal(ledger.certifiedParameters,ledger.rows.filter(row=>row.status==='Certified').length);
console.log('Incremental HitDef evidence rows have unique identities, existing tests and honest pending/certification accounting');
