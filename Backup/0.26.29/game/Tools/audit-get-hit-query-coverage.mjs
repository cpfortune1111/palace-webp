import {readFile} from 'node:fs/promises';
import {getHitScalar} from '../Engine/get-hit-scalar.js';
import {getHitQueryScale} from '../Engine/get-hit-query-scale.js';

const referencePath=process.argv[2];
if(!referencePath)throw Error('Provide pinned compiler.go path');
const reference=await readFile(referencePath,'utf8'),start=reference.indexOf('case "gethitvar":'),end=reference.indexOf('case "groundlevel":',start);
if(start<0||end<0)throw Error('Native GetHitVar compiler section not found');
const nativeNames=[...new Set([...reference.slice(start+'case "gethitvar":'.length,end).matchAll(/case ((?:"[^"]+"(?:,\s*)?)+):/g)].flatMap(match=>[...match[1].matchAll(/"([^"]+)"/g)].map(value=>value[1])))].sort();
const source=await readFile(new URL('../index.html',import.meta.url),'utf8'),getterStart=source.indexOf('function getHitValueM1('),getterEnd=source.indexOf('\nfunction ',getterStart+1),getter=source.slice(getterStart,getterEnd);
const fallback= getter.match(/if\(!\[([^\]]+)\]\.includes\(key\)\)/);
if(!fallback)throw Error('GetHitVar fallback whitelist not found');
const explicit=new Set([...fallback[1].matchAll(/'([^']+)'/g)].map(match=>match[1]));
for(const match of getter.matchAll(/key==='([^']+)'/g))explicit.add(match[1]);
const populated=Object.fromEntries(nativeNames.map(name=>[name,1])),rows=nativeNames.map(name=>({name,populatedDispatch:explicit.has(name)||getHitScalar(populated,name).handled||getHitQueryScale(populated,name,1).handled,emptyDispatch:explicit.has(name)||getHitScalar({},name).handled||getHitQueryScale({},name,1).handled,semanticCertification:false}));
console.log(JSON.stringify({reference:'cb56d73badb322f3725257c2e8cfd157b2c3989d',nativeQueryNames:rows.length,missingDispatch:rows.filter(row=>!row.populatedDispatch).map(row=>row.name),missingEmptyDispatch:rows.filter(row=>!row.emptyDispatch).map(row=>row.name),scope:'Static/shared-module name-dispatch audit only; not gameplay/default/semantic certification',rows},null,2));
