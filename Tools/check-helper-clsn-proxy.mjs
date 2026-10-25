import assert from 'node:assert/strict';
import {clsnProxyFamily} from '../Engine/helper-clsn-proxy.js';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
const root={key:'root1',player:1},proxy=(key,parentKey,extra={})=>({kind:'helper',key,parentKey,player:1,clsnProxy:true,...extra}),one=proxy('one',null),two=proxy('two','root1'),nested=proxy('nested','one'),ordinary=proxy('ordinary','root1',{clsnProxy:false}),blocked=proxy('blocked','ordinary'),deleted=proxy('deleted','root1',{destroyed:true}),other=proxy('other',null,{player:2}),orphan=proxy('orphan','missing:one');
const helpers=[one,nested,two,ordinary,blocked,deleted,other,orphan];
assert.deepEqual(clsnProxyFamily(root,helpers),[root,one,two,nested]);assert.deepEqual(clsnProxyFamily(root,helpers,{group:3}),[root]);assert.deepEqual(clsnProxyFamily(ordinary,helpers),[ordinary,blocked]);
one.standby=true;assert.deepEqual(clsnProxyFamily(root,helpers),[root,one,two,nested]);one.destroyed=true;assert.deepEqual(clsnProxyFamily(root,helpers),[root,two]);
const cycle=proxy('cycle','cycle');assert.deepEqual(clsnProxyFamily(cycle,[cycle]),[cycle]);
for(const [value,expected]of [[undefined,false],[0,false],[1,true],[-1,true],['1',false]]){
 const owner={kind:'root',player:1,id:1,key:'root1',x:0,y:0,facing:1,lifeMax:1000,maps:new Map()},data={character:'fixture',powerMaximum:1000,helperStates:{0:{type:'S',physics:'N',moveType:'I',controllers:[]}}};let reads=0;
 const runtime=createSpecialRuntime({root:()=>owner,data:()=>data,commands:()=>({}),context:()=>({player:1}),eval:expression=>{if(expression==='flag'){reads++;return value}return Number(expression)},pair:expression=>String(expression).split(','),tick:()=>0});runtime.dispatch({type:'Helper',params:value===undefined?{}:{clsnproxy:'flag'}},owner,null,{},owner,1);assert.equal(runtime.entities[0].clsnProxy,expected);assert.equal(reads,value===undefined?0:1);
}
console.log('Collision proxy families follow live proxy-only parent links breadth-first, preserve inactive branch traversal, exclude foreign/orphan/deleted branches and keep Size local');
