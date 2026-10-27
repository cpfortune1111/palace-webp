import assert from 'node:assert/strict';
import {linearSoundGains,createLinearSoundPanner} from '../Engine/linear-sound-panner.js';

assert.deepEqual(linearSoundGains(0),[1,1]);assert.deepEqual(linearSoundGains(-1),[2,0]);assert.deepEqual(linearSoundGains(1),[0,2]);assert.deepEqual(linearSoundGains(.5),[.5,1.5]);assert.deepEqual(linearSoundGains(5,4),[0,2]);assert.deepEqual(linearSoundGains(0,-1),[0,0]);
const nodes=[];
function node(){const value={connections:[],disconnected:[],values:[],connect(...args){this.connections.push(args)},disconnect(...args){this.disconnected.push(args)}};value.gain={setValueAtTime:(level,time)=>value.values.push([level,time])};nodes.push(value);return value}
const source=node(),context={currentTime:3,createGain:node,createChannelSplitter:node,createChannelMerger:node},panner=createLinearSoundPanner(context,source);
assert.deepEqual(panner.set(.5),[.5,1.5]);assert.deepEqual(nodes[3].values,[[.5,3]]);assert.deepEqual(nodes[4].values,[[1.5,3]]);assert.equal(nodes[1].channelCount,2);assert.equal(nodes[1].channelCountMode,'explicit');assert.equal(nodes[1].channelInterpretation,'speakers');assert.equal(panner.output,nodes[5]);panner.disconnect();for(const value of nodes)assert.equal(value.disconnected.length,1);
console.log('Independent native linear stereo gain law and two-channel Web Audio graph wiring pass');
