import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fightFxAnimationProfile} from '../Engine/fightfx-animation-profile.js';
const resource=JSON.parse(readFileSync(new URL('../Data/Common/fightfx-resource.json',import.meta.url))),data=JSON.parse(readFileSync(new URL('../Data/Common/common_animations_full.json',import.meta.url))),images=[];
const profile=fightFxAnimationProfile(resource,data,images);assert.equal(profile.data,data);assert.equal(profile.images,images);assert.equal(profile.fxScale,1);assert.deepEqual(profile.battle.coordinateSystem.localcoord,[320,240]);assert.equal(Object.keys(profile.battle.collision).length,33);for(const [id,frames]of Object.entries(data.actions)){assert.equal(profile.battle.collision[id].length,frames.length);for(const frame of profile.battle.collision[id])assert.deepEqual(frame,{c1:[],c2:[]})}
assert.throws(()=>fightFxAnimationProfile({...resource,collisionBoxes:'unknown'},data,images),/contract/);
console.log('All 33 verified FightFX actions expose exact frames, atlas identity, resource scale and collision-free rows');
