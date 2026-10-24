export function playSoundGain(volume,ownVolume=256,common=false){
 const scaled=Math.max(-25600,Math.min(25600,volume));
 const level=common?Math.trunc((scaled*64|0)/25):Math.trunc((ownVolume*scaled|0)/100);
 return Math.fround(Math.max(0,Math.min(512,Math.fround(level)))/256);
}
