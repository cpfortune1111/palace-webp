function escapedCharacter(character,{ascii=false,quote='"'}={}){
 const code=character.codePointAt(0),named=new Map([[7,'a'],[8,'b'],[9,'t'],[10,'n'],[11,'v'],[12,'f'],[13,'r']]);
 if(character===quote||character==='\\')return '\\'+character;
 if(named.has(code))return '\\'+named.get(code);
 if(code<32||code===127)return '\\x'+code.toString(16).padStart(2,'0');
 const printable=character===' '||/[\p{L}\p{M}\p{N}\p{P}\p{S}]/u.test(character);
 if(printable&&(!ascii||code<128))return character;
 return code<=65535?'\\u'+code.toString(16).padStart(4,'0'):'\\U'+code.toString(16).padStart(8,'0');
}

export function quoteClipboardString(value,{ascii=false,raw=false}={}){
 const characters=Array.from(String(value));
 if(raw&&characters.every(character=>character!=='`'&&character.codePointAt(0)!==65279&&(character==='\t'||character.codePointAt(0)>=32&&character.codePointAt(0)!==127)))return '`'+value+'`';
 return '"'+characters.map(character=>escapedCharacter(character,{ascii})).join('')+'"';
}

export function quoteClipboardRune(value,{ascii=false}={}){
 let code=Math.trunc(Number(value))|0;
 if(code<0||code>1114111||code>=55296&&code<=57343)code=65533;
 return "'"+escapedCharacter(String.fromCodePoint(code),{ascii,quote:"'"})+"'";
}

export function padClipboardString(value,{flags='',width=0}={}){
 const length=Array.from(value).length,padding=Math.max(0,width-length);
 return flags.includes('-')?value+' '.repeat(padding):(flags.includes('0')?'0':' ').repeat(padding)+value;
}

export function formatClipboardString(value,{verb='s',flags='',width=0,precision}={}){
 let text=String(value);
 if(verb==='x'||verb==='X'){
  let bytes=Array.from(new TextEncoder().encode(text));
  if(precision!==undefined)bytes=bytes.slice(0,precision);
  const prefix=verb==='X'?'0X':'0x';
  let digits=bytes.map(value=>value.toString(16).padStart(2,'0'));
  if(verb==='X')digits=digits.map(value=>value.toUpperCase());
  text=flags.includes(' ')?digits.map(value=>(flags.includes('#')?prefix:'')+value).join(' '):(digits.length&&flags.includes('#')?prefix:'')+digits.join('');
  return padClipboardString(text,{flags,width});
 }
 if(precision!==undefined)text=Array.from(text).slice(0,precision).join('');
 if(verb==='q')text=quoteClipboardString(text,{ascii:flags.includes('+'),raw:flags.includes('#')});
 return padClipboardString(text,{flags,width});
}
