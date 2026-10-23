import assert from 'node:assert/strict';
import {applyAssertInputController} from '../Engine/assert-input.js';
import {applyAttackDistanceController} from '../Engine/attack-distance.js';
import {applyClsnOverrideController} from '../Engine/clsn-override.js';
import {applyClsnTransformController} from '../Engine/clsn-transform.js';
import {applyDepthController} from '../Engine/depth-controller.js';
import {applyFallEnvShake} from '../Engine/fall-env-shake.js';
import {applyGetHitVarSet} from '../Engine/get-hit-var-set.js';
import {applyHeightController} from '../Engine/height-controller.js';
import {applyHitFallController} from '../Engine/hit-fall-controllers.js';
import {applyOffsetController} from '../Engine/offset-controller.js';
import {applyPalFxController} from '../Engine/palfx-controller.js';
import {applyShiftInputController} from '../Engine/shift-input.js';
import {applyScoreController} from '../Engine/target-score.js';
import {applyTransController} from '../Engine/trans-controller.js';
import {applyWidthController} from '../Engine/width-controller.js';
import {createForceFeedback} from '../Engine/force-feedback.js';
import {excludesLegacyHelperFeedback} from '../Engine/helper-force-feedback.js';
import {createDebugClipboard} from '../Engine/debug-clipboard.js';

const feedback=createForceFeedback(()=>{throw Error('Missing recipient must not produce feedback')}),clipboard=createDebugClipboard();
const cases=[
 [applyAssertInputController,'AssertInput',{flag:'a'}],
 [applyAttackDistanceController,'AttackDist',{value:'rhs'}],
 [applyClsnOverrideController,'OverrideClsn',{rect:'rhs,0,0,0'}],
 [applyClsnTransformController,'TransformClsn',{scale:'rhs,1'}],
 [applyDepthController,'Depth',{value:'rhs'}],
 [applyFallEnvShake,'FallEnvShake',{}],
 [applyGetHitVarSet,'GetHitVarSet',{damage:'rhs'}],
 [applyHeightController,'Height',{value:'rhs'}],
 ...['HitFallSet','HitFallVel','HitFallDamage'].map(type=>[applyHitFallController,type,{}]),
 [applyOffsetController,'Offset',{x:'rhs'}],
 [applyPalFxController,'PalFX',{time:'rhs'}],
 [applyShiftInputController,'ShiftInput',{input:'a',output:'b'}],
 [applyScoreController,'ScoreAdd',{value:'rhs'}],
 [applyTransController,'Trans',{trans:'addalpha',alpha:'rhs,0'}],
 [applyWidthController,'Width',{value:'rhs'}],
 [(controller,caller,api)=>{feedback.execute(controller.params,caller,api);return true},'ForceFeedback',{time:'rhs'}],
 [excludesLegacyHelperFeedback,'ForceFeedback',{time:'rhs'}],
 ...['DisplayToClipboard','AppendToClipboard','ClearClipboard'].map(type=>[(controller,caller,api)=>clipboard.execute(controller,caller,api),type,{text:'"text"',params:'rhs'}])
];
for(const [apply,type,params]of cases)for(const [operand,expected]of [['7',0],[undefined,0],[NaN,0],[4294967303,7],[7.9,7],[-7.9,-7],[true,1]]){
 const ids=[],reads=[];
 assert.equal(apply({type,params:{...params,redirectid:'redirect'}},{},{
  evaluate:expression=>{reads.push(expression);return expression==='redirect'?operand:1},
  findActor:id=>{ids.push(id);return null}
 }),true);
 assert.deepEqual(ids,[expected],type+' redirect operand '+String(operand));
 assert.deepEqual(reads,['redirect'],type+' must skip payload on missing recipient');
}
console.log('Twenty-one additional controller types plus the legacy Helper feedback gate preserve native redirect integer extraction and missing-recipient early return');
