import assert from 'node:assert/strict';
import {calculateCornerPush} from '../Engine/corner-push.js';

const target={playerType:true,moveType:'H',sourceId:7,projectileId:-1,x:100,velocity:0,trackable:true,screenBound:true,hitShake:0,friction:0.5};
const base={velocity:-8,multiplier:0.75,sourceId:7,targets:[target],left:-100,right:100};
const check=(changes,expected)=>assert.deepEqual(calculateCornerPush({...base,...changes}),expected);
check({}, {distance:-8,multiplier:0.75});
check({superPaused:true},{distance:0,multiplier:1});
check({velocity:0},{distance:0,multiplier:1});
check({noCornerPush:true},{distance:0,multiplier:0.75});
check({multiplier:-1},{distance:-8,multiplier:0.5});
check({targets:[{...target,x:96,velocity:8}]},{distance:-4,multiplier:0.75});
check({targets:[{...target,x:90,velocity:12}]},{distance:0,multiplier:0.75});
check({targets:[{...target,x:-96,velocity:-8}],velocity:8},{distance:4,multiplier:0.75});
for(const changes of [{playerType:false},{moveType:'I'},{sourceId:8},{projectileId:0}]){
 check({targets:[{...target,...changes}]},{distance:0,multiplier:0});
}
for(const changes of [{trackable:false},{screenBound:false},{x:0}]){
 check({targets:[{...target,...changes}],multiplier:-1},{distance:0,multiplier:0.5});
}
check({targets:[{...target,hitShake:2}],ikemen:true},{distance:0,multiplier:1});
check({targets:[{...target,hitShake:2}]},{distance:-8,multiplier:0.75});
check({targets:[target,{...target,x:-100,friction:0.25}],multiplier:-1},{distance:-8,multiplier:0.25});
check({targets:[target,{...target,trackable:false,friction:0.25}],multiplier:-1},{distance:-8,multiplier:0.5});
console.log('Pinned cornerpush target order, physical-hit eligibility, friction, bounds, NoCornerPush and superpause checks pass; full live scheduler certification remains pending');
