import {createPaletteCatalog} from './palette-remap-state.js';
import {createIndexedPaletteSurface} from './indexed-palette-surface.js';

export async function loadIndexedPaletteAssets(url,{fetch:fetchAsset=globalThis.fetch,decode=globalThis.createImageBitmap,createCanvas}={}){
 const response=await fetchAsset(url);if(!response.ok)throw Error('Indexed palette metadata HTTP '+response.status);
 const metadata=await response.json();if(metadata.schema!=='palace-indexed-atlas-v1')throw Error('Unsupported indexed palette schema');
 const catalog=createPaletteCatalog(metadata),surfaces=createIndexedPaletteSurface(catalog,createCanvas),pages=new Set(),spritesByPage=new Map();
 for(const [key,sprite]of Object.entries(metadata.sprites)){const entries=spritesByPage.get(sprite.page)??[];entries.push([key,sprite]);spritesByPage.set(sprite.page,entries)}
 for(const page of metadata.pages){
  if(pages.has(page.page))throw Error('Duplicate indexed palette page');
  const pageUrl=new URL(page.file,url);if(pageUrl.origin!==new URL(url).origin)throw Error('Indexed palette page outside asset origin');
  const response=await fetchAsset(pageUrl.href);if(!response.ok)throw Error('Indexed palette image HTTP '+response.status);
  const bytes=await response.arrayBuffer(),digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(value=>value.toString(16).padStart(2,'0')).join('');
  if(digest!==page.sha256)throw Error('Indexed palette checksum mismatch');
  const image=await decode(new Blob([bytes],{type:'image/webp'}));let canvas;
  try{
   if(image.width!==page.width||image.height!==page.height)throw Error('Indexed palette dimensions mismatch');
   canvas=createCanvas(image.width,image.height);const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);pages.add(page.page);
   for(const [key,sprite]of spritesByPage.get(page.page)??[]){
  if(![sprite.x,sprite.y,sprite.w,sprite.h].every(Number.isInteger)||sprite.x<0||sprite.y<0||sprite.w<1||sprite.h<1||sprite.x+sprite.w>context.canvas.width||sprite.y+sprite.h>context.canvas.height)throw Error('Indexed palette rectangle outside page');
  const rgba=context.getImageData(sprite.x,sprite.y,sprite.w,sprite.h).data,indices=new Uint8Array(sprite.w*sprite.h);
  for(let index=0;index<indices.length;index++){
   const offset=index*4;if(rgba[offset]!==rgba[offset+1]||rgba[offset]!==rgba[offset+2]||rgba[offset+3]!==255)throw Error('Corrupted indexed palette channels');indices[index]=rgba[offset];
  }
  surfaces.register(key,sprite.w,sprite.h,indices,sprite.paletteIndex);
   }
  }finally{image.close?.();if(canvas){canvas.width=1;canvas.height=1}}
 }
 for(const page of spritesByPage.keys())if(!pages.has(page))throw Error('Missing indexed palette page');
 return {metadata,catalog,surface:surfaces.surface};
}
