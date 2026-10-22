import assert from 'node:assert/strict';
import {applyResourceController} from '../Engine/resource-controllers.js';

const root={life:1000,lifeMax:1000,power:0,powerMax:3000,finalDefense:2};
const helper={life:100,lifeMax:100,finalDefense:1};
const other={life:1000,lifeMax:1000,power:0,powerMax:3000,finalDefense:1};
let compatibility='mugen',locked=false,noDamage=false;
const api={evaluate:Number,findActor:id=>({1:root,2:other,1001:helper})[id],powerOwner:target=>target===helper?root:target,compatibility:()=>compatibility,powerLocked:()=>locked,noDamage:()=>noDamage};
const run=(type,params,actor=root)=>applyResourceController({type,params},actor,api);
run('LifeAdd',{value:'-101'});assert.equal(root.life,949);
run('LifeAdd',{value:'-1'});assert.equal(root.life,948);
run('LifeAdd',{value:'10'});assert.equal(root.life,958);
compatibility='ikemen';run('LifeAdd',{value:'10'});assert.equal(root.life,963);
run('LifeAdd',{value:'-100',absolute:'1'});assert.equal(root.life,863);
run('LifeAdd',{value:'-10000',kill:'0'});assert.equal(root.life,1);assert.equal(root.getHit.kill,false);
run('LifeSet',{value:'-1'});assert.equal(root.life,0);
run('LifeAdd',{value:'-1',kill:'0'});assert.equal(root.life,0);
compatibility='mugen';run('LifeAdd',{value:'-1',kill:'0'});assert.equal(root.life,1);
run('LifeSet',{value:'5000'});assert.equal(root.life,1000);
noDamage=true;run('LifeSet',{value:'0'});assert.equal(root.life,1000);noDamage=false;
run('LifeAdd',{value:'-25',redirectid:'1001'});assert.equal(helper.life,75);assert.equal(root.life,1000);
run('PowerAdd',{value:'50'},helper);assert.equal(root.power,50);assert.equal(helper.power,undefined);
run('PowerSet',{value:'4000'});assert.equal(root.power,3000);
run('PowerAdd',{value:'2147483647'});assert.equal(root.power,3000);
run('PowerAdd',{value:'-4000'});assert.equal(root.power,0);
run('PowerSet',{value:'100',redirectid:'2'});assert.equal(other.power,100);
locked=true;run('PowerSet',{value:'3000'});assert.equal(root.power,0);locked=false;
run('LifeSet',{value:'0',redirectid:'999'});assert.equal(root.life,1000);
assert.equal(run('Null',{}),false);
root.redLife=800;root.life=500;
run('LifeAdd',{value:'100'});assert.equal(root.redLife,800);
run('LifeSet',{value:'950'});assert.equal(root.redLife,800);
run('LifeSet',{value:'0'});assert.equal(root.redLife,0);
root.redLife=600;root.life=500;noDamage=true;
run('LifeSet',{value:'0'});assert.equal(root.redLife,600);noDamage=false;
api.redLifeEnabled=()=>false;
run('LifeSet',{value:'400'});assert.equal(root.redLife,400);
run('LifeAdd',{value:'-100',absolute:'1'});assert.equal(root.redLife,300);
helper.redLife=75;
run('LifeSet',{value:'0',redirectid:'1001'});assert.equal(helper.redLife,0);assert.equal(root.redLife,300);
console.log('Life/power defaults, defense, rounding, limits, ownership and redirection passed');
const ordered=[];
root.life=500;compatibility='ikemen';
applyResourceController({type:'LifeAdd',params:{value:'amount',absolute:'absolute',kill:'kill'}},root,{...api,evaluate:expression=>{ordered.push(expression);return expression==='amount'?-100:expression==='kill'?1:0}});
assert.deepEqual(ordered,['absolute','kill','amount']);
assert.equal(root.life,450);
ordered.length=0;
applyResourceController({type:'LifeAdd',params:{value:'amount'}},root,{...api,evaluate:expression=>{ordered.push(expression);return -10}});
assert.deepEqual(ordered,['amount']);
for(const [ikemen,expected] of [[[0,0,9],510],[[0,99,0],505]]){
 root.life=500;
 applyResourceController({type:'LifeAdd',params:{value:10,absolute:0}},root,{...api,compatibility:()=>ikemen[1]?'mugen':'ikemen',versionData:{engineVersions:{mugen:[1,1],ikemen}}});
 assert.equal(root.life,expected);
}
for(const [ikemen,expected] of [[[0,0,0],1],[[0,99,0],0]]){
 other.life=0;
 applyResourceController({type:'LifeAdd',params:{redirectid:2,value:-1,absolute:1,kill:0}},root,{...api,compatibility:()=>ikemen[1]?'mugen':'ikemen',targetVersionData:()=>({engineVersions:{mugen:[1,1],ikemen}})});
 assert.equal(other.life,expected);
}
