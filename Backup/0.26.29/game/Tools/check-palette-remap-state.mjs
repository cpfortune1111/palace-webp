import assert from 'node:assert/strict';
import {createPaletteCatalog,createPaletteRemapState,applyPaletteRemap,resolvedPaletteIndex} from '../Engine/palette-remap-state.js';

const metadata={palettes:[{index:0,group:1,number:1,colorTable:0},{index:1,group:1,number:2,colorTable:1},{index:2,group:1,number:3,colorTable:2},{index:3,group:0,number:9,colorTable:0,remapIndex:0},{index:4,group:2,number:0,colorTable:3}],colorTables:[[[10,0,0,255],[20,0,0,255]],[[0,10,0,255],[0,20,0,255]],[[0,0,10,255],[0,0,20,255]],[[1,2,3,255]]]},catalog=createPaletteCatalog(metadata),state=createPaletteRemapState(),warnings=[];
assert.equal(applyPaletteRemap(state,catalog,[1,1],[1,2]),true);assert.deepEqual(state.remap,[1,1,2,1,4]);
applyPaletteRemap(state,catalog,[1,2],[1,3]);assert.equal(resolvedPaletteIndex(state,catalog,0),1);assert.equal(resolvedPaletteIndex(state,catalog,1),2);
applyPaletteRemap(state,catalog,[1,1],[-1,0]);assert.equal(resolvedPaletteIndex(state,catalog,0),0);assert.equal(resolvedPaletteIndex(state,catalog,3),0);
assert.equal(applyPaletteRemap(state,catalog,[1,1],[2,0],{warn:value=>warnings.push(value)}),false);assert.equal(warnings.length,1);
applyPaletteRemap(state,catalog,[-1,0],[1,3]);assert.deepEqual(state.remap,[2,2,2,2,4]);assert.deepEqual(state.lastDestination,[1,1]);
applyPaletteRemap(state,catalog,[-1,0],[-1,0]);assert.equal(state.remap,null);assert.equal(resolvedPaletteIndex(state,catalog,3),3);
assert.equal(applyPaletteRemap(state,catalog,[-2,0],[1,1]),false);assert.equal(applyPaletteRemap(state,catalog,[1,99],[1,1],{warn:value=>warnings.push(value)}),false);
applyPaletteRemap(state,catalog,[65537,1],[65537,2]);assert.equal(resolvedPaletteIndex(state,catalog,0),1);
console.log('Native palette remap state preserves direct mappings, duplicate tables, source/all reset, force depth filtering and uint16 logical names');
const equalColors=createPaletteCatalog({palettes:[{index:0,group:1,number:1,colorTable:0},{index:1,group:1,number:2,colorTable:0},{index:2,group:1,number:3,colorTable:1}],colorTables:metadata.colorTables.slice(0,2)}),equalState=createPaletteRemapState();applyPaletteRemap(equalState,equalColors,[1,1],[1,3]);assert.deepEqual(equalState.remap,[2,1,2]);
const chain=createPaletteCatalog({palettes:[{index:0,group:1,number:1,colorTable:0},{index:1,group:1,number:2,colorTable:0,remapIndex:0},{index:2,group:1,number:3,colorTable:0,remapIndex:1},{index:3,group:2,number:1,colorTable:1}],colorTables:metadata.colorTables.slice(0,2)}),chainState=createPaletteRemapState();applyPaletteRemap(chainState,chain,[1,1],[2,1]);assert.deepEqual(chainState.remap,[3,3,2,3]);assert.equal(chain.names.get('1,3'),1);
