import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url),inventory=JSON.parse(readFileSync(new URL('Docs/CONTROLLER-AUDIT.json',root))),coverage=JSON.parse(readFileSync(new URL('Docs/CHANGE-ANIMATION-COVERAGE.json',root)));
assert.equal(coverage.referenceCommit,inventory.referenceCommit);
for(const name of ['changeanim','changeanim2']){const source=inventory.controllers.find(row=>row.controller===name),row=coverage.controllers[name];assert.deepEqual(Object.keys(row.parameters).sort(),source.parameterCandidates.slice().sort());assert.deepEqual(Object.keys(row.commonParameters).sort(),source.commonParameters.slice().sort());for(const field of [...Object.values(row.parameters),...Object.values(row.commonParameters)]){assert.ok(['partial','pending'].includes(field.status));assert.ok(field.remaining.length);for(const file of [...field.consumers,...field.evidence])assert.ok(existsSync(new URL(file,root)),file)}}
console.log('Both ChangeAnim inventories cover every pinned parameter/common field with explicit partial/pending evidence; no unsupported field is certified');
