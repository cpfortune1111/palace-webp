const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {createNativeRandom}=require('../Engine/native-random.js');
const [receiptFile,outputFile]=process.argv.slice(2);
if(!receiptFile||!outputFile)throw Error('Usage: node check-native-runtime-components.cjs <private build receipt> <private output JSON>');
const receipt=JSON.parse(fs.readFileSync(receiptFile,'utf8'));
assert.equal(receipt.commit,'cb56d73badb322f3725257c2e8cfd157b2c3989d');
assert(receipt.compiler.startsWith('go version go1.27.3 '));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(receipt.executable)).digest('hex'),receipt.executableSha256);
const bits=value=>{const b=new ArrayBuffer(4),v=new DataView(b);v.setFloat32(0,value);return v.getUint32(0)};
let seed=0x2630;const next=()=>seed=(Math.imul(seed,1664525)+1013904223)|0;
const seeds=[-2147483648,-2147483647,-127773,-1,0,1,127773,2147483646,2147483647];
for(let i=0;i<128;i++)seeds.push(next());
const integerBounds=[[-2147483648,2147483647],[2147483647,-2147483648],[0,2147483647],[-2147483648,-1],[-10,10],[9,5],[7,7],[0,999]];
const floatBounds=[[-4,4],[4,-4],[7,7],[-0,0],[-1e-30,1e-30],[-1e30,1e30],[3.14159265,-2.71828183]];
const requests=[],expected=[];
for(const initial of seeds){const random=createNativeRandom(initial),Operations=[],values=[];
 for(let i=0;i<80;i++){
  if(i%3===0){Operations.push({Mode:'next'});values.push({Integer:random.next(),State:random.state()})}
  else if(i%3===1){const [Low,High]=integerBounds[(next()>>>0)%integerBounds.length];Operations.push({Mode:'integer',Low,High});values.push({Integer:random.integer(Low,High),State:random.state()})}
  else {const [FloatLow,FloatHigh]=floatBounds[(next()>>>0)%floatBounds.length];Operations.push({Mode:'float',FloatLow,FloatHigh});values.push({FloatBits:bits(random.float(FloatLow,FloatHigh)),State:random.state()})}
 }
 requests.push({Kind:'rng',Seed:initial,Operations});expected.push({kind:'rng',values});
}
const f=Math.fround;
for(const Paused of [false,true])for(const FrameStep of [false,true])for(const Interpolate of [false,true])for(const OldTick of [-1,0,1,2])for(const Tick of [0,1,2])for(const [TickFloat,NextAdd,LastTick]of [[0,0,0],[0,.5,0],[.75,.25,0],[.99999999,.00000002,0],[1.25,.5,1],[-.75,-.5,-1],[2,0,0]]){
 const frame=(!Paused||FrameStep)&&OldTick<Tick,nextFrame=Math.trunc(f(f(TickFloat)+f(NextAdd)))>Tick&&(!Paused||FrameStep||OldTick>=Tick);
 const interpolation=nextFrame||!Interpolate?1:Math.min(1,Math.max(0,f(f(f(TickFloat)-f(LastTick))+f(NextAdd))));
 requests.push({Kind:'tick',Paused,FrameStep,Interpolate,OldTick,Tick,TickFloat,NextAdd,LastTick});expected.push({kind:'tick',frame,nextFrame,interpolation:bits(interpolation)});
}
const priority=a=>a.First&&!a.Last?100:a.Last&&!a.First?-100:a.Move==='A'?5:!a.Helper?a.Move==='I'?4:3:a.Move==='I'?2:1;
function orderModel(Actors,Rounds){const actors=structuredClone(Actors),Trace=[];
 for(let n=0;n<Rounds;n++){
  actors.sort((a,b)=>priority(b)-priority(a)||a.ID-b.ID);for(const a of actors){a.First=false;a.Last=false}
  Trace.push('commands');for(const a of actors)Trace.push('prepare:'+a.ID);
  for(let i=0;i<actors.length;i++){const a=actors[i];Trace.push('run:'+a.ID);actors.push(...(a.Spawn||[]));a.Spawn=[]}
  for(const a of actors)Trace.push('finish:'+a.ID);
 }return {Trace,Order:actors.map(a=>a.ID),Flags:actors.map(a=>(a.First?1:0)|(a.Last?2:0))};
}
const orderFixtures=[];
for(const Helper of [false,true])for(const Move of ['I','A','H'])for(const [First,Last]of [[false,false],[true,false],[false,true],[true,true]])orderFixtures.push({ID:50-orderFixtures.length,Helper,Move,First,Last});
requests.push({Kind:'order',Actors:orderFixtures,Rounds:2});expected.push({kind:'order',...orderModel(orderFixtures,2)});
for(let n=0;n<320;n++){
 const Actors=[];for(let i=0;i<1+(n%12);i++)Actors.push({ID:i+1,Helper:!!((next()>>>16)&1),Move:['I','A','H'][(next()>>>0)%3],First:!((next()>>>16)&3),Last:!((next()>>>16)&3)});
 // Reverse incoming IDs to exercise the native ID tiebreak independently of insertion order.
 if(n%2)Actors.reverse();
 if(n%4===0)Actors[n%Actors.length].Spawn=[{ID:100,Helper:true,Move:'A',First:true,Spawn:[{ID:101,Helper:true,Move:'I'}]}];
 const Rounds=1+n%3;requests.push({Kind:'order',Actors,Rounds});expected.push({kind:'order',...orderModel(Actors,Rounds)});
}
const results=JSON.parse(cp.execFileSync(receipt.executable,[],{input:JSON.stringify(requests),encoding:'utf8',maxBuffer:32*1024*1024,timeout:60000}));
assert.equal(results.length,expected.length);
let randomOperations=0,tickCases=0,orderCases=0;
for(let i=0;i<results.length;i++){const actual=results[i],want=expected[i];assert.equal(actual.Panic,'','native panic '+i);
 if(want.kind==='rng'){assert.equal(actual.Values.length,want.values.length);for(let n=0;n<want.values.length;n++){const value=want.values[n],got=actual.Values[n];assert.equal(got.State,value.State,`RNG state ${i}:${n}`);if('Integer'in value)assert.equal(got.Integer,value.Integer,`RNG integer ${i}:${n}`);else assert.equal(got.FloatBits,value.FloatBits,`RNG float bits ${i}:${n}`);randomOperations++}}
 else if(want.kind==='tick'){assert.equal(actual.TickFrame,want.frame,'tickFrame '+i);assert.equal(actual.TickNext,want.nextFrame,'tickNext '+i);assert.equal(actual.InterpolationBits,want.interpolation,'interpolation '+i);tickCases++}
 else {assert.deepEqual(actual.Trace,want.Trace,'action trace '+i);assert.deepEqual(actual.Order,want.Order,'order '+i);assert.deepEqual(actual.Flags,want.Flags,'flag reset '+i);orderCases++}
}
const report={commit:receipt.commit,compiler:receipt.compiler,oracleExecutableSha256:receipt.executableSha256,randomOperations,tickCases,orderCases,matched:true,
 scopes:{random:'Actual Web native-random.js consumer versus extracted native RNG functions; no full gameplay RNG wiring certification.',tick:'Compiled native gates versus independent float32 formula fixtures; current Web scheduler is not certified.',order:'Compiled native priority/action loops with trace callback facades versus fixture model; current Web actor scheduler is not certified.'},goalComplete:false};
fs.writeFileSync(outputFile,JSON.stringify(report,null,2)+'\n');console.log(`PASS ${randomOperations} actual Web RNG operations, ${tickCases} native tick boundary probes and ${orderCases} native action-order probes`);
