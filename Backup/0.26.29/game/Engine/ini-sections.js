// Pinned common.go INI rules; not a quote-aware or last-key-wins INI dialect.
export const trimIni=value=>value.replace(/^\p{White_Space}+|\p{White_Space}+$/gu,'');
export function parseIniSections(text){
 if(typeof text!=='string')throw new TypeError('INI source must be text');
 const lines=text.split('\n').map(trimIni),sections=[];let i=0;
 while(i<lines.length){
  const line=lines[i++];if(!line.startsWith('['))continue;
  const header=trimIni(line.split(';',1)[0]);if(!header.endsWith(']'))continue;
  const inner=header.slice(1,header.indexOf(']')),space=inner.indexOf(' ');
  const section={name:(space<0?inner:inner.slice(0,space+1)).toLowerCase(),subname:space<0?'':inner.slice(space+1),fields:Object.create(null)};
  if(!section.name)continue;
  while(i<lines.length&&!lines[i].startsWith('[')){
   const entry=trimIni(lines[i++].split(';',1)[0]),at=entry.search(/[= \t]/);
   if(at<=0)continue;
   const name=entry.slice(0,at).toLowerCase(),equals=entry.indexOf('=');
   if(!Object.hasOwn(section.fields,name))section.fields[name]=equals<0?'':trimIni(entry.slice(equals+1));
  }
  sections.push(section);
 }
 return sections;
}
export function iniInteger(text){
 text=trimIni(text);const negative=text.startsWith('-');if(/^[+-]/.test(text))text=text.slice(1);
 let value=0;
 for(const digit of text){if(!/^[0-9]$/.test(digit))break;value=value*10+Number(digit);if(value>2147483647)return negative?-2147483648:2147483647}
 return (negative?-value:value)|0;
}
export function iniScalar(fields,name,fallback,{boolean=false}={}){
 const raw=fields[name];if(raw===undefined||raw.length===0)return fallback;
 const first=trimIni(raw.split(',',1)[0]);if(!first)return fallback;
 const value=iniInteger(first);return boolean?value!==0:value;
}
