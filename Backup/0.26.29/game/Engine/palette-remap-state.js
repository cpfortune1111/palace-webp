export function createPaletteCatalog(metadata){
 const palettes=[...metadata.palettes].sort((first,second)=>first.index-second.index),names=new Map(),duplicates=new Map();
 for(const [index,palette]of palettes.entries()){
  if(palette.index!==index||!metadata.colorTables[palette.colorTable])throw Error('Invalid palette catalog');
  const physical=palette.remapIndex??index;if(!Number.isInteger(physical)||physical<0||physical>index)throw Error('Invalid physical palette alias');
  names.set((palette.group&65535)+','+(palette.number&65535),physical);
  if(physical!==index){const shared=duplicates.get(physical)??[];shared.push(index);duplicates.set(physical,shared)}
 }
 return {palettes,colorTables:metadata.colorTables,names,duplicates,baseMap:palettes.map(palette=>palette.index)};
}

export function createPaletteRemapState(){return {remap:null,lastDestination:null}}

export function resolvedPaletteIndex(state,catalog,index){return state.remap?.[index]??catalog.baseMap[index]}

export function applyPaletteRemap(state,catalog,source,destination,{warn=()=>{}}={}){
 if(source[0]===-1&&destination[0]===-1){state.remap=null;return true}
 if(destination[0]===-1)destination=source;
 const lookup=pair=>catalog.names.get((pair[0]&65535)+','+(pair[1]&65535));
 if(source[0]===-1){
  if(destination.some(value=>value<0))return false;
  const target=lookup(destination);if(target===undefined)return false;
  const depth=catalog.colorTables[catalog.palettes[target].colorTable].length;
  state.remap=catalog.baseMap.map((index)=>catalog.colorTables[catalog.palettes[index].colorTable].length===depth?target:index);return true;
 }
 if(source.some(value=>value<0)||destination.some(value=>value<0))return false;
 const from=lookup(source),to=lookup(destination);
 if(from===undefined){warn('has no source palette for RemapPal: '+source.join(','));return false}
 if(to===undefined){warn('has no dest palette for RemapPal: '+destination.join(','));return false}
 const sourcePalette=catalog.palettes[from],destinationPalette=catalog.palettes[to];
 if(catalog.colorTables[sourcePalette.colorTable].length!==catalog.colorTables[destinationPalette.colorTable].length){warn('RemapPal color depth mismatch');return false}
 state.remap??=[...catalog.baseMap];
 if(state.remap.length===catalog.baseMap.length){state.remap[from]=to;for(const index of catalog.duplicates.get(from)??[])state.remap[index]=to}
 state.lastDestination=[...destination];return true;
}
