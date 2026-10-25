import assert from 'node:assert/strict';
import {readHelperSurvival,setHelperLife,helperKoVelocityEnabled} from '../Engine/helper-survival.js';
const reads=[];assert.deepEqual(readHelperSurvival({},()=>{throw Error('Unreachable')}),{immortal:false,koVelocity:false});assert.deepEqual(readHelperSurvival({immortal:'1',kovelocity:'0'},value=>{reads.push(value);return Number(value)}),{immortal:true,koVelocity:false});assert.deepEqual(reads,['1','0']);
let cases=0;for(const helperType of [1,2,3])for(const teamSide of [0,1,2])for(const immortal of [false,true])for(const redLifeEnabled of [false,true]){
 const actor={kind:'helper',helperType,teamSide,immortal,life:50,lifeMax:100,redLife:80},expected=immortal&&(helperType!==2||teamSide===0)?1:0;
 assert.equal(setHelperLife(actor,-20,{redLifeEnabled}),expected);assert.equal(actor.redLife,redLifeEnabled?0:expected);setHelperLife(actor,200,{redLifeEnabled});assert.equal(actor.life,100);cases++;
}
const actor={kind:'helper',helperType:1,immortal:true,life:40,lifeMax:100,redLife:60};setHelperLife(actor,0,{noDamage:true});assert.deepEqual([actor.life,actor.redLife],[40,60]);
assert.equal(helperKoVelocityEnabled({kind:'root'}),true);assert.equal(helperKoVelocityEnabled({kind:'helper'}),false);assert.equal(helperKoVelocityEnabled({kind:'helper',koVelocity:true}),true);
console.log('Helper survival passes '+cases+' immortal/type/team/red-life cases, no-damage preservation, typed flag defaults/order and default KO velocity gating');
