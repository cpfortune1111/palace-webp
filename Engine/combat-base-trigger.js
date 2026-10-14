export function combatBaseTrigger(base,multiplier=1){
 const scaled=Number(base)*Number(multiplier)*1000;
 return Math.fround(Math.sign(scaled)*Math.floor(Math.abs(scaled)+0.5)/1000);
}
