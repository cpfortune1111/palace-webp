// One stable worker URL is shared by launcher and game. Do not alternate revisions.
export const pageRevision='02408r24';
export const routerURL=new URL('../snapshot-worker.js',import.meta.url).href;
let pending;
export function ensureRouter(){
 if(pending)return pending;
 pending=(async()=>{
  if(!navigator.serviceWorker)throw Error('This browser cannot load the game asset router.');
  let registrationTimer;
  try{await Promise.race([navigator.serviceWorker.register(routerURL,{scope:new URL('../',import.meta.url).pathname,updateViaCache:'none'}),new Promise((_,reject)=>{registrationTimer=setTimeout(()=>reject(Error('Connection timed out while starting the game asset router.')),20000)})])}finally{clearTimeout(registrationTimer)}
  if(navigator.serviceWorker.controller?.scriptURL===routerURL)return;
  await new Promise((resolve,reject)=>{
   const finish=error=>{clearTimeout(timer);navigator.serviceWorker.removeEventListener('controllerchange',changed);error?reject(error):resolve()};
   const changed=()=>{if(navigator.serviceWorker.controller?.scriptURL===routerURL)finish()};
   const timer=setTimeout(()=>finish(Error('The game asset router did not become ready.')),20000);
   navigator.serviceWorker.addEventListener('controllerchange',changed);changed();
  });
 })().catch(error=>{pending=null;throw error});return pending;
}
export function installAssetFetch(){
 if(globalThis.__palaceAssetFetch)return;globalThis.__palaceAssetFetch=true;
 const original=globalThis.fetch.bind(globalThis),base=new URL('../',import.meta.url);
 globalThis.fetch=async(input,options)=>{
  const resource=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);
  const method=String(options?.method||input?.method||'GET').toUpperCase();
  if(resource.origin!==base.origin||!['GET','HEAD'].includes(method))return original(input,options);
  const limit=resource.pathname.startsWith(base.pathname)?1:3;let failure;
  for(let attempt=0;attempt<limit;attempt++){
   try{const response=await original(input,options);if(!response.ok)throw Object.assign(Error('HTTP '+response.status+': '+resource.href),{status:response.status,resource:resource.href});return response}
   catch(error){if(error.name==='AbortError')throw error;failure=error.resource?error:Object.assign(Error(error.message+'\n'+resource.href),{code:'NETWORK',resource:resource.href,cause:error});if(attempt+1>=limit||failure.status&&![408,429,500,502,503,504].includes(failure.status))throw failure;await new Promise(resolve=>setTimeout(resolve,[1000,3000][attempt]))}
  }
  throw failure;
 };
}
