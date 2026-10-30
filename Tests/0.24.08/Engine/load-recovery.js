const key='palace-load-recovery-v1',budgetKey='palace-load-rebuild-v2';
export function readLoadRecovery(){try{const value=JSON.parse(sessionStorage.getItem(key));return value?.version===1?value:null}catch{return null}}
export function saveLoadRecovery(value){try{sessionStorage.setItem(key,JSON.stringify({version:1,...value}));return true}catch{return false}}
export function clearLoadRecovery(){try{sessionStorage.removeItem(key);sessionStorage.removeItem(budgetKey)}catch{}}
export function rebuildPageOnce(){
 try{
  if(sessionStorage.getItem(budgetKey))throw Object.assign(Error('A page rebuild was already attempted. '+(navigator.onLine===false?'The connection is offline.':'The loading error persists.')),{code:'RECOVERY_LIMIT'});
  sessionStorage.setItem(budgetKey,String(Date.now()));
 }catch(error){if(error.code==='RECOVERY_LIMIT')throw error;throw Object.assign(Error('Automatic page recovery cannot save this session. '+error.message),{code:'RECOVERY_LIMIT'})}
 location.reload();
}
export function requestLoadRecovery(){const detail={result:null},event=new CustomEvent('palace-load-retry',{cancelable:true,detail});window.dispatchEvent(event);return event.defaultPrevented?detail.result:rebuildPageOnce()}
