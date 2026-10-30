export function loadFailureInfo(error,online=true){
 const message=String(error?.message||error?.type||error||'Unknown loading error');
 const resource=error?.resource||error?.target?.currentSrc||error?.target?.src||message.match(/https?:\/\/[^\s]+/)?.[0]||'';
 const status=error?.status||Number(message.match(/HTTP\s+(\d{3})/i)?.[1])||0;
 const connection=!online||error?.code==='NETWORK'||/Failed to fetch|NetworkError|network|connection|timed?\s*out|timeout/i.test(message)||[408,429,500,502,503,504].includes(status);
 const exhausted=error?.code==='RECOVERY_LIMIT';
 const program=error instanceof ReferenceError||/not defined|unsupported|SyntaxError|Cannot (?:read|access)/i.test(message)||/RUNTIME ERROR/i.test(message)&&!connection&&!status;
 return {kind:exhausted?'persistent':program?'program':connection?'connection':'asset',recoverable:!exhausted&&!program,
  title:exhausted?'Waiting to continue':program?'Waiting for an update':connection?'Waiting for connection':'just a sec. chibiusa is finding her key...',
  detail:message+(resource?'\nResource: '+resource:'')+(error?.phase?'\nLoading step: '+error.phase:''),status,resource};
}
export function createLoadFailureRecovery({notify,online=()=>navigator.onLine!==false,schedule=setTimeout,cancel=clearTimeout,listen=fn=>{window.addEventListener('online',fn);return()=>window.removeEventListener('online',fn)}}){
 let attempts=0,timer,pending,unsubscribe,generation=0;
 function clear(){generation++;if(timer)cancel(timer);timer=null;unsubscribe?.();unsubscribe=null;pending=null;attempts=0}
 function fail(error,options={}){
  if(timer)cancel(timer);timer=null;unsubscribe?.();unsubscribe=null;
  const info=loadFailureInfo(error,online());pending={error,options};const current=++generation;
  const retry=options.retry;if(!info.recoverable||typeof retry!=='function'){notify(info,'Your progress is kept. This error needs to be resolved before loading can continue.');return}
  let action=retry;
  if(attempts>=3&&options.inPlace&&info.kind!=='connection'){if(options.rebuild)action=options.rebuild;else{notify(info,'Automatic recovery could not resolve this error. Your progress is kept.');return}}
  const run=async()=>{if(current!==generation)return;timer=null;attempts++;notify(info,'Reconnecting automatically. Your progress is kept.');try{await action()}catch(next){if(next.code==='RECOVERY_LIMIT')next.message+='\nPrevious loading error: '+info.detail;fail(next,options)}};
  if(!online()){notify(info,'Your progress is kept. Loading will resume automatically when the connection returns.');unsubscribe=listen(()=>{unsubscribe?.();unsubscribe=null;run()});return}
  if(attempts>=3&&!options.inPlace){notify(info,'Automatic recovery could not resolve this error. Your progress is kept.');return}
  const delay=attempts<3?[1000,3000,8000][attempts]:30000;
  notify(info,info.kind==='connection'?'Your progress is kept. Checking the connection automatically.':'Recovering automatically. Your progress is kept.');timer=schedule(run,delay);
 }
 return {fail,clear,get active(){return !!pending},get attempts(){return attempts}};
}
