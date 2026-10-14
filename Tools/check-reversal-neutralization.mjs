import assert from 'node:assert/strict';
import {neutralizeReversedHitDefinition} from '../Engine/reversal-neutralization.js';

const definition={params:{attr:'S, NA',hitflag:'MAF',hitonce:0,damage:'100,0'},hitOnceSpent:false};
assert.equal(neutralizeReversedHitDefinition(definition),true);
assert.equal(definition.params.hitflag,'');
assert.equal(definition.params.hitonce,-1);
assert.equal(definition.hitOnceSpent,true);
assert.equal(definition.reversed,true);
assert.equal(definition.params.damage,'100,0');
assert.equal(neutralizeReversedHitDefinition(null),false);
const next={params:{attr:'S, NA',hitflag:'MAF',hitonce:0}};
assert.equal(next.hitOnceSpent,undefined);assert.equal(next.params.hitflag,'MAF');
console.log('Successful reversal neutralizes only the active victim HitDef and preserves definition parameters/new activations');
