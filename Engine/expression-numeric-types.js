const cachedTypes=new WeakMap();
const variables={var:'int',sysvar:'int',fvar:'float',sysfvar:'float'};
const comparisons=new Set(['=','==','!=','>','<','>=','<=']);
const arithmetic=new Set(['+','-','*','/','%']);

function numericType(node){
 if(!node||typeof node!=='object')return null;
 if(cachedTypes.has(node))return cachedTypes.get(node);
 let type=null;
 if(node.t==='num')type=node.numericType??(Number.isInteger(node.v)?'int':'float');
 else if(node.t==='call'&&node.args.length===1&&Object.hasOwn(variables,node.name.toLowerCase()))type=variables[node.name.toLowerCase()];
 else if(node.t==='un'&&numericType(node.a))type=node.op==='!'?'bool':numericType(node.a);
 else if(node.t==='bin'){
  const first=numericType(node.a),second=numericType(node.b);
  if(first&&second){
   if(comparisons.has(node.op)||node.op==='&&'||node.op==='||')type='bool';
   else if(arithmetic.has(node.op))type=node.op==='%'?'int':first==='float'||second==='float'?'float':'int';
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
  if(current.t==='num')return type==='float'?Math.fround(current.v):integer(Math.max(-2147483648,Math.min(2147483647,current.v)));
  if(current.t==='call'){
   const value=api.variable(current.name.toLowerCase(),current.args[0]);
   return type==='float'?Math.fround(Number(value)):integer(value);
  }
  if(current.t==='un'){
   const value=evaluate(current.a);
   if(current.op==='!')return !value;
   if(current.op==='+')return value;
   return type==='float'?Math.fround(-Number(value)):integer(-Number(value));
  }
  const first=evaluate(current.a);
  if(current.op==='&&')return !!first&&!!evaluate(current.b);
  if(current.op==='||')return !!first||!!evaluate(current.b);
  const second=evaluate(current.b),floating=numericType(current.a)==='float'||numericType(current.b)==='float';
  const left=floating?Math.fround(Number(first)):integer(first),right=floating?Math.fround(Number(second)):integer(second);
  if(current.op==='='||current.op==='==')return left===right;
  if(current.op==='!=')return left!==right;
  if(current.op==='>')return left>right;
  if(current.op==='<')return left<right;
  if(current.op==='>=')return left>=right;
  if(current.op==='<=')return left<=right;
  if(current.op==='%')return integer(second)===0?NaN:integer(integer(first)%integer(second));
  if(current.op==='/')return right===0?NaN:floating?Math.fround(left/right):integer(left/right);
  if(current.op==='*')return floating?Math.fround(left*right):Math.imul(left,right);
  if(current.op==='+')return floating?Math.fround(left+right):integer(left+right);
  return floating?Math.fround(left-right):integer(left-right);
 }
 return {handled:true,value:evaluate(node),type:numericType(node)};
}
