export function hitSparkGeometry(attacker,defender,offset,box,{attackerScale=1,defenderScale=1,boxScale=1}={}){
 const edge=Math.fround((attacker.facing!==defender.facing?box[2]:-box[0])*Math.fround(boxScale)),horizontal=Math.fround(Math.fround(Number(offset[0]??0))*Math.fround(attackerScale)),vertical=Math.fround(Math.fround(Number(offset[1]??0))*Math.fround(attackerScale));
 const x=Math.fround(Math.fround(defender.x+Math.fround(edge*defender.facing))-Math.fround(horizontal*attacker.facing)),y=Math.fround(attacker.y+vertical),ratio=Math.fround(defenderScale);
 return {x,y,sparkx:Math.fround(Math.fround((x-defender.x)/ratio)*defender.facing),sparky:Math.fround((y-defender.y)/ratio)};
}
