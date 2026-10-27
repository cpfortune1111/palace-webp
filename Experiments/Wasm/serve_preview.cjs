// Local preview server. Only explicit site, protected-pack and host roots are exposed.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const site=path.resolve(__dirname,'../..'),pack=path.resolve(process.argv[2]||''),host=path.resolve(process.argv[3]||'');
if(!process.argv[2]||!process.argv[3])throw Error('Usage: node serve_preview.cjs <pack-directory> <host-directory> [port]');
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.ogg':'audio/ogg','.ttf':'font/ttf'};
http.createServer((request,response)=>{
 try{
  let name=decodeURIComponent(new URL(request.url,'http://localhost').pathname),base=site;
  for(const[prefix,root]of [['/Experiments/Wasm/Pack/',pack],['/Experiments/Wasm/Host/',host]])if(name.startsWith(prefix)){base=root;name='/'+name.slice(prefix.length);break}
  const file=path.resolve(base,'.'+name);
  if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);return response.end()}
  const size=fs.statSync(file).size;response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');response.setHeader('Cache-Control','no-store');response.setHeader('Accept-Ranges','bytes');
  let start=0,end=size-1;
  if(request.headers.range){const range=/^bytes=(\d+)-(\d*)$/.exec(request.headers.range);if(!range){response.writeHead(416);return response.end()}start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;if(start>end||start>=size){response.writeHead(416);return response.end()}response.statusCode=206;response.setHeader('Content-Range',`bytes ${start}-${end}/${size}`)}
  response.setHeader('Content-Length',end-start+1);if(request.method==='HEAD')return response.end();fs.createReadStream(file,{start,end}).pipe(response);
 }catch{response.writeHead(400);response.end()}
}).listen(Number(process.argv[4]||8765),'127.0.0.1',()=>console.log('http://127.0.0.1:'+Number(process.argv[4]||8765)+'/Experiments/Wasm/play.html'));
