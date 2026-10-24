import assert from 'node:assert/strict';
import {playSoundGain} from '../Engine/play-sound-volume.js';

assert.equal(playSoundGain(100),1);assert.equal(playSoundGain(100,128),.5);assert.equal(playSoundGain(100,128,true),1);assert.equal(playSoundGain(1),2/256);assert.equal(playSoundGain(1,256,true),2/256);assert.equal(playSoundGain(-1),0);assert.equal(playSoundGain(25600),2);assert.equal(playSoundGain(99999),2);assert.equal(playSoundGain(100,2147483647),0);
console.log('PlaySnd own/common gain uses native integer multiply/truncation, character volume and clipping; legacy version/loop interactions remain pending');
