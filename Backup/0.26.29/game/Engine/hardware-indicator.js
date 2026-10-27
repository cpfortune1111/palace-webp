export function createHardwareIndicator(){
 const images={};const ready=Promise.all(['snes','3do','saturn'].map(async key=>{const image=new Image();image.src='./Data/Select/Buttons/'+key+'.webp';await image.decode();images[key]=image}));
 function draw(context,key,x,y,scale){const image=images[key];if(!image)return;const width=image.naturalWidth*.675*.8*scale,height=image.naturalHeight*.675*.8*scale;context.drawImage(image,x-width/2,y,width,height)}
 return {ready,draw};
}

