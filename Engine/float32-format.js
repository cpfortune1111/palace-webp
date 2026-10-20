const floatBits=new DataView(new ArrayBuffer(4));

function decimalValue(value){
 floatBits.setFloat32(0,Math.abs(value));
 const bits=floatBits.getUint32(0),exponent=(bits>>>23)&255,mantissa=(bits&8388607)+(exponent?8388608:0);
 if(!mantissa)return {coefficient:0n,scale:0};
 const power=exponent?exponent-150:-149;
 return power>=0?{coefficient:BigInt(mantissa)<<BigInt(power),scale:0}:{coefficient:BigInt(mantissa)*5n**BigInt(-power),scale:-power};
}

function roundDecimal(coefficient,removed,rounding='even'){
 if(removed<=0)return coefficient*10n**BigInt(-removed);
 const divisor=10n**BigInt(removed),quotient=coefficient/divisor,remainder=coefficient%divisor;
 return quotient+(remainder*2n>divisor||remainder*2n===divisor&&(rounding==='away'||quotient%2n===1n)?1n:0n);
}

function significantValue(decimal,precision,rounding='even'){
 const text=decimal.coefficient.toString();
 let exponent=decimal.coefficient===0n?0:text.length-decimal.scale-1;
 let digits=roundDecimal(decimal.coefficient,text.length-precision,rounding).toString().padStart(precision,'0');
 if(digits.length>precision){digits=digits.slice(0,-1);exponent++;}
 return {digits,exponent};
}

function exponentText(exponent){return 'e'+(exponent<0?'-':'+')+String(Math.abs(exponent)).padStart(2,'0')}

function generalValue(significant,alternate,cutoff){
 let digits=significant.digits;
 if(!alternate)digits=digits.replace(/0+$/,'')||'0';
 if(significant.exponent< -4||significant.exponent>=cutoff)return digits[0]+(digits.length>1||alternate?'.'+digits.slice(1):'')+exponentText(significant.exponent);
 const position=significant.exponent+1;
 if(position<=0)return '0.'+'0'.repeat(-position)+digits;
 if(position>=digits.length)return digits+'0'.repeat(position-digits.length)+(alternate?'.':'');
 return digits.slice(0,position)+'.'+digits.slice(position);
}

export function shortestFloat32(value){
 const magnitude=Math.abs(Math.fround(value)),decimal=decimalValue(magnitude);
 for(let precision=1;precision<=9;precision++){
  const significant=significantValue(decimal,precision),candidate=significant.digits[0]+'.'+significant.digits.slice(1)+'e'+significant.exponent;
  if(Math.fround(Number(candidate))===magnitude)return generalValue(significant,false,6);
 }
 throw Error('No round-trip float32 representation');
}

export function formatFloat32(value,{verb='f',precision=6,alternate=false,rounding='even'}={}){
 const decimal=decimalValue(value),kind=verb.toLowerCase();
 if(kind==='f'){
  const length=decimal.coefficient.toString().length;
  if(rounding==='away'&&length-decimal.scale>17)decimal.coefficient=roundDecimal(decimal.coefficient,length-17,rounding)*10n**BigInt(length-17);
  const digits=roundDecimal(decimal.coefficient,decimal.scale-precision,rounding).toString().padStart(precision+1,'0');
  return precision?digits.slice(0,-precision)+'.'+digits.slice(-precision):digits+(alternate?'.':'');
 }
 const count=kind==='e'?precision+1:Math.max(1,precision),significant=significantValue(decimal,count,rounding);
 if(kind==='e')return significant.digits[0]+(precision||alternate?'.'+significant.digits.slice(1):'')+exponentText(significant.exponent);
 if(alternate&&rounding==='away'&&decimal.coefficient===0n)return '0.'+'0'.repeat(count);
 return generalValue(significant,alternate,count);
}
