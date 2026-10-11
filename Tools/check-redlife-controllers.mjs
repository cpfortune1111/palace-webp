import assert from 'node:assert/strict';
import {applyRedLifeController} from '../Engine/redlife-controllers.js';

const actor={life:500,lifeMax:1000,redLife:900,finalDefense:2},other={life:200,lifeMax:1000,redLife:800,finalDefense:1};
let enabled=true,noDamage=false;
const api={evaluate:Number,findActor:id=>id===7?other:null,enabled:()=>enabled,noDamage:()=>noDamage};
const run=(type,params)=>applyRedLifeController({type,params},actor,api);
run('RedLifeAdd',{value:'-101'});assert.equal(actor.redLife,849);
run('RedLifeAdd',{value:'-100',absolute:'1'});assert.equal(actor.redLife,749);
run('RedLifeSet',{value:'10'});assert.equal(actor.redLife,500);
run('RedLifeSet',{redirectid:'7',value:'2000'});assert.equal(other.redLife,1000);
enabled=false;run('RedLifeSet',{value:'900'});assert.equal(actor.redLife,500);
enabled=true;noDamage=true;run('RedLifeSet',{value:'900'});assert.equal(actor.redLife,500);
actor.life=0;run('RedLifeSet',{value:'900'});assert.equal(actor.redLife,0);
assert.throws(()=>run('RedLifeSet',{}),/Missing/);
console.log('Red life bounds, death clearing, defense rounding, absolute and redirect paths passed');
