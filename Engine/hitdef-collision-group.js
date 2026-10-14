export function compileCollisionGroup(value){
 const groups={all:-1,none:0,clsn1:1,clsn2:2,size:3,dummy:4};
 if(groups[String(value).toLowerCase()]===undefined)throw Error('Invalid Clsn type: '+value);
 return groups[String(value).toLowerCase()];
}

export function hitDefCollisionBoxes(params,sets,{reversal=false}={}){
 let group=params.p2clsncheck===undefined?-1:compileCollisionGroup(params.p2clsncheck);
 if(group<0)group=reversal?1:2;
 const required=params.p2clsnrequire===undefined?-1:compileCollisionGroup(params.p2clsnrequire);
 const boxes=number=>{if(number===0)return [];if(number===1)return sets.c1||[];if(number===2)return sets.c2||[];if(number===4)return sets.dummy||[];if(!sets.size)throw Error('Unsupported native size collision geometry');return typeof sets.size==='function'?sets.size():sets.size};
 if(required>0&&!boxes(required).length)return {group,boxes:[],requiredMissing:true};
 return {group,boxes:boxes(group),requiredMissing:false};
}
