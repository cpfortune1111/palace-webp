import {readFile} from 'node:fs/promises';
import {getMoveHitVar,createMoveHitData} from '../Engine/move-hit-data.js';

const referencePath=process.argv[2];if(!referencePath)throw Error('Provide pinned compiler.go path');
const reference=await readFile(referencePath,'utf8'),start=reference.indexOf('case "movehitvar":'),end=reference.indexOf('case "mugenversion":',start);
if(start<0||end<0)throw Error('Pinned MoveHitVar compiler section missing');
const names=[...new Set([...reference.slice(start,end).matchAll(/case ((?:"[^"]+"(?:,\s*)?)+):/g)].flatMap(match=>[...match[1].matchAll(/"([^"]+)"/g)].map(value=>value[1])))].filter(name=>name!=='movehitvar').sort();
const source=await readFile(new URL('../index.html',import.meta.url),'utf8'),getterStart=source.indexOf('function getMoveHitValueM1('),getterEnd=source.indexOf('\nfunction ',getterStart+1),getter=source.slice(getterStart,getterEnd),whitelist=getter.match(/!\[([^\]]+)\]\.includes\(key\)/);
if(!whitelist)throw Error('Live MoveHitVar whitelist missing');
const live=new Set([...whitelist[1].matchAll(/'([^']+)'/g)].map(match=>match[1]));
const rows=names.map(name=>({name,moduleDispatch:getMoveHitVar(createMoveHitData(),name).handled,liveNameDispatch:live.has(name),semanticCertification:false}));
console.log(JSON.stringify({reference:'cb56d73badb322f3725257c2e8cfd157b2c3989d',nativeQueryNames:rows.length,missingModuleDispatch:rows.filter(row=>!row.moduleDispatch).map(row=>row.name),missingLiveNameDispatch:rows.filter(row=>!row.liveNameDispatch).map(row=>row.name),scope:'Name-dispatch audit only; helper cornerpush, reversal sparks, target-buffer/phase/ownership semantics remain partial',rows},null,2));
