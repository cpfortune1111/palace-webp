export function sizeCollisionBox(constants,state,{width=[0,0],height=[0,0],scale=1}={}){
 const read=(key,fallback)=>Math.fround(Number(constants['size.'+key]??fallback));
 const stand=[-read('ground.back',16),-read('height',60),read('ground.front',16),0],air=[-read('air.back',12),stand[1],read('air.front',12),stand[3]];
 const prefix=({C:'crouch',A:'air',L:'down'})[state]||'stand',base=prefix==='air'?air:[...stand];
 const explicit=constants['size.'+prefix+'.sizebox'];
 if(explicit!==undefined){const values=Array.isArray(explicit)?explicit:String(explicit).split(',');for(let index=0;index<Math.min(4,values.length);index++)base[index]=Math.fround(Number(values[index]))}
 let [left,top,right,bottom]=base;
 left=Math.fround(left-width[1]);right=Math.fround(right+width[0]);top=Math.fround(top-height[0]);bottom=Math.fround(bottom+height[1]);
 if(left>right)[left,right]=[right,left];if(top>bottom)[top,bottom]=[bottom,top];
 const result=[left,top,right,bottom].map(value=>Math.fround(value*scale));
 if(!result.every(Number.isFinite))throw Error('Invalid native Size collision geometry');return result;
}
