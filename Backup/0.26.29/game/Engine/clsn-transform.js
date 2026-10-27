import {controllerInteger} from './controller-value-conversion.js';
import {compileCollisionGroup} from './hitdef-collision-group.js';

export function createClsnTransforms(){return [[],[],[],[]]}

export function applyClsnTransformController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='transformclsn')return false;
 const params=controller.params||{},owner=params.redirectid===undefined?caller:api.findActor(controllerInteger(api.evaluate(params.redirectid)));
 if(!owner)return true;
 const group=params.group===undefined?-1:compileCollisionGroup(params.group),index=params.index===undefined?-1:Math.trunc(Number(api.evaluate(params.index)))|0,ratio=Math.fround(api.localCoord(owner)/api.localCoord(caller));
 const pair=(expression,defaults,factor)=>{const values=expression===undefined?[]:api.split(expression);return defaults.map((fallback,component)=>values[component]===undefined?fallback:Math.fround(Math.fround(Number(api.evaluate(values[component])))*factor))};
 const scale=pair(params.scale,[1,1],1),pivot=pair(params.pivot,[0,0],ratio),angle=params.angle===undefined?0:Math.fround(Number(api.evaluate(params.angle))),slots=api.slots(owner);
 if(group===0){for(const slot of slots)slot.length=0;return true}
 for(const selected of group===-1?[1,2,3,4]:[group])slots[selected-1].push({index,scale:scale.slice(),angle,pivot:pivot.slice()});
 return true;
}

export function transformedClsnBoxes(boxes,transforms,localScale=1){
 const result=boxes.map(rect=>({rect:rect.slice(),angle:0,pivot:[0,0]}));
 for(const transform of transforms){
  const apply=box=>{box.rect=box.rect.map((value,index)=>Math.fround(value*transform.scale[index%2]));box.angle=transform.angle;box.pivot=transform.pivot.map(value=>Math.fround(value*localScale))};
  if(transform.index<0)for(const box of result)apply(box);
  else if(transform.index<result.length)apply(result[transform.index]);
 }
 for(const box of result){const rect=box.rect;box.rect=[Math.min(rect[0],rect[2]),Math.min(rect[1],rect[3]),Math.max(rect[0],rect[2]),Math.max(rect[1],rect[3])]}
 return result;
}
