import * as THREE from 'three';
export const mirrorCharacters={Moon:'SailorMoon',Mercury:'SailorMercury',Mars:'SailorMars',Venus:'SailorVenus',Jupiter:'SailorJupiter',Pluto:'SailorPluto',Neptune:'SailorNeptune',Uranus:'SailorUranus',CMoon:'SailorChibiMoon',Saturn:'SailorSaturn',Tuxedo:'TuxedoMask'};
const portraitIds={Moon:'Moon',Mer:'Mercury',Mar:'Mars',Ven:'Venus',Jup:'Jupiter',Plu:'Pluto',Nep:'Neptune',Ura:'Uranus',CM:'CMoon',Sat:'Saturn',Tux:'Tuxedo'};
function boundary(geometry){const p=geometry.attributes.position,index=geometry.index,vertices=new Map(),edges=new Map(),key=i=>{const v=new THREE.Vector3().fromBufferAttribute(p,i),k=v.toArray().map(x=>Math.round(x*1e5)).join(',');vertices.set(k,v);return k};for(let i=0;i<(index?.count??p.count);i+=3){const ids=[0,1,2].map(j=>key(index?index.getX(i+j):i+j));for(let j=0;j<3;j++){const a=ids[j],b=ids[(j+1)%3],k=[a,b].sort().join('|'),e=edges.get(k);if(e)e.count++;else edges.set(k,{a,b,count:1})}}
 const graph=new Map();for(const e of edges.values())if(e.count===1){for(const[a,b]of [[e.a,e.b],[e.b,e.a]]){if(!graph.has(a))graph.set(a,[]);graph.get(a).push(b)}}const used=new Set(),loops=[];for(const first of graph.keys()){if(used.has(first))continue;const loop=[];let at=first,previous;for(let guard=0;guard<graph.size+2;guard++){loop.push(vertices.get(at));used.add(at);const next=(graph.get(at)||[]).find(n=>n!==previous&&(!used.has(n)||n===first));if(!next||next===first)break;previous=at;at=next}if(loop.length>2)loops.push(loop)}return loops.sort((a,b)=>b.length-a.length)[0]||[]}
