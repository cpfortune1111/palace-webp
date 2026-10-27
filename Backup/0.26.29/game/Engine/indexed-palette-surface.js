import {indexedPalettePixels} from './indexed-palette-pixels.js';
import {resolvedPaletteIndex} from './palette-remap-state.js';

export function createIndexedPaletteSurface(catalog,createCanvas){
 const sprites=new Map();
 function register(key,width,height,indices,paletteIndex){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||indices.length!==width*height||!catalog.palettes[paletteIndex])throw Error('Invalid indexed sprite surface');
  sprites.set(key,{width,height,indices:Uint8Array.from(indices),paletteIndex,surfaces:new Map()});
 }
 function surface(key,state){
  const sprite=sprites.get(key);if(!sprite)return null;
  const paletteIndex=resolvedPaletteIndex(state,catalog,sprite.paletteIndex),palette=catalog.palettes[paletteIndex];
  if(!palette)throw Error('Invalid remapped sprite palette');
  if(!sprite.surfaces.has(paletteIndex)){
   const canvas=createCanvas(sprite.width,sprite.height),context=canvas.getContext('2d'),image=context.createImageData(sprite.width,sprite.height);
   image.data.set(indexedPalettePixels(sprite.indices,catalog.colorTables[palette.colorTable]));context.putImageData(image,0,0);sprite.surfaces.set(paletteIndex,canvas);
  }
  return sprite.surfaces.get(paletteIndex);
 }
 return {register,surface};
}
