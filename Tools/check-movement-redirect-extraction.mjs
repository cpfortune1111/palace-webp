import assert from 'node:assert/strict';
import {applyPositionController} from '../Engine/position-controllers.js';
import {applyVelocityController} from '../Engine/velocity-controllers.js';
import {applyAngleController} from '../Engine/angle-controllers.js';
import {applyAttackController} from '../Engine/attack-controllers.js';
import {applyDefenseController} from '../Engine/defense-controllers.js';
import {applyStatePropertyController} from '../Engine/state-properties.js';

for(const [apply,type]of [[applyPositionController,'PosSet'],[applyPositionController,'PosAdd'],...['VelSet','VelAdd','VelMul','HitVelSet'].map(type=>[applyVelocityController,type]),...['AngleSet','AngleAdd','AngleMul','AngleDraw'].map(type=>[applyAngleController,type]),[applyAttackController,'AttackMulSet'],[applyDefenseController,'DefenceMulSet'],...['CtrlSet','StateTypeSet','Turn','SprPriority'].map(type=>[applyStatePropertyController,type])]){
 for(const [operand,expected]of [['7',0],[undefined,0],[NaN,0],[4294967303,7],[7.9,7],[-7.9,-7],[true,1]]){
  const ids=[],reads=[],caller={localScale:1,facing:1};
  apply({type,params:{redirectid:'redirect',x:'rhs'}},caller,{
   evaluate:expression=>{reads.push(expression);return expression==='redirect'?operand:1},
   findActor:id=>{ids.push(id);return null}
  });
  assert.deepEqual(ids,[expected],type+' redirect operand '+String(operand));
  assert.deepEqual(reads,['redirect']);
 }
}
console.log('Sixteen movement/angle/attack/defense/state controller redirect IDs use native string/undefined zero and signed integer extraction before RHS evaluation');
