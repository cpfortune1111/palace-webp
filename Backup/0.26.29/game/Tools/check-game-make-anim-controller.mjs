import assert from 'node:assert/strict';
import {applyGameMakeAnimController} from '../Engine/game-make-anim-controller.js';

const caller={scale:2},recipient={scale:4},events=[];
let capacity=true,result;
const api={evaluate:expression=>{events.push(expression);return Number(expression)},findActor:identifier=>identifier===7?recipient:null,allocate:()=>capacity?{}:null,localScale:actor=>actor.scale,split:expression=>expression.split(','),randomFloat:(low,high)=>{events.push([low,high]);return high},drawOffset:()=>[3,5],animation:(effect,actor,value)=>{assert.equal(actor,recipient);assert.deepEqual(value,{prefix:'f',action:12});effect.anim=value.action},place:(effect,actor,position)=>{effect.position=position},commit:effect=>{result=effect}};
assert.equal(applyGameMakeAnimController({type:'Null'},caller,api),false);
applyGameMakeAnimController({type:'GameMakeAnim',params:{redirectid:'7',pos:'20,40,60',random:'8,12,16',under:'1',value:'F12'}},caller,api);
assert.deepEqual(result,{id:0,layerno:0,sprpriority:-2147483648,ownpal:true,anim:12,position:[9,18,34]});
assert.deepEqual(events,['7','20','40','60','8',[-2,2],'12',[-3,3],'16',[-4,4],'1','12']);
events.length=0;applyGameMakeAnimController({type:'GameMakeAnim',params:{redirectid:'99',pos:'bad'}},caller,api);assert.deepEqual(events,['99']);
events.length=0;capacity=false;applyGameMakeAnimController({type:'GameMakeAnim',params:{redirectid:'7',pos:'bad'}},caller,api);assert.deepEqual(events,['7']);
capacity=true;applyGameMakeAnimController({type:'GameMakeAnim',params:{}},caller,api);assert.deepEqual(result.position,[-3,-5,0]);assert.equal(result.layerno,1);
assert.throws(()=>applyGameMakeAnimController({type:'GameMakeAnim',params:{pos:'1,2,3,4'}},caller,api),/Invalid/);
assert.throws(()=>applyGameMakeAnimController({type:'GameMakeAnim',params:{ignored:'1'}},caller,api),/Unsupported/);
console.log('GameMakeAnim native extraction/allocation ordering, redirect scale, XYZ random, layer/defaults and draw-offset model checks pass; actual renderer checks run separately');
