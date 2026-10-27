export function controllerStringLiteral(value,name){
 const literal=String(value).trim();
 if(literal.length<2||literal[0]!=='"'||literal.at(-1)!=='"')throw Error(name+' not enclosed in double quotes');
 return literal.slice(1,-1);
}
