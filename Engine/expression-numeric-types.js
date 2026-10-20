const cachedTypes=new WeakMap();
const variables={var:'int',sysvar:'int',fvar:'float',sysfvar:'float'};
const comparisons=new Set(['=','==','!=','>','<','>=','<=']);
const arithmetic=new Set(['+','-','*','/','%']);
const bitwise=new Set(['&','|','^']);
const integerQueries=new Set(['time','stateno','life','lifemax']);
const floatQueries=new Set(['pos x','pos y','vel x','vel y','vel z']);

export function isConstantNumericExpression(node){
 if(node.t==='num')return true;
 if(node.t==='un')return isConstantNumericExpression(node.a);
 if(node.t==='bin')return isConstantNumericExpression(node.a)&&isConstantNumericExpression(node.b);
 if(node.t==='range')return [node.a,node.lower,node.upper].every(isConstantNumericExpression);
 if(node.t!=='call')return false;
 const name=node.name.toLowerCase();
 if(['ifelse','cond'].includes(name))return node.args.length===3&&node.args.every(isConstantNumericExpression);
 return ['abs','floor','ln','sin','cos','tan','asin','acos','atan','exp'].includes(name)&&node.args.length===1&&node.args.every(isConstantNumericExpression);
}

function numericType(node){
 if(!node||typeof node!=='object')return null;
 if(cachedTypes.has(node))return cachedTypes.get(node);
 let type=null;
 if(node.t==='num')type=node.numericType??(Number.isInteger(node.v)?'int':'float');
 else if(node.t==='id')type=integerQueries.has(node.name.toLowerCase())?'int':floatQueries.has(node.name.toLowerCase())?'float':null;
 else if(node.t==='call'&&node.args.length===1&&Object.hasOwn(variables,node.name.toLowerCase()))type=variables[node.name.toLowerCase()];
 else if(node.t==='assign'&&node.target.t==='call')type=variables[node.target.name.toLowerCase()]??null;
 else if(node.t==='call'&&['ifelse','cond'].includes(node.name.toLowerCase())&&node.args.length===3&&numericType(node.args[1])&&numericType(node.args[2]))type='dynamic';
 else if(node.t==='un'&&numericType(node.a))type=node.op==='!'?'bool':node.op==='~'?'int':numericType(node.a);
 else if(node.t==='bin'&&node.op==='^^')type='bool';
 else if(node.t==='bin'){
  const first=numericType(node.a),second=numericType(node.b);
  if(first&&second){
   if(comparisons.has(node.op))type='bool';
   else if(bitwise.has(node.op))type='int';
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
 function evaluate(current){
  const type=numericType(current);
  if(current.t==='num')return {type,value:type==='float'?Math.fround(current.v):integer(Math.max(-2147483648,Math.min(2147483647,current.v)))};
  if(current.t==='id'){
   const value=Number(api.query(current.name));
   return {type,value:Number.isNaN(value)?NaN:type==='float'?Math.fround(value):integer(value)};
  }
  if(current.t==='assign')return {type,value:api.assign(current.target,current.value)};
  if(current.t==='call'){
   if(['ifelse','cond'].includes(current.name.toLowerCase()))return api.conditional(current);
   const value=api.variable(current.name.toLowerCase(),current.args[0]);
   return {type,value:type==='float'?Math.fround(Number(value)):integer(value)};
  }
  if(current.t==='un'){
   const result=evaluate(current.a);
   if(Number.isNaN(result.value)){
    if(current.op==='!')return {type:'bool',value:api.logicalOperands?NaN:true};
    if(!api.logicalOperands||current.op==='+')return {type:result.type,value:NaN};
    return {type:'int',value:current.op==='~'?-1:0};
   }
   if(current.op==='!')return {type:'bool',value:!result.value};
   if(current.op==='~')return {type:'int',value:!api.logicalOperands&&(result.type==='float'||Number.isNaN(result.value))?NaN:~integer(result.value)};
   if(current.op==='+')return result;
   return {type:result.type,value:result.type==='float'?Math.fround(-Number(result.value)):integer(-Number(result.value))};
  }
  if(current.op==='^^')return {type:'bool',value:api.logicalXor(current)};
  const first=evaluate(current.a);
  if(current.op==='&&'||current.op==='||'){
   const selected=current.op==='&&'?(first.value?evaluate(current.b):first):(first.value?first:evaluate(current.b));
   return api.logicalOperands&&!isConstantNumericExpression(current)?selected:{type:'bool',value:!!selected.value};
  }
  const second=evaluate(current.b);
  if(!api.logicalOperands&&(Number.isNaN(first.value)||Number.isNaN(second.value)))return {type,value:NaN};
  const floating=first.type==='float'&&!Number.isNaN(first.value)||second.type==='float'&&!Number.isNaN(second.value);
  if(bitwise.has(current.op)){
   if(!api.logicalOperands&&(floating||Number.isNaN(first.value)||Number.isNaN(second.value)))return {type:'int',value:NaN};
   const left=integer(first.value),right=integer(second.value);
   return {type:'int',value:current.op==='&'?left&right:current.op==='|'?left|right:left^right};
  }
  const left=Number.isNaN(first.value)?0:floating?Math.fround(Number(first.value)):integer(first.value),right=Number.isNaN(second.value)?0:floating?Math.fround(Number(second.value)):integer(second.value);
  if(current.op==='='||current.op==='==')return {type:'bool',value:left===right};
  if(current.op==='!=')return {type:'bool',value:left!==right};
  if(current.op==='>')return {type:'bool',value:left>right};
  if(current.op==='<')return {type:'bool',value:left<right};
  if(current.op==='>=')return {type:'bool',value:left>=right};
  if(current.op==='<=')return {type:'bool',value:left<=right};
  if(current.op==='%')return {type:'int',value:!api.logicalOperands&&floating||integer(second.value)===0?NaN:integer(integer(first.value)%integer(second.value))};
  const outputType=floating?'float':'int';
  if(current.op==='/')return {type:outputType,value:right===0?NaN:floating?Math.fround(left/right):integer(left/right)};
  if(current.op==='*')return {type:outputType,value:floating?Math.fround(left*right):Math.imul(left,right)};
  if(current.op==='+')return {type:outputType,value:floating?Math.fround(left+right):integer(left+right)};
  return {type:outputType,value:floating?Math.fround(left-right):integer(left-right)};
 }
 return {handled:true,...evaluate(node)};
}
