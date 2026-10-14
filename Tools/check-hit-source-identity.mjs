import assert from 'node:assert/strict';
import {hitSourceIdentity} from '../Engine/hit-source-identity.js';
assert.deepEqual(hitSourceIdentity({id:1}),{playerno:0,playerid:1,teamside:0,projid:-1});
assert.deepEqual(hitSourceIdentity({kind:'helper',player:2,id:880,instanceId:1080,teamSide:1}),{playerno:1,playerid:1080,teamside:0,projid:-1});
assert.deepEqual(hitSourceIdentity({kind:'projectile',player:2,id:2,projectileId:1050,projectileOwnerId:1080}),{playerno:1,playerid:1080,teamside:1,projid:1050});
console.log('Native root/helper/projectile hit identity separates owner instance, projectile ID and team side');
