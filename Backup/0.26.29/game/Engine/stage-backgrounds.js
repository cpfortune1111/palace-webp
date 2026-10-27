import {createPalFxRuntime,stepPalFx,samplePalFx} from './palfx-runtime.js';
import {stackPalFx} from './palfx-stack.js';

export function createStageBackgroundRegistry(){
 const entries=[];
 return {
  entries,
  replace(backgrounds){entries.splice(0,entries.length,...backgrounds.map(background=>({...background,id:Math.trunc(Number(background.id??0))|0,palFx:background.palFx||createPalFxRuntime(undefined,{allowNegative:false})})))},
  setPalette(background,definition){Object.assign(background.palFx,createPalFxRuntime(definition,{allowNegative:false}))},
  tick({paused=false}={}){if(!paused)for(const background of entries)stepPalFx(background.palFx)},
  effect(background,globalBackground,globalPalette,state={type:'none',alpha:[255,0]}){
   const own=background.palFx.enabled?samplePalFx(background.palFx):null;
   return stackPalFx(stackPalFx(own,globalBackground,state.type,state.alpha),globalPalette,state.type,state.alpha);
  },
  drawLayer(layer,draw){for(const background of entries)if((background.layer??0)===layer&&background.visible!==false)draw(background)},
 };
}