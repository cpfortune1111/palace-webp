export function characterLocalCoord(data){
 const width=Number(data.coordinateSystem?.localcoord?.[0]??1280);
 if(!Number.isFinite(width)||width<=0)throw Error('Invalid character collision localcoord');
 return width;
}

export function collisionWorldRatio(data){return Math.fround(Number(data.coordinateSystem?.webWorldWidth??1280)/characterLocalCoord(data))}

export function animationCollisionScale(animationOwner,helper,{ownScale=false,sameOwner=true}={}){
 const constants=ownScale&&sameOwner&&helper?helper:animationOwner.constants||animationOwner.sizeConstants||{};
 return [Math.fround(Number(constants['size.xscale']??constants.xscale??1)),Math.fround(Number(constants['size.yscale']??constants.yscale??1))];
}

export function collisionBoxesToWorld(boxes,{worldScale=1,pivotScale=worldScale}={}){
 return boxes.map(box=>({rect:box.rect.map(value=>Math.fround(value*worldScale)),angle:box.angle,pivot:box.pivot.map(value=>Math.fround(value*pivotScale))}));
}

export function scaledAnimationBoxes(boxes,scale){return boxes.map(rect=>rect.map((value,index)=>Math.fround(value*scale[index%2])))}
