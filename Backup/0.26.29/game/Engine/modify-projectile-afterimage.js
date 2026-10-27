import {controllerInteger} from './controller-value-conversion.js';
import {nativeAfterImageFields,deferredExplodAfterImageWrites,finishExplodAfterImage} from './native-afterimage.js';

// Partial ModifyProjectile consumer. Other parameter families remain explicit errors.
export function applyModifyProjectileAfterImage(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='modifyprojectile')return false;
 const params=controller.params??{};
 for(const name of Object.keys(params))if(!['redirectid','id','index','projid','persistent','ignorehitpause'].includes(name)&&!nativeAfterImageFields.some(field=>name==='afterimage.'+field))throw Error('Unsupported ModifyProjectile parameter: '+name);
 const integer=value=>controllerInteger(api.evaluate(value)),owner=params.redirectid===undefined?caller:api.findActor(integer(params.redirectid));if(!owner)return true;
 // Native compiler orders ID before index (unlike ModifyExplod).
 const id=params.id===undefined?-1:integer(params.id),index=params.index===undefined?-1:integer(params.index);
 if(owner.kind==='helper')return true;
 if(params.projid===undefined&&!nativeAfterImageFields.some(field=>params['afterimage.'+field]!==undefined))return true;
 const selected=api.select(owner,id,index);if(!selected.length)return true;
 if(params.projid!==undefined){const value=integer(params.projid);for(const projectile of selected){projectile.id=value;projectile.projectileId=value}}
 for(const write of deferredExplodAfterImageWrites(params,{...api,ikemen:api.ikemen(caller)}))for(const projectile of selected)write(projectile);
 for(const projectile of selected)finishExplodAfterImage(projectile,{ikemen:api.ikemen(owner)});return true;
}
