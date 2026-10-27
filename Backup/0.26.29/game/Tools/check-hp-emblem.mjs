import assert from 'node:assert/strict';
import fs from 'node:fs';
import {hpEmblemLayers,hpEmblemFrame} from '../Engine/hp-emblem.js';
const data=JSON.parse(fs.readFileSync(new URL('../Char/Venus/venus_hp.json',import.meta.url)));
assert.deepEqual(hpEmblemLayers(1000),[950]);
assert.deepEqual(hpEmblemLayers(250),[950,951]);
assert.deepEqual(hpEmblemLayers(251),[950]);
assert.deepEqual(hpEmblemLayers(0),[952]);
assert.deepEqual(hpEmblemLayers(1000),[950]);
assert.deepEqual(hpEmblemLayers(500,2000),[950,951]);
assert.equal(hpEmblemFrame(data,950,999),data.actions['950'][0]);
assert.equal(hpEmblemFrame(data,951,0),data.actions['951'][0]);
assert.equal(hpEmblemFrame(data,951,4),data.actions['951'][1]);
assert.equal(hpEmblemFrame(data,951,40).empty,true);
assert.equal(hpEmblemFrame(data,951,64),data.actions['951'][0]);
assert.equal(hpEmblemFrame(data,952,999),data.actions['952'][0]);
console.log('HP emblem: normal, readiness boundary, KO, revival and AIR timing passed');

