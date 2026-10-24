import assert from 'node:assert/strict';
import {createCharacterSoundOutput} from '../Engine/character-sound-output.js';

const nodes=[],sources=[],errors=[];let creations=0,resumes=0,sourceX=80;
function node(){const value={connections:[],disconnected:0,levels:[],connect(...args){this.connections.push(args)},disconnect(){this.disconnected++}};value.gain={setValueAtTime:(level,time)=>value.levels.push([level,time])};nodes.push(value);return value}
const context={state:'suspended',currentTime:0,destination:{},resume(){resumes++;return Promise.reject(Error('Test resume rejection'))},createMediaElementSource(sound){sources.push(sound);return node()},createGain:node,createChannelSplitter:node,createChannelMerger:node};
const output=createCharacterSoundOutput({createContext:()=>{creations++;return context},view:()=>({x:0,scale:1,width:320,strength:100,stereo:true}),sourcePosition:()=>sourceX,onError:error=>errors.push(error.message)}),record={sound:{id:1}},other={sound:{id:2}};
await output.resume();assert.equal(creations,0);assert.equal(resumes,0);
assert.deepEqual(output.setPan(record,{pan:0,sourceId:1},.5),[.25,.75]);assert.equal(creations,1);assert.deepEqual(sources,[record.sound]);assert.equal(output.size(),1);
assert.deepEqual(output.setPan(record,{pan:0,sourceId:1}),[.25,.75]);assert.equal(sources.length,1);assert.equal(output.snapshot(record).gain,.5);
sourceX=160;output.update();assert.equal(output.snapshot(record).lastPan,1);
sourceX=null;output.update();assert.equal(output.snapshot(record).sourceX,160);
output.setPan(other,{pan:-160,sourceId:-1});assert.equal(output.size(),2);assert.equal(creations,1);assert.equal(sources.length,2);
const firstNodes=nodes.slice(0,6);output.release(record);assert.equal(output.snapshot(record),null);assert.equal(output.size(),1);for(const value of firstNodes)assert.equal(value.disconnected,1);
output.release(record);for(const value of firstNodes)assert.equal(value.disconnected,1);assert.equal(output.snapshot(other).pan,-160);
output.release(other);assert.equal(output.size(),0);output.update();await Promise.resolve();assert.equal(errors.length,3);assert.equal(resumes,3);
console.log('Character audio output lazily creates shared context, reuses per-record media graph, updates source pan, reports resume failures and disconnects only released records');
