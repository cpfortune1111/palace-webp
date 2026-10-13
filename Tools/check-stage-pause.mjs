import assert from 'node:assert/strict';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
import {createStageBackgroundRegistry} from '../Engine/stage-backgrounds.js';
import {evaluatePalFxDefinition} from '../Engine/palfx-controller.js';

const backgrounds=createStageBackgroundRegistry();backgrounds.replace([{id:7}]);
backgrounds.setPalette(backgrounds.entries[0],evaluatePalFxDefinition({time:3,color:0},Number));
const root={player:1,state:0,time:0,x:0,y:0,facing:1},runtime=createSpecialRuntime({root:()=>root,tick:()=>1,eval:Number,finishPaletteEffects:()=>backgrounds.tick({paused:runtime.stagePaused()})});
const pause=(type,player,pausebg)=>runtime.dispatch({type,params:{time:5,pausebg}},null,{}, {},{...root,player},player);
pause('Pause',1,0);assert.equal(runtime.stagePaused(),false);runtime.finishTick();assert.equal(backgrounds.entries[0].palFx.definition.time,2);
pause('Pause',1,1);assert.equal(runtime.stagePaused(),true);runtime.finishTick();assert.equal(backgrounds.entries[0].palFx.definition.time,2);
pause('SuperPause',2,0);assert.equal(runtime.stagePaused(),true);
pause('Pause',2,0);assert.equal(runtime.stagePaused(),false);
pause('SuperPause',1,1);assert.equal(runtime.stagePaused(),true);
pause('SuperPause',2,0);assert.equal(runtime.stagePaused(),false);
assert.equal(runtime.pauses.normal[0].remaining,5);
assert.equal(runtime.pauses.super[0].remaining,5);
console.log('Actual Pause/SuperPause pausebg slots use last-writer flags and preserve per-BG clocks');