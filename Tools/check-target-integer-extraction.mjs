import assert from 'node:assert/strict';
import {applyTargetStateController} from '../Engine/target-state.js';
import {applyTargetFacingController,applyTargetDropController} from '../Engine/target-list.js';
import {applyTargetPowerController} from '../Engine/target-power.js';
import {applyTargetLifeController} from '../Engine/target-life.js';
import {applyTargetScoreController} from '../Engine/target-score.js';
import {applyTargetVelocityController} from '../Engine/target-velocity.js';
import {applyTargetRedLifeController} from '../Engine/target-redlife.js';
import {applyTargetPointController} from '../Engine/target-points.js';
import {applyTargetBindController} from '../Engine/target-bind.js';

const cases=[
 [applyTargetStateController,'TargetState'],[applyTargetFacingController,'TargetFacing'],[applyTargetDropController,'TargetDrop'],
 [applyTargetPowerController,'TargetPowerAdd'],[applyTargetLifeController,'TargetLifeAdd'],[applyTargetScoreController,'TargetScoreAdd'],
 ...['TargetVelSet','TargetVelAdd'].map(type=>[applyTargetVelocityController,type]),
 [applyTargetRedLifeController,'TargetRedLifeAdd'],...['TargetDizzyPointsAdd','TargetGuardPointsAdd'].map(type=>[applyTargetPointController,type]),
 [applyTargetBindController,'TargetBind']
];
for(const [apply,type]of cases){
 for(const [operand,expected]of [['7',0],[undefined,0],[NaN,0],[4294967303,7],[7.9,7],[-7.9,-7],[true,1]]){
  const reads=[],ids=[];
  assert.equal(apply({type,params:{redirectid:'redirect',value:'rhs',x:'rhs'}},{},{
   evaluate:expression=>{reads.push(expression);return expression==='redirect'?operand:1},
   findActor:id=>{ids.push(id);return null}
  }),true);
  assert.deepEqual(ids,[expected],type+' redirect extraction');
  assert.deepEqual(reads,['redirect'],type+' missing recipient skips payload');
 }
 if(type==='TargetDrop')continue;
 const selected=[],caller={facing:1};
 apply({type,params:{id:'hitId',index:'targetIndex',value:1,x:1}},caller,{
  evaluate:expression=>expression==='hitId'?'7':expression==='targetIndex'?'8':expression,
  findActor:()=>null,targets:()=>({select:(...args)=>{selected.push(args.slice(0,2));return []}}),
  stateOwner:()=>caller,scale:()=>1,localScale:()=>1,compatibility:()=> 'ikemen'
 });
 assert.deepEqual(selected,[[0,0]],type+' ID/index extraction');
}
for(const [operand,expected]of [['1',false],[undefined,false],[NaN,false],[0.5,true],[-1,true],[0,false]]){
 let dropped;
 applyTargetDropController({type:'TargetDrop',params:{excludeid:'exclude',keepone:'flag'}},{},{
  evaluate:expression=>expression==='exclude'?'7':operand,findActor:()=>null,
  targets:()=>({drop:options=>{dropped=options}})
 });
 assert.equal(dropped.excludeId,0);
 assert.equal(dropped.keepOne,expected,'TargetDrop boolean extraction');
 for(const type of ['TargetDizzyPointsAdd','TargetGuardPointsAdd']){
  const amounts=[],target={life:1000,finalDefense:2};
  applyTargetPointController({type,params:{value:10,absolute:'flag'}},{},{
   evaluate:expression=>expression==='flag'?operand:expression,
   findActor:()=>target,targets:()=>({select:()=>[9]}),excluded:()=>false,
   resource:()=>target,compatibility:()=> 'ikemen',add:(actor,field,amount)=>amounts.push(amount)
  });
  assert.deepEqual(amounts,[expected?10:5],type+' absolute extraction');
 }
}
console.log('Twelve Target controller types preserve native integer selection and TargetDrop/point boolean extraction');
