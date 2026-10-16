const components={
 'width.front':['x',0],'width.back':['x',1],
 'height.top':['y',0],'height.bottom':['y',1],
 'depth.top':['z',0],'depth.bottom':['z',1]
};

export function guardDistanceConstant(name,defaults,{subjectLocalCoord=1280,expressionLocalCoord=subjectLocalCoord}={}){
 const key=String(name).toLowerCase(),match=/^size\.(proj\.)?attack\.dist(?:\.(.+))?$/.exec(key);
 if(!match)return {handled:false};
 const component=components[match[2]??'width.front'];
 if(!component)return {handled:false};
 if(!(subjectLocalCoord>0&&expressionLocalCoord>0&&Number.isFinite(subjectLocalCoord)&&Number.isFinite(expressionLocalCoord)))throw Error('Invalid guard-distance constant coordinates');
 const ratio=Math.fround(Math.fround(320/subjectLocalCoord)/Math.fround(320/expressionLocalCoord));
 const value=defaults[match[1]?'projectile':'normal'][component[0]][component[1]];
 return {handled:true,value:Math.fround(Math.fround(value)*ratio)};
}
