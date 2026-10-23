import assert from 'node:assert/strict';
import {applyDamageAssertion} from '../Engine/damage-assertions.js';

const caller={assertions:new Set()},helper={assertions:new Set()};
const api={evaluate:expression=>expression,findActor:id=>id===7?helper:null};
assert.equal(applyDamageAssertion({type:'AssertSpecial',params:{flag:'NoShadow'}},caller,api),true);
assert.equal(caller.assertions.has('noshadow'),true);
applyDamageAssertion({type:'AssertSpecial',params:{redirectid:7,flag:'NoShadow'}},caller,api);
assert.equal(helper.assertions.has('noshadow'),true);
applyDamageAssertion({type:'AssertSpecial',params:{redirectid:7,flag:'NoShadow',enabled:0}},caller,api);
assert.equal(helper.assertions.has('noshadow'),false);
assert.equal(caller.assertions.has('noshadow'),true);
applyDamageAssertion({type:'AssertSpecial',params:{flag:'NoShadow',enabled:'0'}},caller,api);
assert.equal(caller.assertions.has('noshadow'),false);
console.log('AssertSpecial NoShadow uses actor-local redirected assertion storage and native enabled extraction');
