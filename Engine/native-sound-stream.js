import {createDecodedSoundFrames} from './decoded-sound-frames.js';
import {createSoundSampleLooper,soundRepeatCount} from './sound-sample-looper.js';
import {createSoundResampler} from './sound-resampler.js';

export function createNativeSoundStream(buffer,metadata,params,outputRate){
 if(!Number.isInteger(outputRate)||outputRate<=0)throw Error('Invalid native sound output rate');
 const source=createDecodedSoundFrames(buffer,metadata);source.seek(params.startPosition??0);
 const loop=createSoundSampleLooper(source,{repeatCount:soundRepeatCount(params.loopCount??0),loopStart:params.loopStart??0,loopEnd:params.loopEnd??0});
 const frequency=Math.max(Math.fround(.01),Math.min(5,Math.fround(params.freqMul??1))),targetRate=Math.trunc(Math.fround(outputRate/frequency)),quality=Math.max(1,Math.min(16,Math.trunc(params.quality??4)));
 return createSoundResampler(loop,{ratio:metadata.sourceSampleRate/targetRate,quality});
}
