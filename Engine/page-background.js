export function pageBackgroundBounds(width,height){const scale=Math.min(width/1280,height/720);return {left:(width-1280*scale)/2,top:(height-720*scale)/2,right:(width+1280*scale)/2,bottom:(height+720*scale)/2}}

export function createPageBackground(parent=document.body){
 const view=document.createElement('div');view.id='pageBackground';view.setAttribute('aria-hidden','true');view.style.cssText='position:fixed;inset:0;z-index:200;pointer-events:none;background-color:#fff;background-repeat:repeat';parent.appendChild(view);
 function resize(){const width=innerWidth,height=innerHeight,bounds=pageBackgroundBounds(width,height);view.style.clipPath='polygon(evenodd,0px 0px,'+width+'px 0px,'+width+'px '+height+'px,0px '+height+'px,0px 0px,'+bounds.left+'px '+bounds.top+'px,'+bounds.left+'px '+bounds.bottom+'px,'+bounds.right+'px '+bounds.bottom+'px,'+bounds.right+'px '+bounds.top+'px,'+bounds.left+'px '+bounds.top+'px)'}
 function syncLayer(){const covered=!!document.getElementById('logoIntro')||['palaceMenu','battleLoading','selectionLoading'].some(id=>{const element=document.getElementById(id);return element&&!element.hidden}),layer=covered?'200':'0';if(view.style.zIndex!==layer)view.style.zIndex=layer}
 const observer=new MutationObserver(syncLayer);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});syncLayer();
 const image=new Image(),url=new URL('../Data/System/page-pattern.webp?v=02374',import.meta.url);image.src=url.href;const ready=image.decode().then(()=>{view.style.backgroundImage='url("'+url.href+'")';view.style.backgroundSize=image.naturalWidth*.125+'px '+image.naturalHeight*.125+'px';resize()});resize();window.addEventListener('resize',resize);
 return {ready,resize,snapshot:()=>({...pageBackgroundBounds(innerWidth,innerHeight),tileWidth:image.naturalWidth*.125,tileHeight:image.naturalHeight*.125})};
}

