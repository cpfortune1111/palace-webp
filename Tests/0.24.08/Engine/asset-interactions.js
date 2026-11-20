let installed=false;
export function installAssetInteractions(){if(installed)return;installed=true;
 const protect=node=>{if(node.matches?.('img,a'))node.draggable=false;node.querySelectorAll?.('img,a').forEach(image=>image.draggable=false)};
 protect(document);new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)protect(node)}).observe(document.documentElement,{childList:true,subtree:true});
 document.addEventListener('dragstart',event=>event.preventDefault(),true);
 const style=document.createElement('style');style.textContent='img,canvas,svg{-webkit-user-drag:none;user-select:none;-webkit-user-select:none}';document.head.append(style);
}
