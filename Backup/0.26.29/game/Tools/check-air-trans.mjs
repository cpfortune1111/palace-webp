import assert from 'node:assert/strict';
import {airTransState,parseAirTransState,resolveSpriteTrans} from '../Engine/air-trans.js';

assert.deepEqual(airTransState('A1'),{type:'add',alpha:[255,128]});
assert.deepEqual(airTransState('AS128D64'),{type:'add',alpha:[128,64]});
assert.deepEqual(airTransState('AS'),{type:'add',alpha:[0,0]});
assert.deepEqual(airTransState('SS128'),{type:'sub',alpha:[128,255]});
assert.deepEqual(airTransState('SAS128D64'),{type:'subadd',alpha:[128,64]});
assert.deepEqual(airTransState('AS16384D999'),{type:'add',alpha:[0,255]});
assert.deepEqual(resolveSpriteTrans({type:'default',alpha:[255,0]},'A'),{type:'add',alpha:[255,255]});
assert.deepEqual(resolveSpriteTrans({type:'none',alpha:[255,0]},'A'),{type:'none',alpha:[255,0]});
for(const [token,type,alpha] of [
 ['SS','sub',[0,255]],['SAS','subadd',[0,255]],['ASD','add',[0,0]],
 ['ASD64','add',[0,64]],['SS12D','sub',[12,255]],['SAS12D','subadd',[12,255]],
 ['AS12D34junk','add',[12,34]],['AS12junkD34','add',[12,0]],
 ['ASjunk','add',[0,0]],['AS-1D9','add',[0,0]],['SSjunk','sub',[0,255]],
 ['SASjunk','subadd',[0,255]],['xxAS12D34','add',[12,34]],
 ['  as000128d000064  ','add',[128,64]],['AS256D256','add',[255,255]],
 ['AS16385D32769','add',[1,1]],['SS16383D16384','sub',[255,0]],
 ['SA','subadd',[255,255]],['A','add',[255,255]],['S','sub',[255,255]],
]){
 assert.deepEqual(airTransState(token),{type,alpha},token);
 assert.deepEqual(parseAirTransState(token).diagnostics,[],token+' native accepts prefix/tail');
}
for(const token of ['',undefined,null,'   '])assert.deepEqual(airTransState(token),{type:'none',alpha:[255,0]});
for(const [token,type] of [['A10','add'],['A1junk','add'],['SA7','subadd'],['Sgarbage','sub'],['Q','none']]){
 const result=parseAirTransState(token);
 assert.equal(result.state.type,type,token+' native-selected fallback');
 assert.equal(result.diagnostics.length,1,token+' preserved diagnostic');
 assert.throws(()=>airTransState(token),/Invalid/);
 assert.deepEqual(airTransState(token,{strict:false}),result.state,token+' error-tolerant mode');
}
const huge='98765432101234567890'.repeat(10),wrapped=Number(BigInt(huge)&16383n);
assert.deepEqual(airTransState('AS'+huge+'D'+huge),{type:'add',alpha:[Math.min(255,wrapped),Math.min(255,wrapped)]});
assert.deepEqual(resolveSpriteTrans({type:'default'},'AS'),{type:'add',alpha:[0,0]});
assert.deepEqual(resolveSpriteTrans({type:'none',alpha:[255,0]},'AS'),{type:'none',alpha:[255,0]});
console.log('Pinned AIR alpha zero-source, prefix/tail acceptance, byte coefficients, retained diagnostics and controller precedence passed');
