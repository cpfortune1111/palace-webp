import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dataConstant,dataConstantNames} from '../Engine/data-constants.js';

const audit=JSON.parse(readFileSync(new URL('../Docs/CONST-AUDIT.json',import.meta.url),'utf8'));
assert.deepEqual([...dataConstantNames].sort(),audit.rows.filter(row=>row.name.startsWith('data.')).map(row=>row.name).sort());
const {dataConstants:values}=JSON.parse(readFileSync(new URL('./fixtures/data-constants.json',import.meta.url),'utf8'));
for(const name of dataConstantNames)assert.deepEqual(dataConstant(name.toUpperCase(),values),{handled:true,value:values[name]});
assert.deepEqual(dataConstant('size.xscale',values),{handled:false});
assert.deepEqual(dataConstant('data.attack'),{handled:false});
assert.deepEqual(dataConstant('data.fall.defence_mul',{'data.fall.defence_mul':'Infinity'}),{handled:true,value:Infinity});
assert.equal(dataConstant('data.life',{'data.life':2147483647}).value,2147483647);
console.log('All eighteen native Data Const names read typed imported values without resource or coordinate conversion');
