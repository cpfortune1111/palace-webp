export function guardContactParameters(params,aerial,compatibility='mugen'){
 const pair=value=>String(value??'0,0').split(',').map(Number);
 const groundVelocity=pair(params['ground.velocity']),airVelocity=pair(params['air.velocity']);
 const velocity=aerial?(params['airguard.velocity']===undefined?[Math.fround(airVelocity[0]*1.5),Math.fround((airVelocity[1]||0)*0.5)]:pair(params['airguard.velocity']).map(Math.fround)):pair(params['guard.velocity']??groundVelocity[0]).map(Math.fround);
 const depth=aerial?(params['airguard.velocity']===undefined?airVelocity[2]:velocity[2]):params['guard.velocity']===undefined?groundVelocity[2]:velocity[2];
 if(depth)throw Error('Unsupported guard velocity Z component');
 const hittime=Number(params['guard.hittime']??params[compatibility==='ikemen'?'ground.hittime':'ground.slidetime']??0);
 const slidetime=Number(params['guard.slidetime']??hittime);
 const groundControl=Number(params['guard.ctrltime']??slidetime);
 const ctrltime=aerial?Number(params['airguard.ctrltime']??groundControl):groundControl;
 const prefix=aerial?'airguard':'guard';
 return {velocity,hittime,slidetime,ctrltime,prefix};
}

export function guardContactAllowed(defender,params,mode,assertions,sourceAssertions,airStatesAvailable){
 if(!['S','C','A'].includes(defender.type))return false;
 const aerial=defender.type==='A',stance=aerial?'noairguard':defender.type==='C'?'nocrouchguard':'nostandguard';
 if(sourceAssertions.has('unguardable')||assertions.has(stance)||mode==='none')return false;
 const ready=(defender.ctrl&&defender.moveType==='I')||[120,130,131,132,140,150,151,152,153,154,155].includes(defender.state);
 if(!ready||aerial&&!airStatesAvailable||!aerial&&defender.y!==0)return false;
 const flags=String(params.guardflag??'').toUpperCase();
 return aerial?flags.includes('A'):flags.includes('M')||flags.includes(defender.type==='C'?'L':'H');
}
