// Pinned Ikemen input counter/State/StateCharge semantics. Hardware/SOCD is upstream.
const axes=['U','D','B','F','L','R'];
const buttons=['a','b','c','x','y','z','s','d','w','m'];
const stored=[...axes,'N',...buttons];
const neg=n=>(-n)|0,abs=n=>n<0?neg(n):n;
function direction(key){
 const parts=key.split('');
 const group=/[LR]/.test(key)?['U','D','L','R']:['U','D','B','F'];
 return {parts,group,conflicts:group.filter(axis=>!parts.includes(axis))};
}
export class CommandInputBuffer{
 constructor(){this.current=Object.fromEntries(stored.map(key=>[key,0]));this.previous={...this.current}}
 update(held){
  this.previous={...this.current};
  for(const key of stored){
   const on=key==='N'?!axes.some(axis=>held[axis]):!!held[key],value=this.current[key];
   this.current[key]=on!==(value>0)?(on?1:-1):(value+(on?1:-1))|0;
  }
 }
 updatePhysical(held,facing=1){
  this.update({...held,B:facing<0?held.R:held.L,F:facing<0?held.L:held.R});
 }
 state({key,release=false,fourway=false}){
  const c=this.current,p=this.previous;
  if(buttons.includes(key))return release?((c[key]<0||p[key]>0)?neg(c[key]):0):c[key];
  if(key==='N')return fourway?Math.min(...['U','D','B','F',...buttons.slice(0,9)].map(axis=>abs(c[axis]))):release?neg(c.N):c.N;
  const {parts,group,conflicts}=direction(key);
  if(!parts.every(axis=>axes.includes(axis)))return 0;
  const intended=Math.min(...parts.map(axis=>c[axis]));
  if(!release){
   if(fourway)return parts.every(axis=>c[axis]>0)?Math.min(...group.map(axis=>abs(c[axis]))):0;
   return Math.min(intended,neg(Math.max(...conflicts.map(axis=>c[axis]))));
  }
  if(!parts.every(axis=>c[axis]<0||p[axis]>0))return 0;
  if(!fourway)return neg(Math.min(intended,neg(Math.max(...conflicts.map(axis=>c[axis])))));
  if(parts.some(axis=>c[axis]<0))return neg(intended);
  // Preserve the pinned reference's UR/DR dollar-release conflict choice.
  const compatible=key==='UR'?['D','R']:key==='DR'?['U','R']:conflicts;
  return Math.min(...compatible.map(axis=>abs(c[axis])));
 }
 charge({key,release=false,fourway=false}){
  const c=this.current,p=this.previous,source=release?p:c;
  if(buttons.includes(key))return source[key];
  if(key==='N')return fourway?0:source.N;
  const {parts,conflicts}=direction(key);
  if(!parts.every(axis=>axes.includes(axis)))return 0;
  const intended=Math.min(...parts.map(axis=>source[axis]));
  if(fourway)return intended;
  const other=conflicts.map(axis=>release&&c[axis]===1?-2147483648:c[axis]);
  return Math.max(0,Math.min(intended,neg(Math.max(...other))));
 }
}
