const cachedTypes=new WeakMap();
const variables={var:'int',sysvar:'int',fvar:'float',sysfvar:'float'};
const comparisons=new Set(['=','==','!=','>','<','>=','<=']);
const arithmetic=new Set(['+','-','*','/','%','**']);
const bitwise=new Set(['&','|','^']);
const integerQueries=new Set(['ailevel','movecountered','time','stateno','life','lifemax','anim','animtime','facing','backedgebodydist','backedgedist','frontedgebodydist','frontedgedist','gametime','hitcount','hitpausetime','id','movecontact','moveguarded','movehit','movereversed','numenemy','numpartner','numproj','power','powermax','prevstateno','random','roundstate','teamside','uniqhitcount']);
const booleanQueries=new Set(['dizzy','guardbreak','alive','canrecover','ctrl','hitfall','hitover','hitshakeover','inguarddist']);
const floatQueries=new Set(['ailevelf','pos x','pos y','vel x','vel y','vel z','angle','xangle','yangle']);
const unaryMath=new Set(['abs','floor','ceil','ln','sin','cos','tan','asin','acos','atan','exp','sign','rad','deg']);
const multiMath={log:2,max:2,min:2,round:2,atan2:2,clamp:3,lerp:3};
const intrinsicCalls={projclsnoverlap:{type:'bool',min:3,max:3},clsnoverlap:{type:'bool',min:3,max:3},projcanceltime:{type:'int',min:1,max:1},projcontacttime:{type:'int',min:1,max:1},projhittime:{type:'int',min:1,max:1},projguardedtime:{type:'int',min:1,max:1},numhelper:{type:'int',min:0,max:1},numprojid:{type:'int',min:1,max:1},numexplod:{type:'int',min:0,max:1},numtarget:{type:'int',min:0,max:1},animelemtime:{type:'int',min:1,max:1},playeridexist:{type:'bool',min:1,max:1},selfanimexist:{type:'bool',min:1,max:1},isasserted:{type:'bool',min:1,max:1}};

export function numericQueryType(name){
 const key=name.toLowerCase().replace(/\s+/g,' ');
 if(/^proj(contact|hit|guarded)\d*$/.test(key))return 'bool';
 if(key==='layerno')return 'int';
 return integerQueries.has(key)?'int':booleanQueries.has(key)?'bool':floatQueries.has(key)?'float':null;
}

export function isConstantNumericExpression(node){
 if(node.t==='num')return true;
 if(node.t==='un')return isConstantNumericExpression(node.a);
 if(node.t==='bin')return isConstantNumericExpression(node.a)&&isConstantNumericExpression(node.b);
 if(node.t==='range')return [node.a,node.lower,node.upper].every(isConstantNumericExpression);
 if(node.t!=='call')return false;
 const name=node.name.toLowerCase();
 if(['ifelse','cond'].includes(name))return node.args.length===3&&node.args.every(isConstantNumericExpression);
 return (unaryMath.has(name)&&node.args.length===1||Object.hasOwn(multiMath,name)&&node.args.length===multiMath[name])&&node.args.every(isConstantNumericExpression);
}

function numericType(node){
 if(!node||typeof node!=='object')return null;
 if(cachedTypes.has(node))return cachedTypes.get(node);
 let type=null;
 if(node.t==='num')type=node.numericType??(Number.isInteger(node.v)?'int':'float');
 else if(node.t==='range'&&[node.a,node.lower,node.upper].every(argument=>numericType(argument)))type='bool';
 else if(['redirect','helperRedirect','indexedRedirect'].includes(node.t)&&numericType(node.expr))type='dynamic';
 else if(node.t==='id')type=numericQueryType(node.name);
 else if(node.t==='call'&&node.name.toLowerCase()==='map'&&node.args.length===1&&node.args[0].t==='str')type='dynamic';
 else if(node.t==='call'&&node.name.toLowerCase()==='randomrange'&&node.args.length===2&&node.args.every(argument=>numericType(argument)))type='int';
 else if(node.t==='call'&&Object.hasOwn(intrinsicCalls,node.name.toLowerCase())){
  const contract=intrinsicCalls[node.name.toLowerCase()];
  if(node.args.length>=contract.min&&node.args.length<=contract.max)type=contract.type;
 }
 else if(node.t==='call'&&node.args.length===1&&Object.hasOwn(variables,node.name.toLowerCase()))type=variables[node.name.toLowerCase()];
 else if(node.t==='call'&&node.args.length===1&&unaryMath.has(node.name.toLowerCase())&&numericType(node.args[0]))type=['abs','floor','ceil'].includes(node.name.toLowerCase())?'dynamic':node.name.toLowerCase()==='sign'?'int':'float';
 else if(node.t==='call'&&Object.hasOwn(multiMath,node.name.toLowerCase())&&node.args.length===multiMath[node.name.toLowerCase()]&&node.args.every(argument=>numericType(argument)))type='float';
 else if(node.t==='assign'&&node.target.t==='call')type=node.target.name.toLowerCase()==='map'?'dynamic':variables[node.target.name.toLowerCase()]??null;
 else if(node.t==='call'&&['ifelse','cond'].includes(node.name.toLowerCase())&&node.args.length===3&&numericType(node.args[1])&&numericType(node.args[2]))type='dynamic';
 else if(node.t==='un'&&numericType(node.a))type=node.op==='!'?'bool':node.op==='~'?'int':numericType(node.a);
 else if(node.t==='bin'&&node.op==='^^')type='bool';
 else if(node.t==='bin'&&comparisons.has(node.op))type='bool';
 else if(node.t==='bin'){
  const first=numericType(node.a),second=numericType(node.b);
  if(first&&second){
   if(comparisons.has(node.op))type='bool';
   else if(bitwise.has(node.op))type='int';
   else if(node.op==='**')type='dynamic';
   else if(node.op==='&&'||node.op==='||')type=isConstantNumericExpression(node)?'bool':'dynamic';
   else if(arithmetic.has(node.op))type=node.op==='%'?'int':first==='dynamic'||second==='dynamic'?'dynamic':first==='float'||second==='float'?'float':'int';
  }
 }
 cachedTypes.set(node,type);
 return type;
}

