import assert from 'node:assert/strict';
import {lightSeeds,lightSample} from '../Engine/falling-lights.js';
import fs from 'node:fs';
import vm from 'node:vm';
const lights=lightSeeds(),acs=lights.filter((light,index)=>index%2===0);assert.equal(lights.length,96);assert.equal(acs.length,48);
for(const light of acs){const original=lights.find(entry=>entry.x===light.x);assert.deepEqual(lightSample(light,1),lightSample(original,1));const speed=.085+light.size*.003,time=(.86-light.phase+1)/speed,point=lightSample(light,time);assert.ok(point.y>=660&&point.y<=700);assert.ok(point.impact>0);assert.equal(lightSample(light,time+20,time),null)}
console.log('Falling lights: identical seeds, size/halo timing, 50% ACS count, landing inset and drain passed');
const title=fs.readFileSync(new URL('../Stage/Title/title-stage.js',import.meta.url),'utf8'),travel=title.match(/setTravel:(amount=>\{.*?\}),setVisible:/)[1],camera={position:{set:(...values)=>camera.location=values},rotation:{set:(...values)=>camera.angles=values}},context={camera,THREE:{MathUtils:{degToRad:value=>value*Math.PI/180}}};vm.createContext(context);vm.runInContext('globalThis.travel='+travel,context);context.travel(1);assert.deepEqual(camera.location,[0,-.625,-.65]);context.travel(0);assert.deepEqual(camera.location,[0,-.825,-0]);console.log('Title camera: forward/up travel and exact home reset passed');

