export function controllerFloat32(value){
 if(typeof value==='string'||value===undefined||Number.isNaN(Number(value)))return 0;
 return Math.fround(Number(value));
}

export function controllerBoolean(value){
 if(typeof value==='string'||value===undefined||Number.isNaN(Number(value)))return false;
 return Number(value)!==0;
}
