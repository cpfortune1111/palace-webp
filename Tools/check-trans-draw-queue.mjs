import assert from 'node:assert/strict';
import {createTransDrawQueue} from '../Engine/trans-draw-queue.js';

const queue=createTransDrawQueue(),source={},state={type:'add',alpha:[128,64]},context={getTransform:()=>({a:-2,b:0,c:0,d:2,e:10,f:20}),globalAlpha:0.5,globalCompositeOperation:'lighter'};
queue.record(context,source,[1,2],{state,priority:3});
queue.record(context,source,[3,4],{priority:-1});
queue.record(context,source,[5,6],{priority:-10,ontop:true});
state.alpha[0]=0;
const entries=queue.ordered();
assert.deepEqual(entries.map(entry=>entry.serial),[1,0,2]);
assert.deepEqual(entries[1].matrix,[-2,0,0,2,10,20]);
assert.deepEqual(entries[1].state.alpha,[128,64]);
assert.equal(entries[1].opacity,0.5);
assert.equal(entries[1].composite,'lighter');
assert.deepEqual(queue.bounds({...entries[1],source:{width:3,height:4},args:[0,0]},100,100),{x:3,y:19,width:8,height:10});
assert.deepEqual(queue.bounds({...entries[1],matrix:[1,0,0,1,200,200],source:{width:3,height:4},args:[0,0]},100,100),{x:199,y:199,width:0,height:0});
queue.reset();assert.deepEqual(queue.ordered(),[]);
console.log('Trans draw queue preserves transforms, snapshots, stable priorities and ontop ordering');