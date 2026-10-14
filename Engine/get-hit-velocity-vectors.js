import {hitDefVelocityDefaults} from './hitdef-velocity-defaults.js';

export function getHitVelocityVectors(params,recipientRatio=1,hitFacing=1){
 const vectors=hitDefVelocityDefaults(params),result={},ratio=Math.fround(recipientRatio);
 for(const name of ['ground','air','down','guard','airguard'])for(const [index,axis] of ['x','y','z'].entries()){
  const value=Math.fround(Math.fround(vectors[name][index])*ratio);
  result[name+'.velocity.'+axis]=axis==='x'?Math.fround(value*-hitFacing):value;
 }
 return result;
}
