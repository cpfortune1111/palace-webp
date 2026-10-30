import {preloadQuoteAssets} from './quote-animation.js?v=02408r13';
import {ensureRouter,installAssetFetch} from './boot-router.js?v=02408r22';
export const presentationCharacters=['SailorVenus','SailorMoon','SailorJupiter','SailorNeptune','SailorSaturn'];
export async function ensurePresentationWorker(){
 await ensureRouter();installAssetFetch();
}
export function preloadPresentationPack(progress=()=>{}){
 return new Promise((resolve,reject)=>{const controller=navigator.serviceWorker?.controller;if(!controller){reject(Error('The game asset router is not ready.'));return}const channel=new MessageChannel();let timer;const timeout=()=>{clearTimeout(timer);timer=setTimeout(()=>{channel.port1.close();reject(Object.assign(Error('Connection timed out while loading presentation assets.'),{code:'NETWORK'}))},30000)};timeout();channel.port1.onmessage=({data})=>{timeout();if(data.type==='progress')progress(data.total?data.loaded/data.total:0);if(data.type==='ready'){clearTimeout(timer);channel.port1.close();progress(1);resolve()}if(data.type==='error'){clearTimeout(timer);channel.port1.close();reject(Object.assign(Error(data.message),{resource:data.resource,status:data.status}))}};controller.postMessage({type:'preload-presentation'},[channel.port2])});
}
export async function preloadPresentationPortraits(progress=()=>{}){
 const amounts=presentationCharacters.map(()=>0);await Promise.all(presentationCharacters.map((c,i)=>preloadQuoteAssets(c,'all',amount=>{amounts[i]=amount;progress(amounts.reduce((a,b)=>a+b,0)/amounts.length)})));progress(1);
}
