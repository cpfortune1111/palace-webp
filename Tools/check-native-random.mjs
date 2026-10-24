import assert from 'node:assert/strict';
import {createNativeRandom,nativeRandomInteger,nativeRandomFloat} from '../Engine/native-random.js';

const stream=createNativeRandom(1);
assert.deepEqual(Array.from({length:6},()=>stream.next()),[16807,282475249,1622650073,984943658,1144108930,470211272]);
stream.seed(0);assert.equal(stream.next(),2147483646);
assert.equal(nativeRandomFloat(-4,4,()=>1073741824),0);
assert.equal(nativeRandomFloat(-4,4,()=>2147483647),4);
assert.equal(nativeRandomFloat(4,-4,()=>2147483647),-4);
let floatCalls=0;assert.equal(nativeRandomFloat(7,7,()=>{floatCalls++;return 16807}),7);assert.equal(floatCalls,1);
stream.seed(1);stream.integer(0,2147483647);stream.float(-4,4);assert.equal(stream.state(),282475249);
const signed=value=>BigInt.asIntN(32,value);
for(const seed of [-2147483648,-1000000,-1,0,1,2147483647]){
 const random=createNativeRandom(seed);let reference=BigInt(seed);
 for(let tick=0;tick<100;tick++){
  const quotient=reference/127773n;reference=signed(signed(signed(reference-signed(quotient*127773n))*16807n)-signed(quotient*2836n));
  if(reference<=0n)reference=signed(reference+2147483647n-(reference===0n?1n:0n));
  assert.equal(random.next(),Number(reference));
 }
}
for(const [low,high] of [[5,9],[9,5],[-2147483648,2147483647],[0,2147483647],[7,7],[-10,10]])for(const sample of [1,16807,1073741824,2147483647]){
 let calls=0;const result=nativeRandomInteger(low,high,()=>{calls++;return sample}),first=BigInt(Math.min(low,high)),last=BigInt(Math.max(low,high)),difference=last-first;
 const expected=difference>2147483647n?signed(first+BigInt(sample)*difference/2147483647n):signed(first+BigInt(sample)/signed(2147483647n/signed(difference+1n)+1n));
 assert.equal(result,Number(expected));assert.equal(calls,1);
}
console.log('Pinned Random recurrence and RandI signed/reversed/full-range/equal-bound mapping pass independent BigInt checks');
