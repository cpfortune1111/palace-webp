import assert from 'node:assert/strict';
import {readHelperName} from '../Engine/helper-name.js';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
assert.equal(readHelperName({},'Guardian',{evaluate:()=>{throw Error('Unreachable')}}),"Guardian's helper");
assert.equal(readHelperName({},'',{}),"'s helper");
for(const value of ['Actual',42,undefined,NaN,false]){let count=0;assert.equal(readHelperName({name:'expression'},'Parent',{evaluate:()=>{count++;return value}}),typeof value==='string'?value:'');assert.equal(count,1)}
for(const [source,expected] of [['Loose Name','Loose Name'],['"Broken','"Broken'],['"Pair"','Pair']])assert.equal(readHelperName({name:source},'Parent',{evaluate:()=>{throw Error('parse')},loose:true}),expected);
assert.throws(()=>readHelperName({name:'invalid'},'Parent',{evaluate:()=>{throw Error('parse')}}),/parse/);
const owner={kind:'root',player:1,id:1,key:'root1',name:'Parent',facing:1,x:0,y:0,vars:[],maps:new Map()},data={character:'fixture',helperStates:{0:{type:'S',physics:'N',moveType:'I',controllers:[]}}};
for(const loose of [false,true]){const runtime=createSpecialRuntime({helperLooseNames:loose,root:()=>owner,data:()=>data,commands:()=>({}),context:()=>({player:1}),eval:value=>{if(value==='Unquoted name')throw Error('parse');return Number(value)},pair:value=>String(value).split(','),tick:()=>0});const spawn=()=>runtime.dispatch({type:'Helper',params:{name:'Unquoted name'}},null,null,{},owner,1);if(loose){spawn();assert.equal(runtime.entities[0].name,'Unquoted name')}else assert.throws(spawn,/parse/)}
console.log('Helper names retain native default derivation, expression string/undefined conversion, single evaluation and configured loose-syntax behavior');
