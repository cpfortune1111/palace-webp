const defaults={default:['default',255,0],none:['none',255,0],add:['add',255,255],add1:['add',255,128],addalpha:['add',255,0],sub:['sub',255,255],subadd:['subadd',255,255]};

export function compileTransParameters(params,{strict=true,mugen=false,split=value=>String(value).split(',')}={}){
 const invalid=message=>{if(strict)throw Error(message);return null};
 if(params.trans===undefined)return params.alpha===undefined?null:invalid('alpha defined without trans type');
 const type=String(params.trans).trim().toLowerCase();
 if(!type)return invalid('trans type not specified');
 const entry=defaults[type];if(!entry)return invalid('Invalid trans type: '+type);
 let alpha=[entry[1],entry[2]];
 if(params.alpha!==undefined){if(!String(params.alpha).trim()){if(strict)throw Error('alpha not specified')}else{const values=split(params.alpha);for(let axis=0;axis<2;axis++)if(values[axis]!==undefined)alpha[axis]=values[axis]}}
 if(mugen&&entry[0]==='sub')alpha=[entry[1],entry[2]];
 return {type:entry[0],alpha};
}

export function applyTransController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='trans')return false;
 const params=controller.params||{},compiled=compileTransParameters(params,api.compilerOptions);
 const owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner||!compiled)return true;
 const alpha=compiled.alpha.map(value=>Math.max(0,Math.min(255,Math.trunc(Number(api.evaluate(value)))|0)));
 api.set(owner,{type:compiled.type,alpha});
 return true;
}