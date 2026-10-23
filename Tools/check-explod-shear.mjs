import assert from 'node:assert/strict';
import {compileExplodShear,applyExplodShear} from '../Engine/explod-shear.js';

assert.equal(compileExplodShear(undefined,()=>{throw Error('Unexpected evaluation')}),0);
assert.equal(compileExplodShear('operand',()=>.1),Math.fround(.1));
for(const value of ['1',NaN,undefined])assert.equal(compileExplodShear('operand',()=>value),0);
const events=[],context={translate:(...args)=>events.push(['translate',...args]),transform:(...args)=>events.push(['transform',...args])};
applyExplodShear(context,{value:1,zoom:2,verticalScale:3,height:10,axisY:4});
assert.deepEqual(events,[['transform',1,0,-2,1,0,0]]);events.length=0;
applyExplodShear(context,{value:1,zoom:2,verticalScale:3,height:10,axisY:4,angle:{enabled:true,value:90,xangle:0,yangle:0}});
assert.deepEqual(events,[['translate',-36,0],['transform',1,0,2,1,0,0]]);
events.length=0;applyExplodShear(context,{value:0});assert.deepEqual(events,[]);
console.log('Explod shear preserves float extraction, native unrotated sign and rotated sprite-axis compensation order');
