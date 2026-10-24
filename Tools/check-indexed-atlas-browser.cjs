const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('C:/Users/jeffy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root=path.resolve(process.argv[2]||path.join(__dirname,'../../outputs/saturn-indexed-preview'));
const metadata=JSON.parse(fs.readFileSync(path.join(root,'indexed.json'),'utf8'));
const files=new Map([['/indexed.json',path.join(root,'indexed.json')],['/indexed-palette-pixels.js',path.resolve(__dirname,'../Engine/indexed-palette-pixels.js')]]);
for(const page of metadata.pages){const file=path.resolve(root,page.file);if(!file.startsWith(root+path.sep))throw Error('Indexed atlas file outside asset root');files.set('/'+page.file,file)}
for(const name of ['palette-remap-state.js','indexed-palette-surface.js','indexed-palette-assets.js'])files.set('/'+name,path.resolve(__dirname,'../Engine',name));
const server=http.createServer((request,response)=>{
 const pathname=new URL(request.url,'http://localhost').pathname;
 if(pathname==='/'){response.setHeader('Content-Type','text/html');response.end('<!doctype html><title>Indexed atlas verification</title>');return}
 const file=files.get(pathname);if(!file){response.writeHead(404);response.end();return}
 response.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':'image/webp');response.end(fs.readFileSync(file));
});
(async()=>{
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port+'/');
  const rows=await page.evaluate(async()=>{
   const metadata=await fetch('/indexed.json').then(response=>response.json()),{indexedPalettePixels}=await import('/indexed-palette-pixels.js'),canvases=new Map(),rows=[];
   const hash=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(value=>value.toString(16).padStart(2,'0')).join('');
   for(const entry of metadata.pages){const response=await fetch('/'+entry.file),bytes=await response.arrayBuffer();if(await hash(bytes)!==entry.sha256)throw Error('Indexed image checksum mismatch');const image=await createImageBitmap(new Blob([bytes],{type:'image/webp'}));if(image.width!==entry.width||image.height!==entry.height)throw Error('Indexed image dimensions mismatch');const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);image.close();canvases.set(entry.page,context)}
   for(const [key,sprite]of Object.entries(metadata.sprites)){
    const pixels=canvases.get(sprite.page).getImageData(sprite.x,sprite.y,sprite.w,sprite.h).data,indices=new Uint8Array(sprite.w*sprite.h);
    for(let index=0;index<indices.length;index++){const offset=index*4;if(pixels[offset]!==pixels[offset+1]||pixels[offset]!==pixels[offset+2]||pixels[offset+3]!==255)throw Error('Nonexact indexed image channels');indices[index]=pixels[offset]}
    const palette=metadata.palettes.find(palette=>palette.index===sprite.paletteIndex),rgba=indexedPalettePixels(indices,metadata.colorTables[palette.colorTable]);
    rows.push({key,index:await hash(indices),rgba:await hash(rgba),expectedIndex:sprite.indexSHA256,expectedRgba:sprite.rgbaSHA256});
   }
   const {createPaletteCatalog,createPaletteRemapState,applyPaletteRemap}=await import('/palette-remap-state.js'),{createIndexedPaletteSurface}=await import('/indexed-palette-surface.js');
   const catalog=createPaletteCatalog(metadata),first=createPaletteRemapState(),second=createPaletteRemapState(),surfaces=createIndexedPaletteSurface(catalog,(width,height)=>{const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas});
   const {loadIndexedPaletteAssets}=await import('/indexed-palette-assets.js'),pageCanvases=[],loaded=await loadIndexedPaletteAssets(new URL('/indexed.json',location.href).href,{createCanvas:(width,height)=>{const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;pageCanvases.push(canvas);return canvas}});
   if(pageCanvases.length!==metadata.pages.length||pageCanvases.some(canvas=>canvas.width!==1||canvas.height!==1))throw Error('Indexed loader retained full page canvases');
   const corrupt=structuredClone(metadata);corrupt.pages[0].sha256='0'.repeat(64);let rejected=false,decoded=false;
   try{await loadIndexedPaletteAssets(new URL('/indexed.json',location.href).href,{fetch:async url=>String(url).endsWith('/indexed.json')?{ok:true,json:async()=>corrupt}:fetch(url),decode:()=>{decoded=true;throw Error('Checksum should reject before decode')}})}catch(error){if(!error.message.includes('checksum mismatch'))throw error;rejected=true}
   if(!rejected||decoded)throw Error('Corrupted indexed asset was not rejected before decode');
   for(const [key,sprite]of Object.entries(metadata.sprites)){
    const pixels=canvases.get(sprite.page).getImageData(sprite.x,sprite.y,sprite.w,sprite.h).data,indices=Uint8Array.from({length:sprite.w*sprite.h},(_,index)=>pixels[index*4]);
    surfaces.register(key,sprite.w,sprite.h,indices,sprite.paletteIndex);
    const source=metadata.palettes[sprite.paletteIndex],target=metadata.palettes.find(palette=>palette.index!==source.index&&metadata.colorTables[palette.colorTable].length===metadata.colorTables[source.colorTable].length);
    if(!target)throw Error('Missing real destination palette');
    applyPaletteRemap(first,catalog,[-1,0],[target.group,target.number]);
    const mapped=catalog.names.get(target.group+','+target.number),expected=indexedPalettePixels(indices,metadata.colorTables[metadata.palettes[mapped].colorTable]);
    const actual=surfaces.surface(key,first).getContext('2d').getImageData(0,0,sprite.w,sprite.h).data;
    const loadedPixels=loaded.surface(key,first).getContext('2d').getImageData(0,0,sprite.w,sprite.h).data;if(await hash(loadedPixels)!==await hash(actual))throw Error('Loaded remap surface mismatch');
    const original=surfaces.surface(key,second).getContext('2d').getImageData(0,0,sprite.w,sprite.h).data;
    const originalExpected=indexedPalettePixels(indices,metadata.colorTables[source.colorTable]);
    for(let offset=0;offset<actual.length;offset+=4){
     for(let channel=0;channel<4;channel++){
      if((channel===3||expected[offset+3]===255)&&actual[offset+channel]!==expected[offset+channel])throw Error('Remapped surface mismatch');
      if((channel===3||originalExpected[offset+3]===255)&&original[offset+channel]!==originalExpected[offset+channel])throw Error('Independent actor palette mismatch');
     }
    }
    if(surfaces.surface(key,first)!==surfaces.surface(key,first))throw Error('Palette surface cache missed');
    applyPaletteRemap(first,catalog,[-1,0],[-1,0]);if(surfaces.surface(key,first)!==surfaces.surface(key,second))throw Error('Palette reset surface mismatch');
   }
   if((await fetch('/source.sff')).status!==404)throw Error('Original source unexpectedly exposed');return rows;
  });
  assert.equal(rows.length,Object.keys(metadata.sprites).length);assert.ok(rows.length>0);
  for(const row of rows){assert.equal(row.index,row.expectedIndex,row.key+' source indices');assert.equal(row.rgba,row.expectedRgba,row.key+' native RGBA')}
  console.log(rows.length+' real browser sprite rectangles preserve indices/native RGBA and consume independent remap/reset states through cached Canvas surfaces; no source SFF endpoint');
 }finally{await browser?.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
