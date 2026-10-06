import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createDeclarationFlow} from '../Engine/declaration-flow.js';
const character=JSON.parse(fs.readFileSync(new URL('../Data/VS/declarations.json',import.meta.url))).characters.SailorVenus;
for(const winner of [1,2]){
 const events=[];let finished=false;
 const flow=createDeclarationFlow({variant:player=>(player===winner?character.winVariants:character.loseVariants)[0],play:(player,cue)=>events.push({player,tick:flow.snapshot().ticks,file:cue.file}),playing:()=>false,complete:()=>finished=true});
 flow.begin({result:true,winner});for(let tick=0;tick<120;tick++)flow.step();assert.equal(flow.snapshot().movement,1);assert.equal(events[0].player,winner===1?2:1);assert.equal(events[0].tick,120);
 for(let tick=120;tick<382;tick++)flow.step();assert.equal(flow.snapshot().phase,'loserFade');assert.equal(events[1].player,winner);assert.equal(events[1].tick,251);assert.equal(flow.snapshot().loserOpacity,1);for(let tick=0;tick<15;tick++)flow.step();assert.equal(flow.snapshot().loserOpacity,.5);assert.equal(finished,false);for(let tick=0;tick<15;tick++)flow.step();assert.equal(finished,true);
}
console.log('Result declarations: both winner roles, loser-first speech, 30-tick waits, movement and loser-only fade passed');

