const key='palace-load-recovery-v1';
export function readLoadRecovery(){try{const value=JSON.parse(sessionStorage.getItem(key));return value?.version===1?value:null}catch{return null}}
export function saveLoadRecovery(value){sessionStorage.setItem(key,JSON.stringify({version:1,...value}))}
export function clearLoadRecovery(){sessionStorage.removeItem(key)}
export function requestLoadRecovery(){const event=new CustomEvent('palace-load-retry',{cancelable:true});window.dispatchEvent(event);if(!event.defaultPrevented)location.reload()}
