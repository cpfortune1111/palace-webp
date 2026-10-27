import assert from 'node:assert/strict';
import {positionCoordinateBinding} from '../Engine/position-coordinate-binding.js';
import {applyPositionController} from '../Engine/position-controllers.js';

const sourceWorld={x:40,y:-80,z:12,facing:-1,groundLevel:8,platformY:4},targetWorld={x:0,y:0,z:0,facing:1,groundLevel:6,platformY:2};
const source=positionCoordinateBinding(sourceWorld,4),target=positionCoordinateBinding(targetWorld,2),api={evaluate:Number,findActor:id=>id===2?target:null,cameraX:100};
assert.deepEqual([source.x,source.y,source.z,source.groundLevel,source.platformY],[10,-20,3,2,1]);
applyPositionController({type:'PosSet',params:{x:10,y:-20,z:3}},source,api);
assert.deepEqual([sourceWorld.x,sourceWorld.y,sourceWorld.z],[140,-68,12]);
applyPositionController({type:'PosAdd',params:{x:2,y:3,z:-1}},source,api);
assert.deepEqual([sourceWorld.x,sourceWorld.y,sourceWorld.z],[132,-56,8]);
applyPositionController({type:'PosSet',params:{redirectid:2,x:5,y:3,z:7}},source,api);
assert.deepEqual([targetWorld.x,targetWorld.y,targetWorld.z],[120,20,28]);
applyPositionController({type:'PosAdd',params:{redirectid:2,x:1,y:-2,z:3}},source,api);
assert.deepEqual([targetWorld.x,targetWorld.y,targetWorld.z],[124,12,40]);
assert.equal(positionCoordinateBinding(null,4),null);
assert.throws(()=>positionCoordinateBinding(sourceWorld,0),/Invalid position/);
console.log('Position XYZ world/local bridge preserves camera, ground/platform origins, facing, redirection and physical storage');
