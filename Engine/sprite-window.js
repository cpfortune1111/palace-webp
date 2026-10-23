import {controllerFloat32} from './controller-value-conversion.js';

export function compileSpriteWindow(expression,{split,evaluate,warn=()=>{}}){
 if(expression===undefined)return null;
 const components=split(expression);
 if(components.length>4)throw Error('Explod window expects at most four values');
 if(components.length<4){warn('invalid explod window');return null}
 return components.map(component=>controllerFloat32(evaluate(component)));
}

export function spriteWindowRect(window,{origin,scale,pixelRatio=1}){
 if(!window||window.every(value=>value===0))return null;
 const horizontal=[window[0]*scale[0],window[2]*scale[0]],vertical=[window[1]*scale[1],window[3]*scale[1]];
 const left=Math.min(...horizontal),top=Math.min(...vertical),right=Math.max(...horizontal),bottom=Math.max(...vertical);
 return {x:Math.trunc((origin[0]+left)*pixelRatio)|0,y:Math.trunc((origin[1]+top)*pixelRatio)|0,width:Math.trunc((right-left)*pixelRatio)|0,height:Math.trunc((bottom-top)*pixelRatio)|0};
}

export function clipSpriteWindow(context,rectangle){
 if(!rectangle)return;
 const matrix=context.getTransform();context.setTransform(1,0,0,1,0,0);
 context.beginPath();context.rect(rectangle.x,rectangle.y,rectangle.width,rectangle.height);context.clip();
 context.setTransform(matrix);
}
