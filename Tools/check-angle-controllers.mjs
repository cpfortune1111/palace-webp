import assert from 'node:assert/strict';
import {createAngleState,resetAngleDraw,applyAngleController,transformAngleDrawing,orthographicAngleMatrix,snapshotAngleState} from '../Engine/angle-controllers.js';

const actor={angleState:createAngleState()},other={angleState:createAngleState()};
const api={evaluate:Number,split:expression=>String(expression).split(','),findActor:id=>id===2?other:null};
const run=(type,params)=>applyAngleController({type,params},actor,api);
run('AngleSet',{value:'30'});run('AngleAdd',{value:'15'});run('AngleMul',{value:'2'});assert.equal(actor.angleState.value,90);
run('AngleDraw',{scale:'2,3',pivot:'4,5'});run('AngleDraw',{scale:'0.5,2'});
assert.deepEqual(actor.angleState.scale,[1,6]);assert.deepEqual(actor.angleState.pivot,[4,5]);assert.equal(actor.angleState.enabled,true);
const calls=[],context={translate:(...args)=>calls.push(['translate',...args]),transform:(...args)=>calls.push(['transform',...args]),scale:(...args)=>calls.push(['scale',...args])};
transformAngleDrawing(context,actor.angleState);
assert.deepEqual(calls,[['translate',4,5],['transform',...orthographicAngleMatrix(actor.angleState),0,0],['scale',1,6],['translate',-4,-5]]);
resetAngleDraw(actor.angleState);assert.equal(actor.angleState.value,90);assert.equal(actor.angleState.enabled,false);assert.deepEqual(actor.angleState.scale,[1,1]);
run('AngleSet',{redirectid:'2',value:'20',xangle:'10',yangle:'5'});assert.equal(other.angleState.value,20);assert.equal(actor.angleState.value,90);
run('AngleMul',{});assert.equal(actor.angleState.value,0);
run('AngleDraw',{redirectid:'2'});transformAngleDrawing(context,other.angleState);
run('AngleSet',{});assert.equal(actor.angleState.value,0);
assert.equal(run('Null',{}),false);
console.log('Angle arithmetic, defaults, float state, redirected ownership, scale accumulation and pivot drawing passed');
for(const [xangle,yangle,value] of [[0,0,90],[60,0,0],[0,60,0],[20,35,70],[-40,65,-130]]){
 const state={xangle,yangle,value},matrix=orthographicAngleMatrix(state);
 for(const [pointX,pointY] of [[1,0],[0,1],[25,-70]]){
  const radians=Math.PI/180;
  const nativeX=pointX,nativeY=-pointY;
  const rotatedX=nativeX*Math.cos(value*radians)-nativeY*Math.sin(value*radians);
  const rotatedY=nativeX*Math.sin(value*radians)+nativeY*Math.cos(value*radians);
  const yRotatedX=rotatedX*Math.cos(yangle*radians),yRotatedZ=-rotatedX*Math.sin(yangle*radians);
  const finalY=rotatedY*Math.cos(-xangle*radians)-yRotatedZ*Math.sin(-xangle*radians);
  assert.ok(Math.abs(matrix[0]*pointX+matrix[2]*pointY-yRotatedX)<1e-8);
  assert.ok(Math.abs(matrix[1]*pointX+matrix[3]*pointY+finalY)<1e-8);
 }
}
console.log('Native X(-x) × Y(y) × Z(z) orthographic matrix order passed');
const saved=snapshotAngleState(other.angleState);
const savedScale=[...saved.scale],savedPivot=[...saved.pivot],savedValue=saved.value;
resetAngleDraw(other.angleState);
other.angleState.scale[0]=7;other.angleState.pivot[1]=11;other.angleState.value=180;
assert.deepEqual(saved.scale,savedScale);assert.deepEqual(saved.pivot,savedPivot);assert.equal(saved.value,savedValue);assert.equal(saved.enabled,true);
console.log('Afterimage angle snapshots remain independent of later ticks');

for(const type of ['AngleSet','AngleMul']){
 actor.angleState.value=10;actor.angleState.xangle=20;actor.angleState.yangle=30;
 const observed=[];
 applyAngleController({type,params:{value:'2',xangle:'angle'}},actor,{...api,evaluate:expression=>{observed.push(expression);return expression==='angle'?actor.angleState.value:Number(expression)}});
 assert.equal(actor.angleState.value,type==='AngleSet'?2:20);
 assert.equal(actor.angleState.xangle,type==='AngleSet'?10:200);
 assert.equal(actor.angleState.yangle,0);
 assert.deepEqual(observed,['2','angle']);
}
console.log('AngleSet/AngleMul sample supplied operands before committing any axis and do not evaluate omitted defaults');

