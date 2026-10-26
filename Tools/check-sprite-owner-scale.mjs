import assert from 'node:assert/strict';
import {spriteOwnerScale,commonFightFxScale,applySpriteOwnerScale} from '../Engine/sprite-owner-scale.js';
assert.equal(commonFightFxScale(1280,320,1),4);assert.equal(commonFightFxScale(640,0,1.5),3);
for(const [own,fx,scale]of [[1365,853,1.3],[1920,640,.7],[1280,320,2.3]])assert.equal(commonFightFxScale(own,fx,scale),Math.fround(Math.fround(Math.fround(Math.fround(scale)*320)/Math.fround(fx))*Math.fround(Math.fround(own)/320)));
assert.equal(spriteOwnerScale(1280,640),2);assert.equal(spriteOwnerScale(640,1280),.5);assert.equal(spriteOwnerScale(1280,640,{sameOwner:true}),1);
const calls=[],context={translate:(...args)=>calls.push(['translate',...args]),scale:(...args)=>calls.push(['scale',...args])};applySpriteOwnerScale(context,2,100,200);assert.deepEqual(calls,[['translate',100,200],['scale',2,2],['translate',-100,-200]]);calls.length=0;applySpriteOwnerScale(context,1,100,200);assert.deepEqual(calls,[]);
console.log('Sprite-owner localcoord compensation is float32 and pivots at the actor anchor without moving it');
