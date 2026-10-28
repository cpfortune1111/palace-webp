import {preloadQuoteAssets} from './quote-animation.js?v=02408r7';
export const presentationCharacters=['SailorVenus','SailorMoon','SailorJupiter','SailorNeptune','SailorSaturn'];
export async function ensurePresentationWorker(){
 if(!navigator.serviceWorker)throw Error('Open the test in a browser with service worker support.');
 const url=new URL('../snapshot-worker.js?v=02408r7',import.meta.url).href;if(navigator.serviceWorker.controller?.scriptURL===url)return;
 await navigator.serviceWorker.register(url,{scope:new URL('../',import.meta.url).pathname,updateViaCache:'none'});await navigator.serviceWorker.ready;
 if(navigator.serviceWorker.controller?.scriptURL!==url)await new Promise(resolve=>{const changed=()=>{if(navigator.serviceWorker.controller?.scriptURL===url){navigator.serviceWorker.removeEventListener('controllerchange',changed);resolve()}};navigator.serviceWorker.addEventListener('controllerchange',changed);changed()});
}
export function preloadPresentationPack(progress=()=>{}){
 return new Promise((resolve,reject)=>{const controller=navigator.serviceWorker?.controller;if(!controller){reject(Error('Open this test through index.html to prepare presentation assets.'));return}const channel=new MessageChannel();channel.port1.onmessage=({data})=>{if(data.type==='progress')progress(data.total?data.loaded/data.total:0);if(data.type==='ready'){channel.port1.close();progress(1);resolve()}if(data.type==='error'){channel.port1.close();reject(Error(data.message))}};controller.postMessage({type:'preload-presentation'},[channel.port2])});
}
export async function preloadPresentationPortraits(progress=()=>{}){
 const amounts=presentationCharacters.map(()=>0);await Promise.all(presentationCharacters.map((c,i)=>preloadQuoteAssets(c,'all',amount=>{amounts[i]=amount;progress(amounts.reduce((a,b)=>a+b,0)/amounts.length)})));progress(1);
}
