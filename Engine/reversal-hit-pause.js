export function reversalHitPause(pausetime,{ikemen=false,mugenMajor=1,sourceGettingHit=false,targetGettingHit=false,targetAirborne=false,groundType=1,airType=1}={}){
 const components=String(pausetime??'0,0').split(','),fix=Number(ikemen||mugenMajor===1);
 if(components.length>2||components.some(value=>value.trim()===''||!Number.isFinite(Number(value))))throw Error('Invalid reversal pausetime');
 const values=components.map(value=>Math.trunc(Number(value))|0);
 const typed=(targetAirborne?airType:groundType)!==0;
 return {source:sourceGettingHit||!typed?null:Math.max(1,values[0]+fix),target:targetGettingHit?null:Math.max(1,(values[1]??0)+fix)};
}
