export function indexedPalettePixels(indices,palette){
 if(!Array.isArray(palette)||palette.length>256)throw Error('Invalid indexed palette');
 for(const color of palette)if(!Array.isArray(color)||color.length!==4||color.some(value=>!Number.isInteger(value)||value<0||value>255))throw Error('Invalid palette color');
 const result=new Uint8ClampedArray(indices.length*4);
 for(let index=0;index<indices.length;index++){const color=indices[index];if(!Number.isInteger(color)||color<0||color>255)throw Error('Palette index out of range');if(color<palette.length)result.set(palette[color],index*4)}
 return result;
}
