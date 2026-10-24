export function controllerInteger(value){
 if(typeof value==='string'||value===undefined||Number.isNaN(Number(value)))return 0;
 return Math.trunc(Number(value))|0;
}

export function controllerFloat32(value){
 if(typeof value==='string'||value===undefined||Number.isNaN(Number(value)))return 0;
 return Math.fround(Number(value));
}

export function controllerBoolean(value){
 if(typeof value==='string'||value===undefined||Number.isNaN(Number(value)))return false;
 return Number(value)!==0;
}

export function controllerInteger64(value){
 if(typeof value==='string'||value===undefined||Number.isNaN(Number(value)))return 0;
 const number=Number(value),limit=2**63;if(!Number.isFinite(number)||number>=limit||number<-limit)return -limit;
 const integer=Math.trunc(number);return integer===0?0:integer;
}
