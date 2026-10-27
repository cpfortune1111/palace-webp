const paths=await fetch(new URL('../Data/asset-layout.json',import.meta.url)).then(response=>{if(!response.ok)throw Error('Asset layout HTTP '+response.status);return response.json()});

export function assetUrl(value){
 if(/^(?:[a-z]+:|\/\/)/i.test(value))return value;
 const separator=value.search(/[?#]/),name=(separator<0?value:value.slice(0,separator)).replace(/^\.\//,''),suffix=separator<0?'':value.slice(separator);
 return './'+(paths[name]||name)+suffix;
}
