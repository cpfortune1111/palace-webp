import assert from 'node:assert/strict';
import {makeDustPosition,projectDustPosition} from '../Engine/make-dust-drawing.js';

const position=makeDustPosition({x:100,y:-20,z:8,facing:-1},[3,4,5],2,[7,9]);
assert.deepEqual(position,{x:101,y:-3,z:18,bindOffset:[-1,17,10]});
assert.deepEqual(projectDustPosition(position,{}),{x:101,y:-3,scale:1});
assert.deepEqual(projectDustPosition({x:40,y:-10,z:50},{topz:0,botz:100,ztopscale:.5,zbotscale:1.5,depthtoscreen:2},{enabled:true,cameraX:20}),{x:40,y:90,scale:1});
assert.deepEqual(projectDustPosition({x:40,y:-10,z:0},{topz:0,botz:100,ztopscale:.5,zbotscale:1.5,depthtoscreen:2},{enabled:true,cameraX:20}),{x:30,y:-5,scale:.5});
assert.deepEqual(projectDustPosition({x:40,y:-10,z:-100},{topz:0,botz:100,ztopscale:.5,zbotscale:1.5,depthtoscreen:2},{enabled:true,cameraX:20}),{x:20,y:-200,scale:0});
console.log('MakeDust recipient/facing/current-offset coordinates and world-space Z perspective consume all XYZ components with float32 operations');
