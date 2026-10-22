import {formatFloat32,shortestFloat32,formatFloat32Base} from './float32-format.js?v=02552';
import {formatClipboardString,quoteClipboardRune,padClipboardString} from './clipboard-string-format.js?v=02552';
import {formatClipboardInteger} from './clipboard-integer-format.js?v=02552';

function decodeText(text){
 if(typeof text!=='string'||!text.startsWith('"')||!text.endsWith('"'))throw Error('Clipboard text must be enclosed in double quotes');
 return JSON.parse(text);
}

function numericDescription(item,value){
 if(item.type==='float')return 'float32='+(Number.isFinite(value)?(value<0||Object.is(value,-0)?'-':'')+shortestFloat32(value):value<0?'-Inf':'+Inf');
 return 'int32='+(Math.trunc(value)|0);
}

export function formatClipboard(text,values,{profile='mugen11'}={}){
 let output='',argument=0;
 for(let index=0;index<text.length;index++){
  if(text[index]!=='%'){output+=text[index];continue}
  const match=text.slice(index).match(/^%([-+ 0#]*)(\d*)(?:\.(\d*))?([hlL]?)([diufFeEgGsqvboOxXcU%])/);
  if(!match)throw Error('Unsupported clipboard format '+text.slice(index,index+12));
  index+=match[0].length-1;
  const [,rawFlags,widthText,precisionText,lengthModifier,verb]=match;
  const flags=verb==='v'?rawFlags.replace(/[#+]/g,''):rawFlags;
  if(lengthModifier&&profile!=='ikemen')throw Error('Unsupported MUGEN clipboard length modifier');
  if(verb==='%'){output+='%';continue}
  if(profile!=='ikemen'&&'sqvboOxXcU'.includes(verb))throw Error('Unsupported clipboard format %'+verb+' for MUGEN');
  if(verb==='u'&&profile!=='ikemen')throw Error('Unsupported MUGEN clipboard format %u');
  if(argument>=values.length){if(profile==='ikemen'){output+='%!'+('iu'.includes(verb)?'d':verb)+'(MISSING)';continue}throw Error('Missing clipboard parameter');}
  const item=values[argument++],value=Number(item.value),integer='diu'.includes(verb)||verb==='v'&&item.type!=='float'&&item.type!=='string';
  const precision=precisionText===undefined?6:Number(precisionText),width=Number(widthText||0);
  if(precision>100||width>10000)throw Error('Clipboard format exceeds WEB numeric formatting limits');
  let formatted;
  if(item.type==='string'){
   if(profile!=='ikemen')throw Error('MUGEN clipboard parameters must be numeric');
   if('sqvxX'.includes(verb)){
    const stringVerb=verb==='v'?(rawFlags.includes('#')?'q':'s'):verb;
    output+=formatClipboardString(item.value,{verb:stringVerb,flags,width,precision:precisionText===undefined?undefined:precision});continue;
   }
   output+='%!'+('iu'.includes(verb)?'d':verb)+'(string='+item.value+')';continue;
  }
  if(Number.isNaN(value)){output+=profile==='ikemen'?'(Undefined)':'undefined';continue;}
  if(profile==='ikemen'&&item.type!=='float'&&'diuvboOxXcU'.includes(verb)){
   output+=formatClipboardInteger(value,{verb,flags,width,precision:precisionText===undefined?undefined:precision});continue;
  }
  if(verb==='s'||verb==='q'){
   if(verb==='q'&&item.type!=='float')output+=padClipboardString(quoteClipboardRune(value,{ascii:flags.includes('+')}),{flags,width});
   else output+='%!'+verb+'('+numericDescription(item,value)+')';
   continue;
  }
  if(profile==='ikemen'&&item.type==='float'&&'diuoOcU'.includes(verb)){output+='%!'+('iu'.includes(verb)?'d':verb)+'('+numericDescription(item,value)+')';continue;}
  if(profile==='ikemen'&&!Number.isFinite(value)){
   const sign=value<0?'-':flags.includes(' ')&&!flags.includes('+')?' ':'+';
   output+=padClipboardString(sign+'Inf',{flags:flags.replace(/0/g,''),width});continue;
  }
  if(!Number.isFinite(value))formatted=value<0?'-Inf':'+Inf';
  else if('bxX'.includes(verb))formatted=(value<0||Object.is(value,-0)?'-':'')+formatFloat32Base(value,{verb,precision:precisionText===undefined?-1:precision,alternate:flags.includes('#')});
  else if(integer){
   if(item.type==='float'){
    if(profile==='ikemen'){output+='%!d(float32='+(value<0||Object.is(value,-0)?'-':'')+shortestFloat32(value)+')';continue;}
    formatted=(value<0||Object.is(value,-0)?'-':'')+formatFloat32(value,{precision:6,rounding:'away'});
   }else{
    const number=Math.trunc(value)|0,negative=number<0;
    let digits=String(Math.abs(number));
    if(precisionText!==undefined)digits=precision===0&&number===0?'':digits.padStart(precision,'0');
    formatted=(negative?'-':'')+digits;
   }
  }else if(verb==='v')formatted=(value<0||Object.is(value,-0)?'-':'')+(precisionText===undefined?shortestFloat32(value):formatFloat32(value,{verb:'g',precision}));
  else if(item.type==='int'||item.type==='bool'){
   if(profile==='ikemen'){output+='%!'+verb+'(int32='+(Math.trunc(value)|0)+')';continue;}
   formatted=String(Math.trunc(value)|0);
  }else formatted=(value<0||Object.is(value,-0)?'-':'')+formatFloat32(value,{verb,precision,alternate:flags.includes('#'),rounding:profile==='ikemen'?'even':'away'});
  if(verb===verb.toUpperCase())formatted=formatted.toUpperCase();
  if(flags.includes('#')&&!integer&&!'bxX'.includes(verb)&&!formatted.includes('.')&&!/Inf|undefined/i.test(formatted))formatted=formatted.replace(/(?=e|$)/i,'.');
  if(!/^[+-]/.test(formatted)&&value>=0&&flags.includes('+'))formatted='+'+formatted;else if(!/^[+-]/.test(formatted)&&value>=0&&flags.includes(' '))formatted=' '+formatted;
  if(flags.includes('-'))formatted=formatted.padEnd(width,' ');
  else if(flags.includes('0')&&!(integer&&precisionText!==undefined)&&formatted.length<width){const sign=/^[+ -]/.test(formatted)?formatted[0]:'';formatted=sign+formatted.slice(sign.length).padStart(width-sign.length,'0');}
  else formatted=formatted.padStart(width,' ');
  output+=formatted;
 }
 if(profile!=='ikemen'&&argument!==values.length)throw Error('Unexpected clipboard parameter count');
 return output;
}

export function createDebugClipboard({rowLimit=8}={}){
 const buffers=new Map();
 function execute(controller,actor,api){
  const type=String(controller.type).toLowerCase();
  if(!['displaytoclipboard','appendtoclipboard','clearclipboard'].includes(type))return false;
  const params=controller.params||controller;
  const target=params.redirectid===undefined?actor:api.findActor(Math.trunc(Number(api.evaluate(params.redirectid)))|0);
  if(!target)return true;
  const key=api.key(target);
  if(type==='clearclipboard'){buffers.delete(key);return true}
  const values=params.params===undefined?[]:api.expressions(params.params).map(api.sample);
  const limit=api.profile==='ikemen'?100:6;
  if(values.length>limit)throw Error('Too many clipboard parameters');
  const text=formatClipboard(decodeText(params.text),values,{profile:api.profile});
  let lines=type==='displaytoclipboard'?[]:[...(buffers.get(key)||[])];
  const next=text.split('\n');
  if(type==='appendtoclipboard'&&api.profile==='ikemen'&&lines.length)lines[lines.length-1]+=next.shift();
  lines.push(...next);
  const count=Math.max(0,Math.trunc(rowLimit));
  buffers.set(key,count?lines.slice(-count):[]);
  return true;
 }
 return {execute,entries:()=>[...buffers].map(([key,lines])=>({key,lines:[...lines]})),clear:()=>buffers.clear(),prune:keys=>{for(const key of buffers.keys())if(!keys.has(key))buffers.delete(key)}};
}
