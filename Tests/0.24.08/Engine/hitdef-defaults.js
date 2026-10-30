// Five current characters declare mugenversion=1.0, localcoord=1280,720.
// Reference: pinned IKEMEN HitDef.clear/finalizeParams (MUGEN branch).
// Called after expression evaluation; never override an explicit zero.
export function hitDefDefaults(input){
 const p={...input};
 const set=(key,value)=>{if(p[key]===undefined)p[key]=value};
 for(const [key,value] of Object.entries({damage:'0,0',pausetime:'0,0','ground.velocity':'0,0','air.velocity':'0,0','ground.slidetime':0,'ground.hittime':0,'air.hittime':20,animtype:'Light','ground.type':'High',hitflag:'MAF',guardflag:'',priority:'4,Hit',yaccel:1.4,fall:0,kill:1,'guard.kill':1,'fall.kill':1,'fall.damage':0,'fall.yvelocity':-18,'fall.recover':1,'fall.recovertime':4,id:-1,'p1sprpriority':1,'p2sprpriority':0}))set(key,value);
 set('guard.pausetime',p.pausetime);
 // Native MUGEN compatibility uses ground.slidetime, not ground.hittime.
 set('guard.hittime',p['ground.slidetime']);
 set('guard.slidetime',p['guard.hittime']);
 set('guard.ctrltime',p['guard.slidetime']);
 set('airguard.ctrltime',p['guard.ctrltime']);
 set('air.animtype',p.animtype);set('air.type',p['ground.type']);set('air.fall',p.fall);
 const groundX=Number(String(p['ground.velocity']).split(',')[0]);
 set('guard.velocity',String(groundX));
 const aerialAttack=String(p.attr||'').split(',')[0].trim().toUpperCase().includes('A');
 set('ground.cornerpush.veloff',aerialAttack?0:Number(String(p['guard.velocity']).split(',')[0])*1.3);
 for(const key of ['air','guard','down','airguard'])set(key+'.cornerpush.veloff',p['ground.cornerpush.veloff']);
 return p;
}
