import assert from 'node:assert/strict';
import {spriteOwnerScale,applySpriteOwnerScale} from '../Engine/sprite-owner-scale.js';
assert.equal(spriteOwnerScale(1280,640),2);assert.equal(spriteOwnerScale(640,1280),.5);assert.equal(spriteOwnerScale(1280,640,{sameOwner:true}),1);
const calls=[],context={translate:(...args)=>calls.push(['translate',...args]),scale:(...args)=>calls.push(['scale',...args])};applySpriteOwnerScale(context,2,100,200);assert.deepEqual(calls,[['translate',100,200],['scale',2,2],['translate',-100,-200]]);calls.length=0;applySpriteOwnerScale(context,1,100,200);assert.deepEqual(calls,[]);
console.log('Sprite-owner localcoord compensation is float32 and pivots at the actor anchor without moving it');
