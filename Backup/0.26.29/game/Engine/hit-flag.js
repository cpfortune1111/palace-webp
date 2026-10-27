import {guardFlagMask} from './get-hit-guard-flag.js';

export function nativeGuardState(state){
 return state===120||state>=130&&state<=132||state===140||state>=150&&state<=155;
}

export function hitFlagAllows(value,{stateType,hitState,inGuard=false,noFallHitFlag=false}={}){
 if(!Number.isInteger(hitState))throw Error('Missing native hit-state status');
 const mask=guardFlagMask(value??'MAF'),required={S:1,C:2,A:4,L:8}[stateType];
 if(required!==undefined&&!(mask&required))return false;
 if((!(mask&16)||noFallHitFlag)&&hitState>=2)return false;
 if(mask&64&&hitState>0)return false;
 if(mask&128&&(hitState<=0||inGuard))return false;
 return true;
}
