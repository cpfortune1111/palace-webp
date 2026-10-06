export function createTitlePresentation(){
 let age=60,amount=0,target=0;
 function enter(){age=0;amount=target=0}
 function settings(value){target=value}
 function step(seconds){age+=seconds*60;const distance=seconds*2;amount=target>amount?Math.min(target,amount+distance):Math.max(target,amount-distance)}
 function snapshot(){return {homeFade:Math.min(1,age/30),settings:amount,titleOffset:-360*(1-Math.min(1,age/30))**3}}
 function draw(context,layers,backgrounds){const state=snapshot(),frame=layers.find(layer=>layer.sprite[0]===1),title=layers.find(layer=>layer.sprite[0]===0);context.save();if(backgrounds[0]){context.globalAlpha=amount;context.drawImage(backgrounds[0].image,320,96,640,528)}if(frame){const image=frame.image,width=image.naturalWidth,height=image.naturalHeight,left=640-frame.axisX,top=-frame.axisY;context.globalAlpha=state.homeFade*(1-amount);context.drawImage(image,32,height-128,width-64,96,left+32,top+height-128,width-64,96);context.globalAlpha=state.homeFade;for(const [right,bottom] of [[false,false],[true,false],[false,true],[true,true]]){const sourceX=right?width-112:0,sourceY=bottom?height-112:0,homeX=left+sourceX,homeY=top+sourceY,x=homeX+((right?848:320)-homeX)*amount,y=homeY+((bottom?512:96)-homeY)*amount;if(!bottom)context.drawImage(image,sourceX,sourceY,112,112,x,y,112,112);else{const stripX=right?80:0;context.drawImage(image,sourceX+stripX,sourceY,32,80,x+stripX,y,32,80);context.drawImage(image,sourceX,sourceY+80,112,32,x,y+80,112,32)}}}if(title){context.globalAlpha=1-amount;context.drawImage(title.image,640-title.axisX,-title.axisY+state.titleOffset)}context.restore()}
 return {enter,settings,step,draw,snapshot};
}

