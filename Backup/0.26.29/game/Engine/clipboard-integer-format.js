import {padClipboardString} from './clipboard-string-format.js';

export function formatClipboardInteger(value,{verb='d',flags='',width=0,precision}={}){
 const number=Math.trunc(Number(value))|0;
 if(verb==='c'){
  const code=number<0||number>1114111||number>=55296&&number<=57343?65533:number;
  return padClipboardString(String.fromCodePoint(code),{flags,width});
 }
 if(verb==='U'){
  const unsigned=BigInt.asUintN(64,BigInt(number));
  let result='U+'+unsigned.toString(16).toUpperCase().padStart(Math.max(4,precision??4),'0');
  if(flags.includes('#')&&number>=0&&number<=1114111){const character=String.fromCodePoint(number);if(character===' '||/[\p{L}\p{M}\p{N}\p{P}\p{S}]/u.test(character))result+=" '"+character+"'";}
  return padClipboardString(result,{flags:flags.replace(/0/g,''),width});
 }
 const base=verb==='b'?2:verb==='o'||verb==='O'?8:verb==='x'||verb==='X'?16:10;
 if(precision===0&&number===0)return ' '.repeat(width);
 let digits=Math.abs(number).toString(base);
 const sign=number<0?'-':flags.includes('+')?'+':flags.includes(' ')?' ':'';
 if(precision!==undefined)digits=digits.padStart(precision,'0');
 else if(flags.includes('0')&&!flags.includes('-'))digits=digits.padStart(Math.max(0,width-sign.length),'0');
 if(verb==='X')digits=digits.toUpperCase();
 let prefix='';
 if(flags.includes('#'))prefix=base===2?'0b':base===16?(verb==='X'?'0X':'0x'):base===8&&!digits.startsWith('0')?'0':'';
 if(verb==='O')prefix='0o'+prefix;
 return padClipboardString(sign+prefix+digits,{flags:flags.replace(/0/g,''),width});
}
