export function createSocdInputState(){
 const first=[false,false,false,false];
 function axis(values,offset,method,tieFirst,absoluteFirst){
  const [left,right]=values;
  if(method===1||method===3){
   if(!left)first[offset]=false;
   if(!right)first[offset+1]=false;
   if((left||right)&&!first[offset]&&!first[offset+1]){
    if(left&&(!right||tieFirst))first[offset]=true;
    else first[offset+1]=true;
   }
  }
  if(!left||!right)return [left,right];
  if(method===0)return [true,true];
  if(method===2)return [absoluteFirst,!absoluteFirst];
  if(method===1)return [!first[offset],first[offset]];
  if(method===3)return [first[offset],!first[offset]];
  return [false,false];
 }
 return {
  resolve(input,method){const result={...input};[result.U,result.D]=axis([!!input.U,!!input.D],0,method,false,true);[result.B,result.F]=axis([!!input.B,!!input.F],2,method,true,false);return result},
  reset(){first.fill(false)}
 };
}
