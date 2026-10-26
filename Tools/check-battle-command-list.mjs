import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createBattleCommandList} from '../Engine/battle-command-list.js';
const paths=['../Char/Venus/venus_cmd_runtime.json','../Char/Moon/Battle/moon_runtime.json','../Char/Jupiter/Battle/jupiter_runtime.json','../Char/Neptune/Battle/neptune_runtime.json','../Char/Saturn/Battle/saturn_runtime.json'];
let definitions=0;
for(const path of paths){
 const data=JSON.parse(fs.readFileSync(new URL(path,import.meta.url))),list=createBattleCommandList(data.commands,{engineVersions:data.engineVersions});
 assert.equal(list.commands.length,data.commands.length);definitions+=list.commands.length;
 for(const command of list.commands){command.buffer=3;assert.equal(command.matcher.buffer,3)}
 list.sample({});list.sample({});list.sample({});assert(list.commands.every(command=>command.buffer===0));
}
const definition={name:'or',command:'a|b',time:15,bufferTime:3};
const list=createBattleCommandList([definition]);list.sample({b:true});assert.equal(list.commands[0].buffer,3);list.sample({});assert.equal(list.commands[0].buffer,2);
const held={name:'held',command:'/B+a',time:15,bufferTime:3};
for(const legacy of [true,false]){
 const test=createBattleCommandList([held],{engineVersions:{ikemen:legacy?[0,0,0]:[1,0,0]}});
 for(let tick=0;tick<4;tick++)test.sample({B:true,a:true});
 assert.equal(test.commands[0].buffer,legacy?1:0);
}
const absolute=createBattleCommandList([{name:'left',command:'/L',time:15,bufferTime:1}]);
absolute.sample({B:true},{facing:1});assert.equal(absolute.signed.L,1);
absolute.sample({F:true},{facing:-1});assert.equal(absolute.signed.L,2);assert.equal(absolute.commands[0].buffer,1);
console.log(`PASS ${definitions} installed battle command definitions, writable assertion buffers, OR, versioned legacy holds and physical direction continuity`);
