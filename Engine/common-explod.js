import {nativeDataPrefix} from './native-data-prefix.js';
import {compileAnimationReference} from './animation-reference.js';
import {controllerFloat32,controllerInteger,controllerBoolean} from './controller-value-conversion.js';
import {sampleExplodRandom} from './explod-random.js';

export function spawnCommonExplod(params,owner,api){
 if(nativeDataPrefix(String(params.anim??'').trim()).prefix!=='f')return false;
 if(/^f\d+$/i.test(String(params.anim))&&api.legacyRound(Number(String(params.anim).slice(1))))return false;
 const allowed=['anim','id','pos','random','vel','velocity','accel','scale','postype','bindtime','removetime','ignorehitpause','persistent','sprpriority','ontop','under','layerno','ownpal','remappal','facing','vfacing','window','angle','xangle','yangle','xshear','syncid','synclayer','syncparams','removeongethit','supermovetime','pausemovetime'];
 for(const name of Object.keys(params))if(!allowed.includes(name))throw Error('Unsupported common Explod parameter: '+name);
 const reference=compileAnimationReference(params.anim,api),position=[0,0,0];
 if(params.pos!==undefined){const parts=api.split(params.pos);if(!parts.length||parts.length>3)throw Error('Invalid common Explod pos');for(const [index,expression] of parts.entries())position[index]=controllerFloat32(api.evaluate(expression))}
 const spread=sampleExplodRandom(params.random,api);for(let index=0;index<3;index++)position[index]=Math.fround(position[index]+spread[index]);
 const pair=(expression,fallback)=>{const values=expression===undefined?fallback:api.split(expression).map(value=>controllerFloat32(api.evaluate(value)));if(values.length>2)throw Error('Unsupported common Explod vector dimension');return [values[0]??fallback[0],values[1]??fallback[1]]},velocity=pair(params.vel??params.velocity,[0,0]),accel=pair(params.accel,[0,0]),scale=pair(params.scale,[1,1]),integer=(name,fallback)=>params[name]===undefined?fallback:controllerInteger(api.evaluate(params[name]));
 const side=String(params.postype??'p1').toLowerCase();if(!['p1','left','right'].includes(side))throw Error('Unsupported common Explod postype '+side);
 const screen=side!=='p1',effect={common:true,gameCommon:true,anim:reference.action,id:integer('id',0),player:api.player,ownerKey:owner.key||'root'+api.player,depth:true,x:(screen?0:owner.x)+position[0]*(screen?1:owner.facing),y:(screen?0:owner.y)+position[1],z:Number(owner.z??0)+position[2],vx:velocity[0]*owner.facing,vy:velocity[1],accel,scale,facing:screen?1:owner.facing,screen,screenRight:side==='right',age:0,bindOffset:position,bindtime:integer('bindtime',1),removetime:integer('removetime',-2),ignorehitpause:params.ignorehitpause===undefined?1:Number(controllerBoolean(api.evaluate(params.ignorehitpause))),sprpriority:integer('sprpriority',0),removeongethit:integer('removeongethit',0),supermovetime:integer('supermovetime',0),pausemovetime:integer('pausemovetime',0)};
 if(api.hasAnimation(reference.action))api.commit(effect);
 return true;
}
