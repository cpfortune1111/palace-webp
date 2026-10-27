export function decodeNativePcmWave(bytes,context){
 const data=new DataView(bytes),text=offset=>String.fromCharCode(...new Uint8Array(bytes,offset,4));
 if(bytes.byteLength<12||text(0)!=='RIFF'||text(8)!=='WAVE')throw Error('Invalid PCM wave header');
 let format=null,payload=null;
 for(let offset=12;offset+8<=bytes.byteLength;){
  const name=text(offset),size=data.getUint32(offset+4,true),start=offset+8;if(start+size>bytes.byteLength)throw Error('Truncated PCM wave chunk');
  if(name==='fmt '){if(size<16)throw Error('Invalid PCM wave format');format={codec:data.getUint16(start,true),channels:data.getUint16(start+2,true),rate:data.getUint32(start+4,true),align:data.getUint16(start+12,true),bits:data.getUint16(start+14,true)}}
  if(name==='data')payload={start,size};offset=start+size+(size%2);
 }
 if(!format||!payload)throw Error('Missing PCM wave chunks');
 const {codec,channels,rate,align,bits}=format,width=bits/8;
 if(codec!==1||![1,2].includes(channels)||![8,16,24,32].includes(bits)||rate<=0||align!==channels*width||payload.size%align)throw Error('Unsupported PCM wave format');
 const frames=payload.size/align;if(frames===0)throw Error('Empty PCM wave');const buffer=context.createBuffer(channels,frames,rate);
 for(let channel=0;channel<channels;channel++){
  const samples=buffer.getChannelData(channel);
  for(let frame=0;frame<frames;frame++){
   const offset=payload.start+frame*align+channel*width;let value;
   if(bits===8)value=(data.getUint8(offset)-128)/128;
   else if(bits===16)value=data.getInt16(offset,true)/32768;
   else if(bits===24)value=((data.getUint8(offset)|data.getUint8(offset+1)<<8|data.getInt8(offset+2)<<16))/8388608;
   else value=data.getInt32(offset,true)/2147483648;
   samples[frame]=value;
  }
 }
 return buffer;
}
