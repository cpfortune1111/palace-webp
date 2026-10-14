const float=Math.fround;

export function worldClsnBox(box,x,y,facing=1){
 const rect=box.rect||box,angle=float(-float(box.angle||0)*facing),pivot=box.pivot||[0,0];
 const left=float(x+(facing<0?-rect[2]:rect[0])),right=float(x+(facing<0?-rect[0]:rect[2])),top=float(y+rect[1]),bottom=float(y+rect[3]);
 const world={l:Math.min(left,right),r:Math.max(left,right),t:Math.min(top,bottom),b:Math.max(top,bottom),angle,pivot:[float(x+float(pivot[0]*facing)),float(y+pivot[1])]};
 return world;
}

export function rotatedClsnCorners(box){
 const points=[[box.l,box.t],[box.r,box.t],[box.r,box.b],[box.l,box.b]],pivot=box.pivot||[0,0],radians=float(float((box.angle||0)*Math.PI)/180),sine=float(Math.sin(radians)),cosine=float(Math.cos(radians));
 return points.map(point=>{const dx=float(point[0]-pivot[0]),dy=float(point[1]-pivot[1]);return [float(float(float(cosine*dx)-float(sine*dy))+pivot[0]),float(float(float(sine*dx)+float(cosine*dy))+pivot[1])]});
}

export function clsnWorldOverlap(first,second){
 if(!first.angle&&!second.angle)return first.l<=second.r&&first.r>=second.l&&first.t<=second.b&&first.b>=second.t;
 const cornersFirst=rotatedClsnCorners(first),cornersSecond=rotatedClsnCorners(second);
 const range=(points,nx,ny)=>{const projected=points.map(point=>float(float(nx*point[0])+float(ny*point[1])));return [Math.min(...projected),Math.max(...projected)]};
 for(const corners of [cornersFirst,cornersSecond])for(let index=0;index<4;index++){
  const point=corners[index],next=corners[(index+1)%4],nx=float(next[1]-point[1]),ny=float(point[0]-next[0]),firstRange=range(cornersFirst,nx,ny),secondRange=range(cornersSecond,nx,ny);
  if(firstRange[1]<secondRange[0]||secondRange[1]<firstRange[0])return false;
 }
 return true;
}
