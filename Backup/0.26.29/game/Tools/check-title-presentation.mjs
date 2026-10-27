import assert from 'node:assert/strict';
import {createTitlePresentation} from '../Engine/title-presentation.js';

const presentation=createTitlePresentation();
presentation.enter();
assert.equal(presentation.snapshot().homeFade,0);
assert.equal(presentation.snapshot().titleOffset,-360);
presentation.step(.25);
assert.equal(presentation.snapshot().homeFade,.5);
presentation.step(.25);
assert.ok(presentation.snapshot().titleOffset===0);
presentation.settings(1);
presentation.step(.5);
const calls=[],context={save(){},restore(){},drawImage(...args){calls.push(args)}};
const frame={sprite:[1],axisX:628,axisY:-9,image:{naturalWidth:1262,naturalHeight:701}};
presentation.draw(context,[frame],[]);
assert.equal(calls.length,7);
assert.deepEqual(calls[1].slice(5),[320,96,112,112]);
assert.deepEqual(calls[2].slice(5),[848,96,112,112]);
presentation.settings(0);
presentation.step(.5);
assert.equal(presentation.snapshot().settings,0);
console.log('Title descent, home fades, fixed-scale corner movement and popup reversal passed');

