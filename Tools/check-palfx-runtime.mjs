import assert from 'node:assert/strict';
import {evaluatePalFxDefinition} from '../Engine/palfx-controller.js';
import {createPalFxRuntime,stepPalFx,refreshPalFx,tickPalFx,samplePalFx} from '../Engine/palfx-runtime.js';

const runtime=createPalFxRuntime(evaluatePalFxDefinition({time:2,add:'1,2,3',sinadd:'40,0,0,4'},Number));
stepPalFx(runtime);assert.deepEqual(samplePalFx(runtime).add,[1,2,3]);assert.equal(runtime.definition.time,1);
stepPalFx(runtime);assert.deepEqual(samplePalFx(runtime).add,[41,2,3]);assert.equal(runtime.definition.time,0);
refreshPalFx(runtime);assert.deepEqual(samplePalFx(runtime).add,[0,0,0]);tickPalFx(runtime);assert.deepEqual(runtime.phase,[2,0,0,0]);
const permanent=createPalFxRuntime(evaluatePalFxDefinition({time:-1,sinadd:'100,0,0,-2',invertall:1},Number,{mugen11:true}));
stepPalFx(permanent);assert.equal(permanent.effective.add[0],-70);assert.equal(permanent.effective.invertblend,3);assert.equal(permanent.definition.time,-1);
stepPalFx(permanent);assert.equal(permanent.effective.add[0],70);assert.equal(permanent.phase[0],0);
console.log('PalFX refresh/timer separation, expiry, permanent time and native two-tick sine phase passed');