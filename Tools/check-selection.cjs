const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const drawing=[];
const context=new Proxy({drawImage:(...args)=>drawing.push(args)},{get:(target,key)=>target[key]||(()=>{})});
function element(tag){return {tag,style:{},dataset:{},hidden:false,children:[],appendChild(child){this.children.push(child)},replaceChildren(){this.children=[]},addEventListener(){},getContext(){return context}}}
const sandbox={console,document:{createElement:element},window:{addEventListener(){}},innerWidth:1280,innerHeight:720,devicePixelRatio:1,Image:class{async decode(){}},requestAnimationFrame(){},assetUrl:value=>value,fetch:async value=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,value.split('?')[0]),'utf8'))})};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'Engine/select-screen.js'),'utf8').replace(/^import .*\n/,'').replace('export function','function')+';globalThis.createSelectScreen=createSelectScreen;',sandbox);
(async()=>{let selected;const screen=sandbox.createSelectScreen(element('div'),{confirm:(mode,choice)=>selected={mode,choice},back(){}});await screen.ready;screen.show('vs');const key=code=>screen.handleKey({code,repeat:false});assert.equal(screen.snapshot().phase,'p1');key('Enter');key('Enter');assert.equal(screen.snapshot().phase,'p1hardware');key('ArrowRight');key('Enter');key('ArrowRight');key('ArrowRight');key('Enter');assert.equal(screen.snapshot().phase,'p1command');key('ArrowRight');key('Enter');key('Enter');assert.equal(screen.snapshot().phase,'stage');key('Escape');assert.equal(screen.snapshot().phase,'p2command');key('Enter');key('Enter');assert.equal(selected.mode,'vs');assert.deepEqual(Array.from(selected.choice.hardware),['3do','saturn']);assert.deepEqual(Array.from(selected.choice.command),['auto','normal']);const assets=JSON.parse(fs.readFileSync(path.join(root,'Data/Select/selection-assets.json')));function verify(value){if(value.file){assert.ok(fs.existsSync(path.join(root,value.file)));assert.ok(value.w>0&&value.h>0)}else Object.values(value).forEach(verify)}verify(assets);assert.ok(drawing.length>0);console.log('Selection phases, back navigation, mode payload, asset paths and drawing passed');})().catch(error=>{console.error(error);process.exitCode=1});
