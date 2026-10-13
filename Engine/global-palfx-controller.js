import {evaluatePalFxDefinition} from './palfx-controller.js';

export function applyAllPalFxController(controller,api){
 if(String(controller.type).toLowerCase()!=='allpalfx')return false;
 const definition=evaluatePalFxDefinition(controller.params||{},api.evaluate,api.compilerOptions);
 definition.invertblend=Math.max(0,Math.min(1,definition.invertblend));
 api.set(definition);
 return true;
}

export function selectPalFxBackgrounds(backgrounds,id,index){
 const matches=backgrounds.filter(background=>id<0||background.id===id);
 return index<0?matches:matches[index]?[matches[index]]:[];
}

export function applyBgPalFxController(controller,api){
 if(String(controller.type).toLowerCase()!=='bgpalfx')return false;
 const params=controller.params||{},integer=value=>Math.trunc(Number(api.evaluate(value)))|0;
 const id=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index);
 const definition=evaluatePalFxDefinition(params,api.evaluate,api.compilerOptions);definition.invertblend=-3;
 if(id<0&&index<0)api.setGlobal(definition);
 else for(const background of selectPalFxBackgrounds(api.backgrounds(),id,index))api.setBackground(background,{...definition,add:[...definition.add],mul:[...definition.mul],sinadd:[...definition.sinadd],sinmul:[...definition.sinmul],cycleTime:[...definition.cycleTime]});
 return true;
}