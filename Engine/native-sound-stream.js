import {createDecodedSoundFrames} from './decoded-sound-frames.js';
import {createSoundSampleLooper,soundRepeatCount} from './sound-sample-looper.js?v=02583';
import {createSoundResampler} from './sound-resampler.js';

export function createNativeSoundStream(buffer,metadata,params,outputRate){
 if(!Number.isInteger(outputRate)||outputRate<=0)throw Error('Invalid native sound output rate');
 const source=createDecodedSoundFrames(buffer,metadata);source.seek(params.startPosition??0);
 const loop=createSoundSampleLooper(source,{repeatCount:soundRepeatCount(params.loopCount??0),loopStart:params.loopStart??0,loopEnd:params.loopEnd??0});
 const frequency=Math.max(Math.fround(.01),Math.min(5,Math.fround(params.freqMul??1))),targetRate=Math.trunc(Math.fround(outputRate/frequency)),quality=Math.max(1,Math.min(16,Math.trunc(params.quality??4)));
 const resampler=createSoundResampler(loop,{ratio:metadata.sourceSampleRate/targetRate,quality});
 return {...resampler,seek:value=>source.seek(value),modifyLoop(changes){if(changes.repeatCount!==undefined)loop.setRepeatCount(changes.repeatCount);const [first,last]=loop.points();if(changes.loopStart!==undefined&&changes.loopStart!==first||changes.loopEnd!==undefined&&changes.loopEnd!==last)loop.setLoopPoints(changes.loopStart??0,changes.loopEnd??0)},setFrequency(value){const next=Math.max(Math.fround(.01),Math.min(5,Math.fround(value))),rate=Math.trunc(Math.fround(outputRate/next));resampler.setRatio(metadata.sourceSampleRate/rate)}};
}
