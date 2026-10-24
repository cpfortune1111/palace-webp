import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../Engine/palace-menu.js',import.meta.url),'utf8');
const declarations=['volume','releaseSound','sound'].map(name=>{
 const declaration=source.split(/\r?\n/).find(line=>line.startsWith(` function ${name}(`));
 assert.ok(declaration,`Missing production ${name} declaration`);
 return declaration;
}).join('\n');
const sounds=new Set(),options={master:100,sfx:100};
const context=vm.createContext({sounds,options,audio:{volume(){}}});
vm.runInContext(declarations,context);
const sample=()=>{const listeners=new Map();return {volume:0,addEventListener:(name,callback)=>listeners.set(name,callback),emit:name=>listeners.get(name)?.()}};
for(const reason of ['explicit','ended','error']){
 const media=sample();
 context.sound(media);
 assert.equal(sounds.size,1);
 assert.equal(media.volume,1);
 if(reason==='explicit')context.releaseSound(media);else media.emit(reason);
 context.releaseSound(media);
 assert.equal(sounds.size,0);
 options.sfx=20;
 context.volume();
 assert.equal(media.volume,1);
 options.sfx=100;
}
assert.match(source,/presentation,sound,releaseSound,options/);
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(index,/const release=\(\)=>\{playerRuntime\.stop\(record\);output\.release\(record\);gameShell\.releaseSound\(sound\);/);
console.log('Production menu sound tracking releases explicit/native, ended and error records idempotently without later volume updates');
