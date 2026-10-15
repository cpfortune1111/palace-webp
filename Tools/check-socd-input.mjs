import assert from 'node:assert/strict';
import {createSocdInputState} from '../Engine/socd-input.js';

const both={U:true,D:true,B:true,F:true,a:true},directions=input=>['U','D','B','F'].map(key=>input[key]);
for(const [method,expected]of [[0,[true,true,true,true]],[1,[true,false,false,true]],[2,[true,false,false,true]],[3,[false,true,true,false]],[4,[false,false,false,false]],[-1,[false,false,false,false]]]){
 const state=createSocdInputState(),result=state.resolve(both,method);
 assert.deepEqual(directions(result),expected);assert.equal(result.a,true);
}
for(const method of [1,3]){
 const state=createSocdInputState();state.resolve({U:true,F:true},method);
 assert.deepEqual(directions(state.resolve(both,method)),method===1?[false,true,true,false]:[true,false,false,true]);
 state.resolve({},method);assert.deepEqual(directions(state.resolve(both,method)),method===1?[true,false,false,true]:[false,true,true,false]);
 state.reset();assert.deepEqual(directions(state.resolve(both,method)),method===1?[true,false,false,true]:[false,true,true,false]);
}
const first=createSocdInputState(),second=createSocdInputState();first.resolve({U:true,F:true},3);
assert.notDeepEqual(directions(first.resolve(both,3)),directions(second.resolve(both,3)));
assert.deepEqual(both,{U:true,D:true,B:true,F:true,a:true});
console.log('Pinned SOCD modes preserve allow-both, last/first histories, absolute offense priority, neutral fallback and D/B simultaneous-first ties');
