import assert from 'node:assert/strict';
globalThis.Image=class{naturalWidth=274;naturalHeight=78;async decode(){}};
const {createHardwareIndicator}=await import('../Engine/hardware-indicator.js');
const marker=createHardwareIndicator();await marker.ready;const calls=[],context={drawImage:(...values)=>calls.push(values)};
for(const key of ['snes','3do','saturn'])marker.draw(context,key,300,500,1);
for(const [image,left,top,width,height] of calls){assert.ok(image.src.endsWith('.webp'));assert.equal(top,500);assert.ok(Math.abs(width-274*.675*.8)<.000001);assert.ok(Math.abs(height-78*.675*.8)<.000001);assert.equal(left,300-width/2)}
console.log('All three battle hardware buttons preserve aspect ratio at 80% of previous size');

