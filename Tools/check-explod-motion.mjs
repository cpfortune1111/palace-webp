import assert from 'node:assert/strict';
import {stepModifiedExplodMotion} from '../Engine/explod-motion.js';

const effect={x:10,y:20,z:30,vx:4,vy:5,vz:6,friction:[.5,0,2],accel:[1,2,3]};
stepModifiedExplodMotion(effect);assert.deepEqual([effect.x,effect.y,effect.z,effect.vx,effect.vy,effect.vz],[14,25,36,3,2,15]);
stepModifiedExplodMotion(effect);assert.deepEqual([effect.x,effect.y,effect.z,effect.vx,effect.vy,effect.vz],[17,27,51,2.5,2,33]);
const threshold={vx:.1,vy:.1,vz:.1,friction:[.5,1,-.5]};stepModifiedExplodMotion(threshold);assert.deepEqual([threshold.vx,threshold.vy,threshold.vz],[0,Math.fround(.1),0]);
const retained={vx:.2,friction:[.5,1,1]};stepModifiedExplodMotion(retained);assert.equal(retained.vx,Math.fround(.1));
console.log('Modified Explod XYZ motion preserves move-before-friction/acceleration order, float32 rounding and native small-speed stop threshold');
