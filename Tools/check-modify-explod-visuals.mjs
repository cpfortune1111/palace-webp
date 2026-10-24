import assert from 'node:assert/strict';
import {readModifyExplodFacing,readModifyExplodLayers,applyModifyExplodVisuals} from '../Engine/modify-explod-visuals.js';

const order=[],api={evaluate:value=>{order.push(value);return value==='quoted'?'1':Number(value)}};
assert.deepEqual(readModifyExplodFacing({facing:'-1',vfacing:'-2'},{...api,locked:true}),{});assert.deepEqual(order,[]);
assert.deepEqual(readModifyExplodFacing({facing:'0',vfacing:'-2'},{...api,locked:false}),{facing:1,vfacing:-1});
const fields=readModifyExplodLayers({sprpriority:'7',layerno:'-9',ontop:'1',under:'1'},api);assert.deepEqual(order,['0','-2','7','-9','1','1']);
const effect={facing:1,relativeFacing:1,vfacing:1};applyModifyExplodVisuals(effect,fields,{ikemen:false});assert.deepEqual([effect.sprpriority,effect.layerno,effect.ontop,effect.under],[0,1,true,true]);
applyModifyExplodVisuals(effect,{layerno:-8,ontop:false,under:false},{ikemen:false});assert.deepEqual([effect.layerno,effect.ontop,effect.under],[0,false,true]);
applyModifyExplodVisuals(effect,{layerno:-8,ontop:false},{ikemen:false});assert.equal(effect.layerno,-1);
effect.facing=-1;effect.vfacing=-1;applyModifyExplodVisuals(effect,{facing:-1,vfacing:1},{ikemen:false});assert.equal(effect.relativeFacing,1);assert.equal(effect.vfacing,-1);
applyModifyExplodVisuals(effect,{facing:-1,vfacing:1},{ikemen:true});assert.equal(effect.relativeFacing,-1);assert.equal(effect.vfacing,1);
console.log('ModifyExplod facing/version locks, native layer/ontop commit order and sticky under flag pass');
