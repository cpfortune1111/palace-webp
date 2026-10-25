import assert from 'node:assert/strict';
import {deferredExplodAfterImageWrites,finishExplodAfterImage,createNativeAfterImage} from '../Engine/native-afterimage.js';
import {commitModifyExplodEffects} from '../Engine/modify-explod-commit.js';
import {applyModifyExplodController} from '../Engine/modify-explod.js';
import {createTransDrawQueue} from '../Engine/trans-draw-queue.js';
const effects=[{},{}],order=[],api={ikemen:true,split:value=>String(value).split(','),evaluate:value=>{order.push(value);return Number(value)},warn:()=>{}};
const writes=deferredExplodAfterImageWrites({'afterimage.time':'-1','afterimage.length':'8','afterimage.framegap':'2','afterimage.palbright':'5,6','afterimage.palmul':'.5'},api);
assert.deepEqual(order,[]);commitModifyExplodEffects(effects,{}, {afterImageWrites:writes},{modify:()=>{},finalize:effect=>finishExplodAfterImage(effect,{ikemen:true})});
assert.deepEqual(order,['-1','-1','8','8','2','2','5','6','5','6','.5','.5']);assert.equal(effects[0].nativeAfterImage.imgs.length,9);assert.notEqual(effects[0].nativeAfterImage,effects[1].nativeAfterImage);assert.deepEqual(effects[0].nativeAfterImage.base.add,[5,6,30]);
const first=effects[0].nativeAfterImage;first.reccount=7;first.timecount=11;first.imgs[0]={source:99};for(const write of deferredExplodAfterImageWrites({'afterimage.length':'3'},api))write(effects[0]);finishExplodAfterImage(effects[0]);assert.equal(first.imgs.length,3);assert.equal(first.reccount,7);assert.equal(first.timecount,11);assert.equal(first.imgs[0].source,99);
const inactive={nativeAfterImage:createNativeAfterImage()};for(const write of deferredExplodAfterImageWrites({'afterimage.length':'4'},api))write(inactive);finishExplodAfterImage(inactive);assert.equal(inactive.nativeAfterImage.imgs.length,1);assert.equal(inactive.nativeAfterImage.needsetup,true);
assert.throws(()=>applyModifyExplodController({type:'ModifyExplod',params:{'afterimage.unknown':'1'}},{},{}),/Unsupported ModifyExplod parameter/);
const context={globalAlpha:1,globalCompositeOperation:'source-over',getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0})};for(const maximum of [-1,0,2,512]){const queue=createTransDrawQueue({afterImageMax:maximum});for(let player=1;player<=2;player++)for(let index=0;index<520;index++)queue.record(context,{},[0,0],{kind:'native-afterimage',afterImagePlayer:player});assert.equal(queue.ordered().length,2*Math.max(0,maximum));assert.equal(queue.remainingAfterImages(1),0);queue.reset();assert.equal(queue.remainingAfterImages(1),Math.max(0,maximum))}
console.log('AfterImage modifiers preserve per-parameter/per-effect RHS order, histories, inactive setup and per-player frame budgets');
