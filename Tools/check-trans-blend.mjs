import assert from 'node:assert/strict';
import {transBlendPasses,blendPixel} from '../Engine/trans-blend.js';

assert.deepEqual(transBlendPasses({type:'add',alpha:[0,255]}),[]);
assert.deepEqual(blendPixel([100,100,100],[60,30,90,255],transBlendPasses({type:'add',alpha:[255,255]})),[160,130,190]);
assert.deepEqual(blendPixel([100,100,100],[60,30,90,255],transBlendPasses({type:'sub',alpha:[255,255]})),[40,70,10]);
assert.deepEqual(blendPixel([100,100,100],[60,30,90,255],transBlendPasses({type:'none',alpha:[255,255]})),[60,30,90]);
const translucent=blendPixel([100,100,100],[60,30,90,128],transBlendPasses({type:'add',alpha:[128,64]}));
const expected=100*(1-(1-64/255)*128/255)+60*(128/255)*(128/255);
assert.ok(Math.abs(translucent[0]-expected)<0.000001);
assert.deepEqual(transBlendPasses({type:'subadd',alpha:[255,255]}).map(pass=>[pass.equation,pass.gray]),[['subtract',true],['add',false]]);
assert.deepEqual(transBlendPasses({type:'subadd',alpha:[255,255]},{negative:true}).map(pass=>pass.equation),['add','subtract']);
console.log('Native blend pass ordering, independent alpha, none/sub/add and subadd ordering passed');