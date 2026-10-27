import assert from 'node:assert/strict';
import {createDebugClipboard,formatClipboard} from '../Engine/debug-clipboard.js';

assert.equal(formatClipboard('%d %.2f %%',[{type:'int',value:3},{type:'float',value:1.25}]),'3 1.25 %');
assert.equal(formatClipboard('%+05d',[{type:'int',value:3}]),'+0003');
assert.equal(formatClipboard('%.2e',[{type:'float',value:1.25}]),'1.25e+00');
for(const [format,value,expected] of [['%.0f',2.5,'3'],['%.0f',3.5,'4'],['%.2f',1.125,'1.13'],['%.3g',.000012345,'1.23e-05'],['%#.3g',2,'2.00'],['%.1f',-0,'-0.0'],['%05.3d',3,'  003']])assert.equal(formatClipboard(format,[{type:format.endsWith('d')?'int':'float',value}]),expected,format);
assert.equal(formatClipboard('%.0f',[{type:'float',value:2.5}],{profile:'ikemen'}),'2');
assert.equal(formatClipboard('%.2f',[{type:'float',value:1.125}],{profile:'ikemen'}),'1.12');
assert.throws(()=>formatClipboard('%s',[{type:'string',value:'x'}]),/Unsupported clipboard format/);
assert.equal(formatClipboard('%d',[{type:'float',value:1.25}],{profile:'ikemen'}),'%!d(float32=1.25)');
assert.equal(formatClipboard('%.2f',[{type:'int',value:3}],{profile:'ikemen'}),'%!f(int32=3)');
assert.equal(formatClipboard('%d',[],{profile:'ikemen'}),'%!d(MISSING)');
assert.equal(formatClipboard('%ld',[{type:'int',value:3}],{profile:'ikemen'}),'3');
assert.equal(formatClipboard('%u',[{type:'int',value:-1}],{profile:'ikemen'}),'-1');
assert.equal(formatClipboard('%+08G',[{type:'float',value:NaN}],{profile:'ikemen'}),'(Undefined)');
for(const profile of ['mugen11','ikemen']){
 const clipboard=createDebugClipboard({rowLimit:2}),source={id:1},target={id:2},events=[];
 const api={profile,key:actor=>actor.id,findActor:id=>id===2?target:null,evaluate:value=>{events.push('redirect');return value},expressions:value=>value,sample:value=>{events.push(value);return {type:'int',value}}};
 clipboard.execute({type:'DisplayToClipboard',params:{text:'"first %d"',params:[3]}},source,api);
 clipboard.execute({type:'AppendToClipboard',params:{text:'"next"'}},source,api);
 assert.deepEqual(clipboard.entries()[0].lines,profile==='ikemen'?['first 3next']:['first 3','next']);
 clipboard.execute({type:'DisplayToClipboard',params:{redirectid:2,text:'"other %d"',params:[4]}},source,api);
 assert.deepEqual(events,[3,'redirect',4]);
 assert.deepEqual(clipboard.entries().find(entry=>entry.key===2).lines,['other 4']);
 clipboard.execute({type:'AppendToClipboard',params:{redirectid:2,text:'"\\nsecond\\nthird"'}},source,api);
 assert.deepEqual(clipboard.entries().find(entry=>entry.key===2).lines,['second','third']);
 events.length=0;clipboard.execute({type:'DisplayToClipboard',params:{redirectid:99,text:'"%d"',params:[9]}},source,api);assert.deepEqual(events,['redirect']);
 clipboard.execute({type:'ClearClipboard',params:{redirectid:2}},source,api);
 assert.equal(clipboard.entries().some(entry=>entry.key===2),false);
 clipboard.prune(new Set());assert.deepEqual(clipboard.entries(),[]);
}
console.log('Clipboard display/append/clear stores, row limits, redirect sampling and supported numeric formats pass; full native printf remains Pending');
