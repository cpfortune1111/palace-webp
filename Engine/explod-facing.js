export function explodVerticalFacing(expression,evaluate){
 if(expression===undefined)return 1;
 const sampled=evaluate(expression);
 const value=typeof sampled==='string'||sampled===undefined||Number.isNaN(Number(sampled))?0:Math.trunc(Number(sampled))|0;
 return value<0?-1:1;
}

export function explodDrawingAngle(state,facing,vfacing=1){
 if(!state?.enabled||(facing<0)===(vfacing<0))return state;
 return {...state,value:-state.value,yangle:-state.yangle};
}

export function explodTrueFacing(base,relative=1){return (base<0)!==(relative<0)?-1:1}
