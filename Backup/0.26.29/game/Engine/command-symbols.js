// Symbol grammar at pinned Ikemen cb56d73; file/version policy is separate.
export const commandKeys=Object.freeze(['U','D','B','F','L','R','UB','UF','DB','DF','UL','UR','DL','DR','N','a','b','c','x','y','z','s','d','w','m']);
const directions=new Set(commandKeys.slice(0,15));
const buttons=new Set(commandKeys.slice(15));
// Go strings.TrimSpace follows Unicode White_Space (FEFF is not whitespace).
const trim=value=>value.replace(/^\p{White_Space}+|\p{White_Space}+$/gu,'');
const diagonal=(a,b)=>(a==='U'||a==='D')&&'BFLR'.includes(b||'!');
export function parseCommandSymbols(source,{remap={}}={}){
 if(typeof source!=='string')throw new TypeError('Command symbols must be text');
 const steps=[];let error='';
 if(!trim(source))return {steps,error};
 for(const [index,raw] of source.split(',').entries()){
  const step={keys:[],greater:false,orLogic:false};steps.push(step);
  const text=trim(raw);
  if(index>0&&!text){error='Empty command step found';continue}
  if(text.includes('+')&&text.includes('|')){error="Cannot use both '+' and '|' in the same command step";continue}
  step.orLogic=text.includes('|');
  for(let part of text.split(step.orLogic?'|':'+')){
   part=trim(part);
   if(!part){error="Unexpected '+' with no key";continue}
   let count=0;
   for(let i=0;i<part.length;i++){
    if(diagonal(part[i],part[i+1])){count++;i++}
    else if(directions.has(part[i])||buttons.has(part[i]))count++;
   }
   if(count<1)error='No keys found in command step';
   else if(count>1)error="Multiple keys found without '+' separator";
   let hold=false,release=false,fourway=false,charge=0;
   const advance=()=>{part=trim(part.slice(1))};
   const readCharge=()=>{let n=0;while(/^[0-9]/.test(part)){n=(Math.imul(n,10)+Number(part[0]))|0;advance()}if(n>0)charge=n};
   while(part&&'>~/$'.includes(part[0])){
    const prefix=part[0];advance();
    if(prefix==='>'){if(step.greater)error="Duplicate '>' symbol found";step.greater=true}
    if(prefix==='~'){if(release)error="Duplicate '~' symbol found";release=true;readCharge()}
    if(prefix==='/'){if(hold)error="Duplicate '/' symbol found";hold=true;readCharge()}
    if(prefix==='$'){if(fourway)error="Duplicate '$' symbol found";fourway=true}
   }
   let key=part[0];
   if(directions.has(key)){
    if(diagonal(key,part[1]))key+=part[1];
    step.keys.push({key,hold,release,fourway,charge});
   }else if(buttons.has(key)){
    key=remap[key]??key;
    if(!commandKeys.includes(key))throw new RangeError('Invalid command remap');
    step.keys.push({key,hold,release,fourway:false,charge});
   }else error=`Invalid symbol '${key===undefined?'�':String.fromCodePoint(new TextEncoder().encode(part)[0])}' found`;
  }
 }
 return {steps,error};
}
