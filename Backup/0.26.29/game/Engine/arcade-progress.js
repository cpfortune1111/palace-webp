export function createArcadeProgress(){
 let remaining=[],completed=0,total=0;
 function begin(choice){const opponents=choice.arcadeOpponents||[{id:choice.players[1],stage:choice.stage}];remaining=opponents.filter((entry,index)=>entry.id!==choice.players[1]&&opponents.findIndex(item=>item.id===entry.id)===index);completed=0;total=remaining.length+1}
 function next(winner,choice){if(winner!==1){remaining=[];return null}completed++;const opponent=remaining.shift();return opponent?{...choice,players:[choice.players[0],opponent.id],stage:opponent.stage}:null}
 return {begin,next,snapshot:()=>({completed,total,remaining:remaining.map(entry=>entry.id)})};
}

