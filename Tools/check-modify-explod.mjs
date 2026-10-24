import assert from 'node:assert/strict';
import {applyModifyExplodController} from '../Engine/modify-explod.js';

const caller={scale:2},owner={scale:4},effects=[{},{}],order=[],writes=[];let matches=true,ikemen=true;
const api={evaluate:value=>{order.push(value);return Number(value)},split:value=>value.split(','),findActor:id=>id===2?owner:null,select:(actor,id,index)=>{assert.equal(actor,owner);assert.equal(id,7);assert.equal(index,-1);return matches?effects:[]},ikemenVersion:()=>ikemen,localScale:actor=>actor.scale,randomFloat:(low,high)=>{order.push([low,high]);return high},modify:(effect,actor,changes)=>writes.push({effect,actor,changes})};
const controller={type:'ModifyExplod',params:{redirectid:'2',id:'7',random:'8,12,16'}};
applyModifyExplodController(controller,caller,api);assert.equal(writes.length,2);assert.deepEqual(writes[0].changes.spread,[2,3,4]);assert.equal(writes[0].changes.spread,writes[1].changes.spread);assert.deepEqual(order,['2','7','8',[-2,2],'12',[-3,3],'16',[-4,4]]);
order.length=0;matches=false;applyModifyExplodController(controller,caller,api);assert.deepEqual(order,['2','7']);
matches=true;ikemen=false;order.length=0;writes.length=0;applyModifyExplodController(controller,caller,api);assert.deepEqual(order,['2','7']);assert.equal(writes.length,0);
applyModifyExplodController({...controller,params:{...controller.params,postype:'p1'}},caller,api);assert.equal(writes.length,2);assert.equal(writes[0].changes.legacyReset,true);
assert.throws(()=>applyModifyExplodController({...controller,params:{...controller.params,anim:'1'}},caller,api),/Unsupported/);
ikemen=false;order.length=0;writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{redirectid:'2',id:'7',pos:'100',vel:'200',accel:'300',scale:'2,3'}},caller,api);assert.deepEqual(order,['2','7','2','3']);assert.deepEqual(writes[0].changes.spriteScale,[2,3]);assert.equal(writes[0].changes.positionActive,false);
ikemen=true;writes.length=0;applyModifyExplodController({type:'ModifyExplod',params:{redirectid:'2',id:'7',pos:'10,20,30',vel:'4,6,8',accel:'2,4,6',scale:'2'}},caller,api);assert.deepEqual(writes[0].changes.position,[5,10,15]);assert.deepEqual(writes[0].changes.velocity,[2,3,4]);assert.deepEqual(writes[0].changes.accel,[1,2,3]);assert.deepEqual(writes[0].changes.spriteScale,[2]);
console.log('ModifyExplod recipient/selector short circuits, MUGEN postype lock, shared XYZ samples and redirected local scale pass');
ikemen=false;writes.length=0;order.length=0;applyModifyExplodController({type:'ModifyExplod',params:{redirectid:'2',id:'7',friction:'.5'}},caller,api);assert.deepEqual(writes[0].changes.friction,[.5,0,0]);assert.deepEqual(order,['2','7','.5']);
