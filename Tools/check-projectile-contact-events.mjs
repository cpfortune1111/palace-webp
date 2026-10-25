import assert from 'node:assert/strict';
import {createProjectileContactEvents} from '../Engine/projectile-contact-events.js';
const events=createProjectileContactEvents(),root={player:1},other={player:2},helper={kind:'helper',instanceId:1001,player:1,ownProjectile:true},ordinary={kind:'helper',instanceId:1002,player:1};
assert.equal(events.time(root,0),-1);assert.ok(Number.isNaN(events.time(root,NaN)));
events.record(1,7,'hit',10);assert.equal(events.time(root,7,'hit'),0);assert.equal(events.time(root,0),0);assert.equal(events.time(root,-3),0);assert.equal(events.time(root,8),-1);assert.equal(events.time(root,7,'guarded'),-1);assert.equal(events.time(other,7),-1);
events.advance(root,10);assert.equal(events.time(root,7),0);events.advance(root,11);events.advance(root,11);assert.equal(events.time(root,7),1);events.advance(root,12,{paused:true});events.advance(root,13,{disabled:true});assert.equal(events.time(root,7),1);
events.record(1,9,'guarded',14);assert.equal(events.time(root,7),-1);assert.equal(events.time(root,0,'hit'),-1);assert.equal(events.time(root,0,'guarded'),0);
events.record(1001,8,'hit',14);assert.equal(events.time(helper,8),0);assert.equal(events.time(ordinary,0),-1);assert.equal(events.time(root,0,'guarded'),0);events.record(1,9,'cancel',15);assert.equal(events.time(root,0),-1);assert.equal(events.time(root,9,'cancel'),0);events.advance(helper,15);assert.equal(events.time(helper,8),1);events.forget(helper);assert.equal(events.time(helper,8),-1);events.clear();assert.equal(events.time(root,9,'cancel'),-1);
console.log('Projectile event clocks keep latest owner event, wildcard IDs, hit/guard/cancel filters, once-per-tick advancement and pause/disabled/reset isolation');
