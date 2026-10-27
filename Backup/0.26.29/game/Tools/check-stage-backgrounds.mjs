import assert from 'node:assert/strict';
import {createStageBackgroundRegistry} from '../Engine/stage-backgrounds.js';
import {applyBgPalFxController} from '../Engine/global-palfx-controller.js';

const registry=createStageBackgroundRegistry();registry.replace([{id:7},{id:8},{id:7,layer:1}]);
applyBgPalFxController({type:'BGPalFX',params:{id:7,index:1,time:2,color:0}},{evaluate:Number,backgrounds:()=>registry.entries,setBackground:registry.setPalette});
registry.tick({paused:true});assert.equal(registry.entries[2].palFx.definition.time,2);
registry.tick();assert.equal(registry.effect(registry.entries[2],null,null).color,0);assert.equal(registry.entries[2].palFx.definition.time,1);
assert.equal(registry.effect(registry.entries[0],null,null),null);assert.equal(registry.effect(registry.entries[1],null,null),null);
const drawn=[];registry.drawLayer(1,background=>drawn.push(background.id));assert.deepEqual(drawn,[7]);
registry.tick();registry.tick();assert.equal(registry.effect(registry.entries[2],null,null),null);
console.log('Stage BG selection mutates one actual entry, respects stage pause and expires independently');