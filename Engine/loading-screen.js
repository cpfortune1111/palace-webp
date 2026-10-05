export function createLoadingScreen(parent=document.body,id='palaceLoading'){
 const view=document.createElement('section');view.id=id;view.hidden=true;view.style.cssText='position:fixed;inset:0;z-index:90;background:#000;color:#fff;display:none;align-items:center;justify-content:center;touch-action:none';view.setAttribute('aria-label','Loading');view.setAttribute('aria-busy','true');
 const content=document.createElement('div');content.style.cssText='width:min(360px,70vw);text-align:center;font:18px system-ui';view.appendChild(content);
 const label=document.createElement('div');label.textContent='Loading…';label.style.cssText='margin-bottom:18px';label.setAttribute('role','status');content.appendChild(label);
 const bar=document.createElement('div');bar.style.cssText='height:6px;background:#292929;overflow:hidden';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Loading progress');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');content.appendChild(bar);
 const fill=document.createElement('div');fill.style.cssText='height:100%;width:0%;background:#fff';bar.appendChild(fill);
 const percentage=document.createElement('div');percentage.style.cssText='margin-top:12px;font:14px system-ui;color:#aaa';content.appendChild(percentage);
 const exit=document.createElement('button');exit.textContent='返回';exit.hidden=true;exit.style.cssText='margin-top:20px;border:1px solid #777;background:#000;color:#fff;padding:8px 20px';content.appendChild(exit);parent.appendChild(view);
 let progress=0,onExit;
 exit.addEventListener('click',()=>{hide();onExit?.()});
 function update(value){progress=Math.max(progress,Math.min(1,Math.max(0,Number(value)||0)));const percent=Math.floor(progress*100);fill.style.width=percent+'%';percentage.textContent=percent+'%';bar.setAttribute('aria-valuenow',String(percent))}
 function show(){progress=0;label.textContent='Loading…';exit.hidden=true;bar.hidden=false;percentage.hidden=false;view.hidden=false;view.style.display='flex';view.setAttribute('aria-busy','true');update(0)}
 function hide(){view.hidden=true;view.style.display='none';view.setAttribute('aria-busy','false')}
 function fail(error,back){label.textContent='載入失敗，請重新整理';label.title=String(error?.message||error);view.setAttribute('aria-busy','false');onExit=back;exit.hidden=!back}
 return {show,hide,update,fail,get visible(){return !view.hidden},get progress(){return progress}};
}
