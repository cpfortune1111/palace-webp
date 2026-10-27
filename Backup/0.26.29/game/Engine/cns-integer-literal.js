export function parseCnsIntegerLiteral(value,{warn=()=>{}}={}){
 const text=String(value).trim(),negative=text.startsWith('-');
 const digits=text.startsWith('-')||text.startsWith('+')?text.slice(1):text;
 let result=0;
 for(let index=0;index<digits.length;index++){
  const code=digits.charCodeAt(index);
  if(code<48||code>57)break;
  result=result*10+code-48;
  if(result>2147483647){warn('Atoi conversion outside int32 range: '+digits.slice(0,index+1));return negative?-2147483648:2147483647;}
 }
 return negative&&result!==0?-result:result;
}
