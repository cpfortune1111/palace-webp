import assert from 'node:assert/strict';
import {readHelperPlacement,helperPlacement} from '../Engine/helper-placement.js';
import {createSpecialRuntime} from '../Char/Venus/venus-special-runtime.js';
let cases=0;
for(const callerScale of [.25,.5])for(const facing of [1,-1])for(const flip of [-1,0,1])for(const postype of ['p1','p2','front','back','left','right','none']){
 const trace=[],owner={x:100,y:50,z:30,facing},opponent={x:-300,y:-70,z:90,facing:-facing};
 const values=readHelperPlacement({postype,pos:'20,-30,40',facing:String(flip),pausemovetime:'-2',supermovetime:'-1'},{callerScale,ownerScale:.5,split:value=>value.split(','),evaluate:value=>{trace.push(value);return Number(value)}});
 assert.deepEqual(trace,['20','-30','40',String(flip),'-2','-1']);const delta=callerScale===.25?[20,-30,40]:[40,-60,80],sign=flip<0?-1:1;
 let expected;
 if(postype==='p1')expected=[100+delta[0]*facing,50+delta[1],30+delta[2],sign*facing];
 else if(postype==='p2')expected=[-300-delta[0]*facing,-70+delta[1],90+delta[2],-sign*facing];
 else if(postype==='front')expected=[640*facing+delta[0]*facing,delta[1],delta[2],sign*facing];
 else if(postype==='back')expected=[-640*facing+delta[0]*facing,delta[1],delta[2],sign*facing];
 else expected=[(postype==='left'?-640:postype==='right'?640:0)+delta[0],delta[1],delta[2],sign];
 const actual=helperPlacement(owner,values,{worldScale:2,opponent,left:-640,right:640});assert.deepEqual([actual.x,actual.y,actual.z,actual.facing],expected);assert.equal(actual.pausemovetime,-2);assert.equal(actual.supermovetime,-1);cases++;
}
assert.deepEqual(helperPlacement({facing:-1},readHelperPlacement({postype:'p2',pos:'1,2,3',facing:'-1'},{callerScale:1,ownerScale:1,split:value=>value.split(','),evaluate:Number}),{opponent:null}),{x:0,y:0,z:0,facing:-1,pausemovetime:0,supermovetime:0});
assert.throws(()=>readHelperPlacement({postype:'unknown'},{}),/Invalid Helper postype/);assert.throws(()=>readHelperPlacement({pos:'1,2,3,4'},{callerScale:1,ownerScale:1,split:value=>value.split(',')}),/pos vector/);
const runtime=createSpecialRuntime({root:()=>({player:1}),tick:()=>20});runtime.pauses.normal[0]={remaining:10,created:0,player:1};
assert.equal(runtime.blocked(1,{kind:'helper',player:1,key:'helper',pausemovetime:-2,created:0}),false);
assert.equal(runtime.blocked(1,{kind:'projectile',player:1,pausemovetime:-1,created:0}),false);
assert.equal(runtime.blocked(1,{kind:'projectile',player:1,pausemovetime:-2,created:0}),true);
assert.equal(runtime.blocked(1,{kind:'helper',player:1,key:'helper',pausemovetime:0,created:0}),true);
runtime.pauses.normal.fill(null);runtime.pauses.super[0]={remaining:10,created:0,player:1};
assert.equal(runtime.blocked(1,{kind:'helper',player:1,key:'helper',supermovetime:-2,created:0}),false);
assert.equal(runtime.blocked(1,{kind:'projectile',player:1,supermovetime:-1,created:0}),false);
console.log('Helper placement passes '+cases+' native position/facing/coordinate-scale cases, missing P2, invalid inputs and class-specific negative pause allowances');
