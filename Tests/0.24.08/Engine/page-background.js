export function pageBackgroundBounds(width,height){const scale=Math.min(width/1280,height/720);return {left:(width-1280*scale)/2,top:(height-720*scale)/2,right:(width+1280*scale)/2,bottom:(height+720*scale)/2}}
export function createPageBackground(parent=document.body){
 // Four real exterior bands cannot cover the game if a browser drops a clip-path.
 const view=document.createElement('div');view.id='pageBackground';view.setAttribute('aria-hidden','true');view.style.cssText='position:fixed;inset:0;z-index:200;pointer-events:none';parent.appendChild(view);
 const bands=Array.from({length:4},()=>{const band=document.createElement('div');band.style.cssText='position:absolute;background-color:#fff;background-repeat:repeat;pointer-events:none';view.appendChild(band);return band});
 const image=new Image(),url=new URL('../Data/System/page-pattern.webp?v=02374',import.meta.url);image.src=url.href;
 function resize(){const width=innerWidth,height=innerHeight,b=pageBackgroundBounds(width,height),rects=[[0,0,width,b.top],[0,b.bottom,width,height-b.bottom],[0,b.top,b.left,b.bottom-b.top],[b.right,b.top,width-b.right,b.bottom-b.top]];bands.forEach((band,i)=>{const [x,y,w,h]=rects[i];Object.assign(band.style,{left:x+'px',top:y+'px',width:Math.max(0,w)+'px',height:Math.max(0,h)+'px',backgroundPosition:-x+'px '+-y+'px'})})}
 const ready=image.decode().then(()=>{for(const band of bands){band.style.backgroundImage='url("'+url.href+'")';band.style.backgroundSize=image.naturalWidth*.125+'px '+image.naturalHeight*.125+'px'}resize()});resize();window.addEventListener('resize',resize);
 return {ready,resize,snapshot:()=>({...pageBackgroundBounds(innerWidth,innerHeight),tileWidth:image.naturalWidth*.125,tileHeight:image.naturalHeight*.125})};
}
