export async function preloadNativeSounds(loader,resources,{concurrency=8}={}){
 if(!Number.isInteger(concurrency)||concurrency<1)throw Error('Invalid sound preload concurrency');
 let cursor=0,completed=0;
 async function worker(){
  while(cursor<resources.length){
   const resource=resources[cursor++];
   await loader.load(resource.url,resource.metadata);
   completed++;
  }
 }
 await Promise.all(Array.from({length:Math.min(concurrency,resources.length)},worker));
 return completed;
}