export function evaluateTypedNumericAST(node,api){
 if(!numericType(node))return {handled:false};
 const integer=value=>Math.trunc(Number(value))|0;
 const numeric=operand=>operand.type==='string'?0:Number(operand.value);
 const truth=operand=>operand.type!=='string'&&!!operand.value;
 function evaluate(current){
  const type=numericType(current);
  if(current.t==='range'){
   const operands=[current.a,current.lower,current.upper].map(evaluate);
   if(operands.some(operand=>Number.isNaN(operand.value))&&(!api.logicalOperands||!isConstantNumericExpression(current)))return {type:'bool',value:NaN};
   const floating=operands.some(operand=>operand.type==='float'&&!Number.isNaN(operand.value));
   const [value,lower,upper]=operands.map(operand=>Number.isNaN(operand.value)?0:floating?Math.fround(numeric(operand)):integer(numeric(operand)));
   const inside=(current.includeLower?value>=lower:value>lower)&&(current.includeUpper?value<=upper:value<upper);
   return {type:'bool',value:current.op==='!='?!inside:inside};
  }
  if(['redirect','helperRedirect','indexedRedirect'].includes(current.t))return api.redirected(current);
  if(current.t==='num')return {type,value:type==='float'?Math.fround(current.v):integer(Math.max(-2147483648,Math.min(2147483647,current.v)))};
  if(current.t==='id'){
   const sample=api.querySample?.(current.name),resultType=sample?.type??type,value=Number(sample?sample.value:api.query(current.name));
   return {type:resultType,value:Number.isNaN(value)?NaN:resultType==='bool'?!!value:resultType==='float'?Math.fround(value):integer(value)};
  }
  if(current.t==='assign')return current.target.name.toLowerCase()==='map'?api.mapAssignment(current.target,current.value):{type,value:api.assign(current.target,current.value)};
  if(current.t==='call'){
   if(['ifelse','cond'].includes(current.name.toLowerCase()))return api.conditional(current);
   const name=current.name.toLowerCase();
   if(name==='map')return api.mapValue(current);
   if(name==='randomrange'){
    const args=api.mathArguments?api.mathArguments(current):current.args.map(evaluate);
    if(args.some(argument=>Number.isNaN(argument.value)))return {type:'int',value:NaN};
    return {type:'int',value:api.randomInteger(...args.map(argument=>integer(numeric(argument))))};
   }
   if(Object.hasOwn(intrinsicCalls,name)){
    const value=Number(api.intrinsicCall(current));
    return {type,value:Number.isNaN(value)?NaN:type==='bool'?!!value:integer(value)};
   }
   if(Object.hasOwn(multiMath,name)){
    const args=api.mathArguments?api.mathArguments(current):current.args.map(evaluate);
    if(args.some(argument=>Number.isNaN(argument.value)))return {type:'float',value:NaN};
    const [first,second,third]=args.map(numeric);
    let value;
    if(name==='log')value=first<=0||second<=0?NaN:Math.log(second)/Math.log(first);
    else if(name==='max')value=Math.max(first,second);
    else if(name==='min')value=Math.min(first,second);
    else if(name==='atan2')value=Math.atan2(first,second);
    else if(name==='round'){const shift=Math.pow(10,second);value=Math.floor(first*shift+.5)/shift;}
    else if(name==='clamp')value=first<=second?second:first>=third?third:first;
    else value=first+(second-first)*Math.min(1,Math.max(0,third));
    return {type:'float',value:Math.fround(value)};
   }
   if(unaryMath.has(name)){
    let argument=api.mathArguments?api.mathArguments(current)[0]:evaluate(current.args[0]);
    if(argument.type==='string')argument={type:'int',value:0};
    if(Number.isNaN(argument.value))return {type:argument.type,value:NaN};
    if(name==='abs')return {type:argument.type,value:argument.type==='float'?Math.fround(Math.abs(argument.value)):integer(Math.abs(argument.value))};
    if(name==='floor'||name==='ceil')return argument.type==='float'?{type:'int',value:integer(Math[name](argument.value))}:argument;
    if(name==='ln')return {type:'float',value:argument.value<=0?NaN:Math.fround(Math.log(argument.value))};
    if(name==='sign')return {type:'int',value:argument.value<0?-1:argument.value>0?1:0};
    if(name==='rad')return {type:'float',value:Math.fround(argument.value*Math.PI/180)};
    if(name==='deg')return {type:'float',value:Math.fround(argument.value*180/Math.PI)};
    return {type:'float',value:Math.fround(Math[name](argument.value))};
   }
   const value=api.variable(current.name.toLowerCase(),current.args[0]);
   return {type,value:Number.isNaN(Number(value))?NaN:type==='float'?Math.fround(Number(value)):integer(value)};
  }
  if(current.t==='un'){
   const result=evaluate(current.a);
   if(Number.isNaN(result.value)){
    if(current.op==='!')return {type:'bool',value:api.logicalOperands?NaN:true};
    if(!api.logicalOperands||current.op==='+')return {type:result.type,value:NaN};
    return {type:'int',value:current.op==='~'?-1:0};
   }
   if(current.op==='!')return {type:'bool',value:!truth(result)};
   if(current.op==='~')return {type:'int',value:!api.logicalOperands&&(result.type==='float'||Number.isNaN(result.value))?NaN:~integer(numeric(result))};
   if(current.op==='+')return result;
   return {type:result.type==='string'?'int':result.type,value:result.type==='float'?Math.fround(-numeric(result)):integer(-numeric(result))};
  }
  if(current.op==='^^')return {type:'bool',value:api.logicalXor(current)};
  if(comparisons.has(current.op)&&(!numericType(current.a)||!numericType(current.b)))return {type:'bool',value:api.comparison(current)};
  const first=evaluate(current.a);
  if(current.op==='&&'||current.op==='||'){
   if(!api.logicalOperands&&Number.isNaN(first.value))return {type:'bool',value:NaN};
   const selected=current.op==='&&'?(truth(first)?evaluate(current.b):first):(truth(first)?first:evaluate(current.b));
   if(!api.logicalOperands&&Number.isNaN(selected.value))return {type:'bool',value:NaN};
   return api.logicalOperands&&!isConstantNumericExpression(current)?selected:{type:'bool',value:truth(selected)};
  }
  const second=evaluate(current.b);
  if(['=','==','!='].includes(current.op)&&(first.type==='string'||second.type==='string')){
   const equal=first.type==='string'&&second.type==='string'&&first.value.toLowerCase()===second.value.toLowerCase();
   return {type:'bool',value:current.op==='!='?!equal:equal};
  }
  if(!api.logicalOperands&&(Number.isNaN(first.value)||Number.isNaN(second.value)))return {type,value:NaN};
  const floating=first.type==='float'&&!Number.isNaN(first.value)||second.type==='float'&&!Number.isNaN(second.value);
  if(bitwise.has(current.op)){
   if(!api.logicalOperands&&(floating||Number.isNaN(first.value)||Number.isNaN(second.value)))return {type:'int',value:NaN};
   const left=integer(numeric(first)),right=integer(numeric(second));
   return {type:'int',value:current.op==='&'?left&right:current.op==='|'?left|right:left^right};
  }
  const left=Number.isNaN(first.value)?0:floating?Math.fround(numeric(first)):integer(numeric(first)),right=Number.isNaN(second.value)?0:floating?Math.fround(numeric(second)):integer(numeric(second));
  if(current.op==='='||current.op==='==')return {type:'bool',value:left===right};
  if(current.op==='!=')return {type:'bool',value:left!==right};
  if(current.op==='>')return {type:'bool',value:left>right};
  if(current.op==='<')return {type:'bool',value:left<right};
  if(current.op==='>=')return {type:'bool',value:left>=right};
  if(current.op==='<=')return {type:'bool',value:left<=right};
  if(current.op==='%')return {type:'int',value:!api.logicalOperands&&floating||integer(numeric(second))===0?NaN:integer(integer(numeric(first))%integer(numeric(second)))};
  if(current.op==='**'){
   if(floating||right<0||!api.logicalOperands&&left<0)return {type:'float',value:Math.fround(Math.pow(left,right))};
   let exponent=right,base=left,value=1;
   const multiply=api.logicalOperands?Math.imul:(first,second)=>Math.min(2147483647,first*second);
   while(exponent>0){
    if(exponent%2===1)value=multiply(value,base);
    exponent=Math.floor(exponent/2);
    if(exponent>0)base=multiply(base,base);
   }
   return {type:'int',value};
  }
  const outputType=floating?'float':'int';
  if(current.op==='/')return {type:outputType,value:right===0?NaN:floating?Math.fround(left/right):integer(left/right)};
  if(current.op==='*')return {type:outputType,value:floating?Math.fround(left*right):Math.imul(left,right)};
  if(current.op==='+')return {type:outputType,value:floating?Math.fround(left+right):integer(left+right)};
  return {type:outputType,value:floating?Math.fround(left-right):integer(left-right)};
 }
 return {handled:true,...evaluate(node)};
}
