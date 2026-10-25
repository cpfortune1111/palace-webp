import assert from 'node:assert/strict';
import {applyModifyExplodController} from '../Engine/modify-explod.js';

const owner={},effects=[{},{}],writes=[],order=[];let ikemen=false;
const api={evaluate:value=>{order.push(value);return value==='custom'?17:value==='quoted'?'128':Number(value)},split:value=>String(value).split(','),select:()=>effects,ikemenVersion:()=>ikemen,localScale:()=>1,modify:(effect,actor,changes)=>writes.push(changes),randomFloat:()=>{throw Error('Unexpected random draw')}};
applyModifyExplodController({type:'ModifyExplod',params:{trans:'sub',alpha:'custom,custom'}},owner,api);assert.deepEqual(writes[0].transState,{type:'sub',alpha:[255,255]});assert.equal(order.includes('custom'),false);assert.equal(writes[0].transState,writes[1].transState);
ikemen=true;writes.length=0;order.length=0;applyModifyExplodController({type:'ModifyExplod',params:{trans:'sub',alpha:'custom,custom'}},owner,api);assert.deepEqual(writes[0].transState,{type:'sub',alpha:[17,17]});assert.deepEqual(order,['custom','custom']);
writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{trans:'addalpha',alpha:'300,-4'}},owner,api);assert.deepEqual(writes[0].transState,{type:'add',alpha:[255,0]});
writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{trans:'addalpha',alpha:'quoted,64'}},owner,api);assert.deepEqual(writes[0].transState,{type:'add',alpha:[0,64]});
assert.throws(()=>applyModifyExplodController({type:'ModifyExplod',params:{alpha:'128,64'}},owner,api),/without trans/);
writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{ignorehitpause:'0'}},owner,api);assert.equal(writes[0].ignoreHitPause,false);
writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{ignorehitpause:'quoted'}},owner,api);assert.equal(writes[0].ignoreHitPause,false);
writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{ignorehitpause:'-2'}},owner,api);assert.equal(writes[0].ignoreHitPause,true);
console.log('ModifyExplod Trans defaults, MUGEN Sub alpha suppression, single shared evaluation, clamp and string-to-zero conversion pass');
for(const [value,expected] of [['0',false],['quoted',false],['-2',true]]){
 writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{removeongethit:value}},owner,api);assert.equal(writes[0].removeOnGetHit,expected);assert.equal(writes.length,2);
}
writes.length=0;order.length=0;applyModifyExplodController({type:'ModifyExplod',params:{removeongethit:'custom',trans:'addalpha',alpha:'custom,custom'}},owner,{...api,select:()=>[]});assert.equal(writes.length,0);assert.deepEqual(order,[]);
console.log('ModifyExplod removeongethit typed boolean extraction and missing-selection short circuit pass');
for(const [value,expected] of [['0',false],['quoted',false],['-2',true]]){
 writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{removeonchangestate:value}},owner,api);assert.equal(writes[0].removeOnChangeState,expected);assert.equal(writes.length,2);
}
order.length=0;applyModifyExplodController({type:'ModifyExplod',params:{removeonchangestate:'custom',removeongethit:'1',trans:'addalpha',alpha:'3,4'}},owner,api);assert.deepEqual(order,['1','custom','3','4']);
console.log('ModifyExplod removeonchangestate typed boolean extraction and native modifier evaluation order pass');
