import assert from 'node:assert/strict';
class FakeAudio{constructor(){this.paused=true;this.currentTime=0;this.volume=1;this.plays=0}load(){}pause(){this.paused=true}play(){this.paused=false;this.plays++;return Promise.resolve()}}
globalThis.Audio=FakeAudio;globalThis.fetch=async()=>({ok:true,json:async()=>({}),blob:async()=>new Blob(['audio'])});
const {createMenuAudio}=await import('../Engine/menu-audio.js');
const home=new Audio(),audio=createMenuAudio(home,()=>({master:100,bgm:100,sfx:100}));await audio.ready;
audio.homeStart();audio.step(.5);assert.equal(home.volume,1);audio.fadeHomeOut();audio.step(.25);assert.equal(home.volume,.5);audio.step(.25);assert.equal(home.paused,true);
audio.beginSelection();audio.step(.5);const before=audio.snapshot();audio.beginSelection();assert.deepEqual(audio.snapshot(),before);audio.fadeAmbientOut();audio.step(.5);assert.equal(audio.snapshot().ambientGain,0);
audio.beginReport();assert.equal(audio.snapshot().context,'report');assert.equal(audio.snapshot().ambientGain,0);audio.step(.5);assert.equal(audio.snapshot().ambientGain,1);audio.fadeAmbientOut();audio.step(.5);assert.equal(audio.snapshot().ambientGain,0);
console.log('Home fade, uninterrupted selection/ACS music and Report fades passed');

