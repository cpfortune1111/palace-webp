import assert from 'node:assert/strict';
import {applyRemapPaletteController} from '../Engine/remap-palette-controller.js';
import {createPaletteCatalog,createPaletteRemapState} from '../Engine/palette-remap-state.js';

const catalog=createPaletteCatalog({palettes:[{index:0,group:1,number:0,colorTable:0},{index:1,group:2,number:0,colorTable:1}],colorTables:[[[1,2,3,255]],[[4,5,6,255]]]}),caller={state:createPaletteRemapState()},recipient={state:createPaletteRemapState()},order=[];
const api={evaluate:value=>{order.push(value);return Number(value)},split:value=>String(value).split(','),findActor:id=>id===7?recipient:null,palette:actor=>({state:actor.state,catalog})};
assert.equal(applyRemapPaletteController({type:'RemapPal',params:{redirectid:'7',source:'1',dest:'2'}},caller,api),true);
assert.deepEqual(order,['7','1','2']);assert.deepEqual(recipient.state.remap,[1,1]);assert.equal(caller.state.remap,null);
order.length=0;applyRemapPaletteController({type:'RemapPal',params:{redirectid:'99',source:'1',dest:'2'}},caller,api);assert.deepEqual(order,['99']);
applyRemapPaletteController({type:'RemapPal',params:{dest:'2'}},caller,api);assert.deepEqual(caller.state.remap,[1,1]);
applyRemapPaletteController({type:'RemapPal',params:{dest:'-1'}},caller,api);assert.equal(caller.state.remap,null);
assert.throws(()=>applyRemapPaletteController({type:'RemapPal',params:{}},caller,api),/Missing/);
assert.throws(()=>applyRemapPaletteController({type:'RemapPal',params:{dest:'1',bogus:'2'}},caller,api),/Unsupported/);
assert.equal(applyRemapPaletteController({type:'Null'},caller,api),false);
console.log('RemapPal extraction preserves required dest, omitted source/item, caller evaluation, redirection short-circuit and real palette state writes');
