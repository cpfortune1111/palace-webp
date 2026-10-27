import assert from 'node:assert/strict';
import {compilePlaySoundOptions} from '../Engine/play-sound-options.js';

for(const channel of [-1,0,7]){
 const reads=[],options=compilePlaySoundOptions({},expression=>{reads.push(expression);throw Error('Omitted parameter evaluated')},channel);
 assert.deepEqual(options.playback,{freqMul:1,loopCount:0,loopStart:0,loopEnd:0,startPosition:0});
 assert.deepEqual(reads,[]);
 assert.equal(options.stopFlags.hit,channel===0);
}
console.log('Omitted PlaySnd playback fields supply native defaults without evaluating absent expressions');
