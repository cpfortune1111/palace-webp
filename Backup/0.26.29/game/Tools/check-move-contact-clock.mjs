import assert from 'node:assert/strict';
import {createMoveContactClock,markMoveContact,moveContactQuery,advanceMoveContact,finishMoveContact,clearMoveContact} from '../Engine/move-contact-clock.js';

const clock=createMoveContactClock();
markMoveContact(clock,'reversed');
assert.equal(moveContactQuery(clock,'movereversed'),1);
assert.equal(moveContactQuery(clock,'movecontact'),0);
assert.equal(moveContactQuery(clock,'movehit'),0);
advanceMoveContact(clock);assert.equal(clock.time,-1);
finishMoveContact(clock);assert.equal(clock.time,1);
advanceMoveContact(clock,{paused:true});assert.equal(clock.time,1);
advanceMoveContact(clock);assert.equal(moveContactQuery(clock,'movereversed'),2);
markMoveContact(clock,'hit',{countered:true});
assert.equal(moveContactQuery(clock,'movecontact'),1);
assert.equal(moveContactQuery(clock,'movecountered'),1);
assert.equal(moveContactQuery(clock,'movereversed'),0);
clearMoveContact(clock);assert.equal(moveContactQuery(clock,'movehit'),0);
assert.equal(moveContactQuery(clock,'movecountered'),0);
console.log('Native move-contact clock distinguishes reversed contacts, marks negative first frame and advances/finishes/clears in separate phases');