function mirrorMaterial(opacity, overlay) {
 const material=new THREE.ShaderMaterial({
  transparent:overlay, depthWrite:!overlay, side:THREE.FrontSide,
  uniforms:{coverage:{value:opacity}},
  vertexShader:`
   varying vec3 surface;
   void main(){
    surface=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
   }`,
  fragmentShader:`
   uniform float coverage;
   varying vec3 surface;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   void main(){
    vec3 sphere=normalize(surface);
    vec2 tile=vec2(atan(sphere.x,sphere.z)/6.2831853+.5,asin(sphere.y)/3.1415927+.5)*vec2(104.0,52.0);
    vec2 cell=floor(tile);
    float seed=hash(cell);
    vec3 normal=normalize(cross(dFdx(surface),dFdy(surface)));
    if(dot(normal,sphere)<0.0)normal=-normal;
    normal=normalize(normal+vec3(seed-.5,hash(cell+13.0)-.5,0.0)*.13);
    vec3 reflected=reflect(vec3(0.0,0.0,-1.0),normal);
    float soft=pow(max(0.0,dot(reflected,normalize(vec3(-.65,.55,1.0)))),8.0);
    float strip=pow(max(0.0,dot(reflected,normalize(vec3(.45,-.15,1.0)))),45.0);
    float rim=pow(1.0-abs(sphere.z),3.0);
    vec3 color=mix(vec3(.007,.018,.075),vec3(.035,.28,.95),pow(seed,1.8));
    color+=vec3(.12,.52,1.0)*(soft*.88+rim*1.45);
    color+=vec3(.74,.92,1.0)*strip*(.8+seed*2.2);
    gl_FragColor=vec4(color,coverage);
    #include <colorspace_fragment>
   }`
 });
 material.opacity=opacity;
 return material;
}
export function createDiscoInterface(model,camera){const regions=new Map(),portraits=new Map(),ray=new THREE.Raycaster(),colors=['#5EDFFF','#FF67BF'];let players=[],confirmed=[],available=new Set(),time=0;
 model.traverse(node=>{if(!node.isMesh)return;const name=node.material.name;if(name.startsWith('Mirror.')){const id=mirrorCharacters[name.slice(7)];const backing=new THREE.Mesh(node.geometry,mirrorMaterial(1,false));backing.material.depthWrite=false;backing.renderOrder=2;node.add(backing);node.material=mirrorMaterial(.2,true);node.material.depthTest=false;node.renderOrder=4;regions.set(id,{node,path:boundary(node.geometry)});}else if(name==='Mirror'){node.material=mirrorMaterial(1,false);node.renderOrder=2}else if(portraitIds[name]){node.material=node.material.clone();node.material.transparent=true;node.material.depthWrite=false;node.material.side=THREE.DoubleSide;node.material.alphaTest=.01;node.renderOrder=3;portraits.set(mirrorCharacters[portraitIds[name]],node);if(name==='Tux')node.visible=false}});
 function setSelection(next){players=next.players||[];confirmed=next.confirmed||[];available=new Set(next.available||[]);for(const[id,r]of regions){const factor=players.includes(id)?.05:.2;r.node.material.opacity=factor;r.node.material.uniforms.coverage.value=factor}for(const[id,node]of portraits)node.material.opacity=available.has(id)?1:.35}
 function project(r){r.node.updateWorldMatrix(true,false);return r.path.map(p=>p.clone().multiplyScalar(1.001).applyMatrix4(r.node.matrixWorld).project(camera)).map(v=>({x:(v.x+1)*640,y:(1-v.y)*360}))}
 function draw(ctx){
  for(const [id,region] of regions){
   if(!players.includes(id))continue;
   const points=project(region);
   if(points.length<3)continue;
   const lengths=points.map((point,i)=>{
    const next=points[(i+1)%points.length];
    return Math.hypot(point.x-next.x,point.y-next.y);
   });
   const total=lengths.reduce((sum,length)=>sum+length,0);
   if(!total)continue;
   function pointAt(distance){
    distance=((distance%total)+total)%total;
    let i=0;
    while(distance>lengths[i]&&i<points.length-1)distance-=lengths[i++];
    const a=points[i],b=points[(i+1)%points.length],t=distance/Math.max(.001,lengths[i]);
    return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
   }
   ctx.save();
   ctx.globalCompositeOperation='lighter';
   ctx.lineCap='round';
   for(const [player,choice] of players.entries()){
    if(choice!==id)continue;
    const color=colors[player];
    ctx.shadowColor=color;
    if(confirmed.includes(player)){
     for(let i=0;i<region.path.length;i++){
      const j=(i+1)%region.path.length;
      const a=points[i],b=points[j];
      const normalLength=.15+.06*Math.sin(time*5+i*.63);
      const outer=region.path[i].clone().add(region.path[i].clone().normalize().multiplyScalar(normalLength));
      outer.applyMatrix4(region.node.matrixWorld).project(camera);
      const x=(outer.x+1)*640,y=(1-outer.y)*360;
      const reach=Math.hypot(x-a.x,y-a.y);
      if(reach<.1)continue;
      const samples=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3));
      ctx.shadowBlur=0;
      for(let sample=0;sample<samples;sample++){
       const along=sample/samples;
       const px=a.x+(b.x-a.x)*along,py=a.y+(b.y-a.y)*along;
       for(let layer=1;layer<=3;layer++){
        const distance=layer/4;
        const cx=px+(x-a.x)*distance,cy=py+(y-a.y)*distance;
        const radius=4+distance*reach*.45;
        const light=ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
        light.addColorStop(0,color);light.addColorStop(1,color+'00');
        ctx.fillStyle=light;ctx.globalAlpha=.24*(1-distance);
        ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);
       }
      }
     }
     ctx.globalAlpha=1;ctx.shadowBlur=12;ctx.strokeStyle=color;ctx.lineWidth=2.5;
     ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
     ctx.closePath();ctx.stroke();
    }else{
     const head=(time*.22+player*.5)*total;
     ctx.strokeStyle=color;ctx.shadowBlur=9;
     for(let i=16;i>=0;i--){
      const a=pointAt(head-i*3),b=pointAt(head-(i+1)*3);
      const strength=1-i/17;
      ctx.globalAlpha=strength*strength;ctx.lineWidth=1+strength*3;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
     }
     const {x,y}=pointAt(head),glow=ctx.createRadialGradient(x,y,0,x,y,13);
     glow.addColorStop(0,'white');glow.addColorStop(.25,color);glow.addColorStop(1,color+'00');
     ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.fillStyle=glow;ctx.fillRect(x-13,y-13,26,26);
    }
   }
   ctx.restore();
  }
 }
 function pickCharacter(clientX,clientY){const fit=Math.min(innerWidth/1280,innerHeight/720),x=(clientX-(innerWidth-1280*fit)/2)/fit,y=(clientY-(innerHeight-720*fit)/2)/fit;ray.setFromCamera(new THREE.Vector2(x/640-1,1-y/360),camera);const hit=ray.intersectObjects([...regions.values()].map(r=>r.node),false)[0];if(!hit)return null;return [...regions].find(([id,r])=>r.node===hit.object&&available.has(id))?.[0]||null}
 function navigate(id,dx,dy,ids){const centers=[...regions].filter(([id])=>ids.includes(id)).map(([id,r])=>{const p=project(r);return {id,x:p.reduce((n,p)=>n+p.x,0)/p.length,y:p.reduce((n,p)=>n+p.y,0)/p.length}}),from=centers.find(p=>p.id===id);if(!from)return centers[0]?.id;return centers.filter(p=>(p.x-from.x)*dx+(p.y-from.y)*dy>3).sort((a,b)=>{const score=p=>{const x=p.x-from.x,y=p.y-from.y,d=Math.hypot(x,y),dot=(x*dx+y*dy)/d;return d/(dot**3)};return score(a)-score(b)})[0]?.id||id}
 return {setSelection,pickCharacter,navigateCharacter:navigate,draw,step:dt=>time+=dt,snapshot:()=>({fixed:true,regions:[...regions].map(([id,r])=>({id,points:r.path.length,factor:r.node.material.opacity})),players:[...players],confirmed:[...confirmed],colors})};
}
