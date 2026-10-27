import {nativeConstantNames} from './native-constant-names.js';

export function customConstant(name,constants={}){
 const key=String(name).toLowerCase();
 if(nativeConstantNames.has(key))return {handled:false};
 return {handled:true,value:Math.fround(Object.hasOwn(constants,key)?Number(constants[key]):0)};
}
