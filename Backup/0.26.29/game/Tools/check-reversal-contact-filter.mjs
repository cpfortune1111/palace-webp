import assert from 'node:assert/strict';
import {reversalContactAllowed} from '../Engine/reversal-contact-filter.js';

const reversal={'reversal.attr':'SCA, NA, SA'},attack={attr:'S, NA',guardflag:'MA'};
assert.equal(reversalContactAllowed(reversal,attack),true);
assert.equal(reversalContactAllowed(reversal,{attr:'A, HP'}),false);
assert.equal(reversalContactAllowed(reversal,attack,{active:false}),false);
assert.equal(reversalContactAllowed(reversal,attack,{ignoreReversal:true}),false);
assert.equal(reversalContactAllowed({...reversal,'reversal.guardflag':'A'},attack),true);
assert.equal(reversalContactAllowed({...reversal,'reversal.guardflag':'A'},attack,{unguardable:true}),false);
assert.equal(reversalContactAllowed({...reversal,'reversal.guardflag.not':'A'},attack),false);
assert.equal(reversalContactAllowed({...reversal,'reversal.guardflag.not':'A'},attack,{unguardable:true}),true);
console.log('Pinned ReversalDef attribute conjunction, attack validity, ignore permission and positive/negative guard filters passed');
