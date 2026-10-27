const float=Math.fround;

export function makeDustPosition(actor,position,unit,offset=[0,0]){
 const relative=position.map(value=>float(value*unit)),facing=actor.facing;
 return {x:float(float(actor.x+float(relative[0]*facing))+offset[0]),y:float(float(actor.y+relative[1])+offset[1]),z:float(Number(actor.z??0)+relative[2]),bindOffset:[float(relative[0]+offset[0]*facing),float(relative[1]+offset[1]),relative[2]]};
}

export function projectDustPosition(position,config,{enabled=false,cameraX=0}={}){
 if(!enabled)return {x:position.x,y:position.y,scale:1};
 const top=float(Number(config.topz??0)),bottom=float(Number(config.botz??0));let scale=1;
 if(top!==bottom){const ratio=float(float(position.z-top)/float(bottom-top)),first=float(Number(config.ztopscale??1)),last=float(Number(config.zbotscale??1));scale=Math.max(0,float(first+float(ratio*float(last-first))))}
 return {x:float(float(float(position.x-cameraX)*scale)+cameraX),y:float(float(position.y*scale)+float(position.z*float(Number(config.depthtoscreen??1)))),scale};
}
