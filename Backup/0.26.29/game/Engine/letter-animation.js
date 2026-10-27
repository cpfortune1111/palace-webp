export function letterBouncePose(age,duration=58){
 if(age<0)return {alpha:0,y:36};
 const progress=Math.min(1,age/(duration-1)),anchors=[[0,36],[22/57,-30],[42/57,14],[1,0]];
 let offset=0;
 for(let segment=1;segment<anchors.length;segment++){const [start,startY]=anchors[segment-1],[end,endY]=anchors[segment];if(progress<=end){const ease=(1-Math.cos(Math.PI*(progress-start)/(end-start)))/2;offset=startY+(endY-startY)*ease;break}}
 return {alpha:Math.min(1,(age+1)/6),y:offset};
}

