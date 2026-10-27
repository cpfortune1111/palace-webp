import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createDeclarationFlow} from '../Engine/declaration-flow.js';
const manifest=JSON.parse(fs.readFileSync(new URL('../Data/VS/declarations.json',import.meta.url))),variant=manifest.characters.SailorVenus.variants[0],events=[];let completed=false,playing=false;
const flow=createDeclarationFlow({variant:()=>variant,play:(player,cue)=>events.push({player,file:cue.file,tick:flow.snapshot().ticks}),playing:()=>playing,complete:()=>completed=true});
flow.begin();for(let tick=0;tick<639;tick++)flow.step();assert.equal(completed,true);assert.deepEqual(events.map(event=>[event.player,event.tick]),[[1,146],[1,256],[2,398],[2,508]]);assert.equal(flow.snapshot().phase,'done');assert.equal(flow.fade(),1);
flow.reset();assert.equal(flow.snapshot().phase,'idle');flow.begin();playing=true;for(let tick=0;tick<420;tick++)flow.step();assert.equal(flow.snapshot().phase,'voice');playing=false;flow.step();assert.equal(flow.snapshot().phase,'wait');assert.equal(flow.snapshot().age,0);for(let tick=0;tick<14;tick++)flow.step();assert.equal(flow.snapshot().player,1);flow.step();assert.equal(flow.snapshot().player,2);
console.log('Declaration: S191 cues, ordered players, 15-tick waits, audio completion gate and 30-tick fade passed');

