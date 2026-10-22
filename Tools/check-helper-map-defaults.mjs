import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
import {applyMapController} from '../Engine/map-controllers.js';
import {readStoredMapValue,writeStoredMapValue} from '../Engine/map-value-types.js';

for(const player of [1,2]){
 const defaults=new Map();
 const expected=[['float',{type:'float',value:3}],['int',{type:'int',value:3}],['text',{type:'string',value:'Guardian'}],['flag',{type:'bool',value:true}],['bottom',{type:'undefined',value:NaN}]];
 for(const [name,sample] of expected)writeStoredMapValue(defaults,name,sample);
 const root={player,state:0,x:0,y:0,facing:player===1?1:-1,vars:[],moveType:'I',mapDefaults:defaults};
 const runtime=createSpecialRuntime({
  root:()=>root,context:()=>({query:()=>0}),commands:()=>({}),
  eval:Number,pair:value=>String(value).split(','),effects:[],tick:()=>0,
  data:()=>({helperStates:{1:{type:'S',physics:'N',anim:0,controllers:[]}},lifecycleHelpers:{}}),
  trigger:()=>true,controller:()=>{},advance:()=>{},frames:()=>[{time:1}],duration:()=>1000,
  collision:()=>({contact:false}),attack:()=>null,background:()=>{}
 });
 runtime.dispatch({type:'Helper',params:{id:'1',stateno:'1'}},null,null,{},root,player);
 const helper=runtime.entities[0];
 assert.notEqual(helper.maps,defaults);
 assert.notEqual(helper.mapDefaults,defaults);
 assert.notEqual(helper.maps,helper.mapDefaults);
 for(const [name,sample] of expected){
  assert.deepEqual(readStoredMapValue(helper.maps,name),sample);
  assert.deepEqual(readStoredMapValue(helper.mapDefaults,name),sample);
  writeStoredMapValue(helper.maps,name,{type:'int',value:99});
 }
 applyMapController({type:'MapReset',params:{}},helper,{evaluate:Number});
 for(const [name,sample] of expected){
  assert.deepEqual(readStoredMapValue(helper.maps,name),sample);
  assert.deepEqual(readStoredMapValue(defaults,name),sample);
 }
 helper.maps.delete('float');
 applyMapController({type:'MapReset',params:{}},helper,{evaluate:Number});
 assert.deepEqual(readStoredMapValue(helper.maps,'float'),{type:'float',value:3});
}
console.log('Actual Helper creation preserves independent typed defaults and MapReset for both player slots');
