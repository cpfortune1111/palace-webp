import assert from 'node:assert/strict';
import {characterCollisionPosition} from '../Engine/character-collision-position.js';
import {worldClsnBox} from '../Engine/clsn-world-geometry.js';
const actor={x:100,y:200,facing:1},options={drawOffset:[10,-20],offset:[6,8],worldScale:2};assert.deepEqual(characterCollisionPosition(actor,options),[126,168]);assert.deepEqual(characterCollisionPosition({...actor,facing:-1},options),[86,168]);assert.deepEqual(characterCollisionPosition(actor,{...options,offsetScale:4}),[121.5,162]);
const geometry={rect:[-10,-20,10,0],angle:30,pivot:[4,8]},base=worldClsnBox(geometry,100,200,1),placed=worldClsnBox(geometry,...characterCollisionPosition(actor,options),1);assert.deepEqual([placed.l-base.l,placed.t-base.t,placed.pivot[0]-base.pivot[0],placed.pivot[1]-base.pivot[1]],[26,-32,26,-32]);
console.log('Native drawing offset follows facing, controller Offset stays absolute, local/world conversion and rotated-box pivots share the translated position');
