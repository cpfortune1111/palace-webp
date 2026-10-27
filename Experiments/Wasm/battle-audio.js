const AudioContextClass=globalThis.AudioContext||globalThis.webkitAudioContext;
let context;
export function battleAudio(){
 if(!context||context.state==='closed'){
  if(!AudioContextClass)throw Error('WebAudio is unavailable');context=new AudioContextClass({sampleRate:44100,latencyHint:'interactive'});
  const metrics=context.__palaceMetrics={buffers:0,nonzero:0,maxQueuedMs:0,recent:[]},create=context.createBufferSource.bind(context);
  context.createBufferSource=()=>{const source=create(),start=source.start.bind(source);source.start=(when=0,...args)=>{let peak=0;if(source.buffer){const samples=source.buffer.getChannelData(0);for(let i=0;i<samples.length;i++)peak=Math.max(peak,Math.abs(samples[i]))}const queued=Math.max(0,when-context.currentTime)*1000;metrics.buffers++;if(peak>.0001)metrics.nonzero++;metrics.maxQueuedMs=Math.max(metrics.maxQueuedMs,queued);metrics.recent.push({at:performance.now(),when,queuedMs:queued,peak});if(metrics.recent.length>256)metrics.recent.shift();return start(when,...args)};return source};
 }
 window.__palaceBattleAudioContext=context;return context;
}
export async function readyBattleAudio(){const ctx=battleAudio();if(ctx.state!=='running')await ctx.resume();if(ctx.state!=='running')throw Error('Tap or press any button to enable battle audio');return ctx}
for(const name of ['pointerdown','keydown'])addEventListener(name,()=>{const ctx=battleAudio();if(ctx.state==='suspended')ctx.resume().catch(()=>{})},{capture:true});
battleAudio();
