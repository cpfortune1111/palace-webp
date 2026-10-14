import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';

const reads=[];
const runtime=createSpecialRuntime({data:player=>({constants:{'default.attack.lifetopowermul':player===2?0.25:0.7}}),pair:value=>String(value).split(','),eval:value=>{reads.push(value);return ({damage:101,attack:11,guard:3,receive:9})[value]??Number(value)}});
const defaults=runtime.numeric({attr:'S, NA',damage:'damage,0'},{player:2});
assert.equal(defaults.damage,'101,0');
assert.equal(defaults.getpower,'25,12');
assert.equal(defaults.givepower,'60,30');
const nullContext=runtime.numeric({attr:'S, NA',damage:'101,0'},null,2);
assert.equal(nullContext.getpower,'25,12');
reads.length=0;
const explicit=runtime.numeric({attr:'S, NA',damage:'100,0',getpower:'attack,guard',givepower:'receive'},{player:1});
assert.equal(explicit.getpower,'11,3');
assert.equal(explicit.givepower,'9,4');
assert.deepEqual(reads.filter(value=>['attack','guard','receive'].includes(value)),['attack','guard','receive']);
console.log('Live shared HitDef numeric compiler uses caller constants, raw compiled damage and evaluates each supplied power expression once');
