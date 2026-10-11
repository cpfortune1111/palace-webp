import assert from 'node:assert/strict';
import {createAngleState,resetAngleDraw,applyAngleController,transformAngleDrawing} from '../Engine/angle-controllers.js';

const actor={angleState:createAngleState()},other={angleState:createAngleState()};
const api={evaluate:Number,split:expression=>String(expression).split(','),findActor:id=>id===2?other:null};
const run=(type,params)=>applyAngleController({type,params},actor,api);
run('AngleSet',{value:'30'});run('AngleAdd',{value:'15'});run('AngleMul',{value:'2'});assert.equal(actor.angleState.value,90);
run('AngleDraw',{scale:'2,3',pivot:'4,5'});run('AngleDraw',{scale:'0.5,2'});
assert.deepEqual(actor.angleState.scale,[1,6]);assert.deepEqual(actor.angleState.pivot,[4,5]);assert.equal(actor.angleState.enabled,true);
const calls=[],context={translate:(...args)=>calls.push(['translate',...args]),rotate:angle=>calls.push(['rotate',angle]),scale:(...args)=>calls.push(['scale',...args])};
transformAngleDrawing(context,actor.angleState);
assert.deepEqual(calls,[['translate',4,5],['rotate',-Math.PI/2],['scale',1,6],['translate',-4,-5]]);
resetAngleDraw(actor.angleState);assert.equal(actor.angleState.value,90);assert.equal(actor.angleState.enabled,false);assert.deepEqual(actor.angleState.scale,[1,1]);
run('AngleSet',{redirectid:'2',value:'20',xangle:'10',yangle:'5'});assert.equal(other.angleState.value,20);assert.equal(actor.angleState.value,90);
run('AngleMul',{});assert.equal(actor.angleState.value,0);
run('AngleDraw',{redirectid:'2'});assert.throws(()=>transformAngleDrawing(context,other.angleState),/3D projection/);
run('AngleSet',{});assert.equal(actor.angleState.value,0);
assert.equal(run('Null',{}),false);
console.log('Angle arithmetic, defaults, float state, redirected ownership, scale accumulation and pivot drawing passed');
