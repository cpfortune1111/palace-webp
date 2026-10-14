import assert from 'node:assert/strict';
import {reversalAttackBoxContact} from '../Engine/reversal-contact-geometry.js';

const reverser={x:0,y:0,facing:1,params:{'reversal.attr':'SCA, NA'}},attacker={x:20,y:0,facing:-1,params:{attr:'S, NA',guardflag:'M'}};
const sets={reversalSets:{c1:[[0,-20,30,0]],c2:[]},attackSets:{c1:[[0,-20,30,0]],c2:[[100,-20,130,0]]}};
assert.equal(reversalAttackBoxContact(reverser,attacker,sets).contact,true);
assert.equal(reversalAttackBoxContact(reverser,{...attacker,x:100},sets).contact,false);
assert.equal(reversalAttackBoxContact(reverser,attacker,{...sets,attackSets:{c1:[],c2:[[0,-20,30,0]]}}).contact,false);
assert.equal(reversalAttackBoxContact(reverser,attacker,{...sets,ignoreReversal:true}).contact,false);
assert.equal(reversalAttackBoxContact(reverser,attacker,{...sets,depthOverlap:false}).contact,false);
assert.equal(reversalAttackBoxContact({...reverser,params:{...reverser.params,p2clsnrequire:'clsn2'}},attacker,{...sets,attackSets:{c1:sets.attackSets.c1,c2:[]}}).requiredMissing,true);
console.log('Reversal filter and shared world collision select attack boxes, honor mirrored positions, missing requirements and depth rejection');
