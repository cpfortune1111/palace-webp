export const abilityKeys=['special','super','defense','playful','hp','attack'];
export function abilityBudget(mode){return ['arcade','story'].includes(mode)?10:15}
export function abilityProfile(points=Array(6).fill(0)){
 if(points.length!==6||points.some(point=>!Number.isInteger(point)||point<0||point>5))throw Error('Invalid ACS allocation');
 const [special,superAttack,defense,playful,hp,attack]=points;
 return Object.freeze({points:[...points],attack:1+.07*attack,special:1+.2*special,defense:1-.1*defense,playfulFailure:.092*playful,hp:1+hp/12,super:1+.1*superAttack});
}
export function changeAbility(points,index,direction,budget){
 const next=[...points],remaining=budget-next.reduce((total,value)=>total+value,0);
 if(direction<0||remaining===0||next[index]===5)next[index]=Math.max(0,next[index]-1);
 else next[index]++;
 return next;
}
export function abilityDamage(base,attacker,defender,state,attribute=''){
 const attackType=String(attribute).split(',').slice(1).join(',').trim().toUpperCase();
 const category=state>=200&&state<=999?'attack':state>=3000&&state<=3999||/H[ATP]/.test(attackType)?'super':state>=1000&&state<=2999||/S[ATP]/.test(attackType)?'special':'attack';
 return base*attacker[category]*defender.defense;
}

