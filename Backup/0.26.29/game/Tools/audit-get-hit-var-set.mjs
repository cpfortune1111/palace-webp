import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getHitVarSetFields} from '../Engine/get-hit-var-set.js';

const referencePath=process.argv[2];
if(!referencePath)throw Error('Provide the pinned compiler-functions.go reference path');
const source=await readFile(referencePath,'utf8'),start=source.indexOf('func (c *CharCompiler) getHitVarSet('),end=source.indexOf('\nfunc ',start+1);
if(start<0||end<0)throw Error('Pinned GetHitVarSet function not found');
const body=source.slice(start,end),native=[...body.matchAll(/c\.paramValue\(is, sc, "([^"]+)"/g)].map(match=>match[1]);
if(/c\.stateParam\(is, "attr"/.test(body))native.push('attr');
const implemented=['redirectid',...getHitVarSetFields.map(field=>field[0])];
assert.deepEqual([...native].sort(),[...implemented].sort());
assert.match(body,/"hitcount",\s*getHitVarSet_hittime/);
assert.equal(native.includes('ground.animtype'),false);
console.log(JSON.stringify({reference:'cb56d73badb322f3725257c2e8cfd157b2c3989d',compiledParameterNames:native.length,dispatcherParameterNames:implemented.length,nameCoverage:true,semanticCertification:false,hitcountCompilerAlias:'hittime'},null,2));
