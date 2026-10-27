import assert from 'node:assert/strict';
import {createTargetList} from '../Engine/target-list.js';
import {applyTargetPowerController,executeTargetPowerAddition,helperTypeParameter} from '../Engine/target-power.js';

const targets=createTargetList();targets.add(2);targets.add(3);targets.add(4);
assert.equal(helperTypeParameter(),1);assert.equal(helperTypeParameter('PLAYER'),2);assert.equal(helperTypeParameter('proj-anything'),3);
assert.equal(helperTypeParameter('projectile',{zss:true}),3);assert.throws(()=>helperTypeParameter('proj-anything',{zss:true}),/Invalid helpertype/);assert.throws(()=>helperTypeParameter(''),/Invalid helpertype/);
const owner={targets},power={power:100,powerMax:3000},actors=new Map([[1,owner],[2,{getHit:{hitid:7}}],[3,{kind:'helper',helperType:1,getHit:{hitid:7}}],[4,{kind:'helper',helperType:2,getHit:{hitid:8}}]]);
const api={evaluate:value=>value==='var(8)'?50:Number(value),findActor:id=>actors.get(id),targets:actor=>actor.targets,isPlayerType:actor=>actor.kind!=='helper'||actor.helperType===2,powerOwner:()=>power};
applyTargetPowerController({type:'TargetPowerAdd',params:{redirectid:1,id:7,value:'var(8)'}},{},api);assert.equal(power.power,150);
applyTargetPowerController({type:'TargetPowerAdd',params:{id:8,value:20}},owner,api);assert.equal(power.power,170);
executeTargetPowerAddition(actors.get(2),5000,api);assert.equal(power.power,3000);
executeTargetPowerAddition(actors.get(2),-5000,api);assert.equal(power.power,0);
executeTargetPowerAddition(actors.get(2),50,{...api,locked:()=>true});assert.equal(power.power,0);
executeTargetPowerAddition(actors.get(2),1,{...api,maximumPower:()=>true});assert.equal(power.power,3000);
assert.throws(()=>applyTargetPowerController({type:'TargetPowerAdd',params:{}},owner,api),/Missing TargetPowerAdd value/);
power.power=100;
applyTargetPowerController({type:'TargetPowerAdd',params:{value:25}},owner,api);assert.equal(power.power,150);
power.power=100;
applyTargetPowerController({type:'TargetPowerAdd',params:{id:7,index:0,value:25}},owner,api);assert.equal(power.power,125);
applyTargetPowerController({type:'TargetPowerAdd',params:{redirectid:999,value:25}},owner,api);assert.equal(power.power,125);
executeTargetPowerAddition(actors.get(2),0,{powerOwner:()=>{throw Error('Zero addition must not resolve power ownership')}});
const widePower={power:2147483640,powerMax:2147483647};
executeTargetPowerAddition(actors.get(2),20,{...api,powerOwner:()=>widePower});assert.equal(widePower.power,2147483647);
executeTargetPowerAddition(actors.get(2),-2147483648,{...api,powerOwner:()=>widePower});assert.equal(widePower.power,0);
power.power=123;
executeTargetPowerAddition(actors.get(2),1,{...api,locked:()=>true,maximumPower:()=>true});assert.equal(power.power,123);
console.log('TargetPowerAdd redirected/filter targets, player-helper eligibility, shared owner, limits and locks passed');

