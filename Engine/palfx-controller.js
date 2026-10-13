export function createPalFxDefinition(){
 return {time:0,color:1,hue:0,add:[0,0,0],mul:[256,256,256],sinadd:[0,0,0],sinmul:[0,0,0],sincolor:0,sinhue:0,cycleTime:[0,0,0,0],invertall:false,invertblend:0};
}

export function evaluatePalFxDefinition(params,evaluate,{split=value=>String(value).split(','),mugen11=false}={}){
 const result=createPalFxDefinition(),integer=value=>Math.trunc(Number(evaluate(value)))|0;
 if(mugen11)result.invertblend=-2;
 if(params.time!==undefined)result.time=integer(params.time);
 for(const [name,scale] of [['color',256],['hue',512]])if(params[name]!==undefined)result[name]=Math.fround(Math.fround(Number(evaluate(params[name])))/scale);
 for(const name of ['add','mul'])if(params[name]!==undefined){const values=split(params[name]);if(values.length<3)throw Error(name+' - not enough arguments');result[name]=values.slice(0,3).map(integer)}
 for(const [cycle,name] of ['sinadd','sinmul','sincolor','sinhue'].entries())if(params[name]!==undefined){
  const values=split(params[name]),count=cycle<2?3:1;if(values.length<(cycle<2?3:2))throw Error(name+' - not enough arguments');
  const negative=values[count]!==undefined&&integer(values[count])<0,side=negative?-1:1;
  result.cycleTime[cycle]=values[count]===undefined?0:((negative?-1:1)*integer(values[count]))|0;
  const amplitudes=values.slice(0,count).map(value=>(integer(value)*side)|0);result[name]=count===1?amplitudes[0]:amplitudes;
 }
 if(params.invertall!==undefined)result.invertall=Number(evaluate(params.invertall))!==0;
 if(params.invertblend!==undefined)result.invertblend=Math.max(-1,Math.min(2,integer(params.invertblend)));
 return result;
}

export function applyPalFxController(controller,caller,api){
 if(String(controller.type).toLowerCase()!=='palfx')return false;
 const params=controller.params||{},owner=params.redirectid===undefined?caller:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
 if(!owner||!api.ownsPalette(owner))return true;
 api.set(owner,evaluatePalFxDefinition(params,api.evaluate,api.compilerOptions));
 return true;
}