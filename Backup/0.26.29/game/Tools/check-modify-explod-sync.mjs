import assert from 'node:assert/strict';
import {readModifyExplodSync,applyModifyExplodSync} from '../Engine/modify-explod-sync.js';
import {applyModifyExplodController} from '../Engine/modify-explod.js';

const order=[],api={evaluate:value=>{order.push(value);return value==='quoted'?'1':Number(value)}};
assert.deepEqual(readModifyExplodSync({syncid:'-1',synclayer:'-3.9',syncparams:'-1'},api),{synclayer:-3,syncparams:true,syncid:-1});assert.deepEqual(order,['-3.9','-1','-1']);
assert.deepEqual(readModifyExplodSync({syncparams:'quoted'},api),{syncparams:false});
const effect={};applyModifyExplodSync(effect,77,{synclayer:-3,syncparams:false,syncid:-1});assert.deepEqual(effect,{syncId:77,syncLayer:-3,syncParams:false});
applyModifyExplodSync(effect,88,{synclayer:0});assert.deepEqual(effect,{syncId:77,syncLayer:0,syncParams:false});applyModifyExplodSync(effect,88,{syncid:0});assert.equal(effect.syncId,0);
const defaults={};applyModifyExplodSync(defaults,7,{});assert.deepEqual(defaults,{syncId:-1,syncLayer:0,syncParams:true});
order.length=0;const writes=[];applyModifyExplodController({type:'ModifyExplod',params:{scale:'2',synclayer:'3',syncparams:'0',syncid:'-1',bindid:'4',bindtime:'5'}},{},{...api,split:value=>value.split(','),select:()=>[{}],ikemenVersion:()=>false,localScale:()=>1,modify:(effect,owner,changes)=>writes.push(changes)});assert.deepEqual(order,['2','3','0','-1','4','5']);assert.deepEqual(writes[0].sync,{synclayer:3,syncparams:false,syncid:-1});
order.length=0;applyModifyExplodController({type:'ModifyExplod',params:{syncparams:'1'}},{},{...api,split:value=>value.split(','),select:()=>[],ikemenVersion:()=>false,localScale:()=>1,modify:()=>{throw Error('Unexpected write')}});assert.deepEqual(order,[]);
console.log('ModifyExplod sync fields preserve typed values, compiler order, recipient-relative -1 IDs, zero disabling, defaults, partial writes and missing-selector short circuits');
