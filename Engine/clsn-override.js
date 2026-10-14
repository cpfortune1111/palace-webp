import {compileCollisionGroup} from './hitdef-collision-group.js';

export function createClsnOverrides(){return [[],[],[],[]]}

export function applyClsnOverrideController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='overrideclsn')return false;
 const params=controller.params||{},owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner)return true;
 const group=params.group===undefined?0:compileCollisionGroup(params.group),index=params.index===undefined?0:Math.trunc(Number(api.evaluate(params.index)))|0;
 const ratio=Math.fround(api.localCoord(owner)/api.localCoord(caller)),expressions=params.rect===undefined?[]:api.split(params.rect);
 const rect=[0,0,0,0].map((fallback,component)=>expressions[component]===undefined?fallback:Math.fround(Math.fround(Number(api.evaluate(expressions[component])))*ratio));
 const normalized=[Math.min(rect[0],rect[2]),Math.min(rect[1],rect[3]),Math.max(rect[0],rect[2]),Math.max(rect[1],rect[3])],slots=api.slots(owner);
 if(group===0){for(const slot of slots)slot.length=0;return true}
 const groups=group===-1?[1,2,3,4]:[group];
 for(const selected of groups)slots[selected-1].push({index,rect:normalized.slice()});
 return true;
}

export function overriddenClsnBoxes(boxes,overrides){
 const result=boxes.map(rect=>rect.slice());
 for(const override of overrides){
  const {index,rect}=override;
  if(rect.every(value=>value===0)){if(index<0)result.length=0;else if(index<result.length)result.splice(index,1)}
  else if(index<0){for(let position=0;position<result.length;position++)result[position]=rect.slice()}
  else if(index>=result.length)result.push(rect.slice());
  else result[index]=rect.slice();
 }
 return result;
}
