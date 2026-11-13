import * as THREE from 'three';

export function createDiscoBloom(renderer) {
 const source=new THREE.WebGLRenderTarget(1,1,{samples:4});
 const blur=new THREE.WebGLRenderTarget(1,1,{depthBuffer:false});
 const settings={value:new THREE.Vector4(1.5,2,2,.5)};
 const tint={value:new THREE.Color(0xffffff)},limit={value:0};
 const scene=new THREE.Scene(),camera=new THREE.Camera();
 const vertexShader=`varying vec2 uvScreen;
 void main(){uvScreen=uv;gl_Position=vec4(position.xy,0.,1.);}`;
 const material=new THREE.ShaderMaterial({
  depthTest:false,depthWrite:false,
  uniforms:{image:{value:source.texture},stepSize:{value:new THREE.Vector2()},settings},
  vertexShader,
  fragmentShader:`varying vec2 uvScreen;
  uniform sampler2D image;uniform vec2 stepSize;uniform vec4 settings;
  void main(){
   vec3 sum=vec3(0.);float weightSum=0.;
   for(int i=-6;i<=6;i++){
    float x=float(i),w=exp(-x*x/16.);
    vec3 c=texture2D(image,uvScreen+x*stepSize).rgb;
    float peak=max(c.r,max(c.g,c.b)),k=max(.001,settings.y);
    sum+=c*smoothstep(settings.x-k,settings.x+k,peak)*w;weightSum+=w;
   }
   gl_FragColor=vec4(sum/weightSum,1.);
  }`
 });
 const composite=new THREE.ShaderMaterial({
  transparent:true,depthTest:false,depthWrite:false,
  uniforms:{image:{value:source.texture},blurred:{value:blur.texture},stepSize:{value:new THREE.Vector2()},settings,tint,limit},
  vertexShader,
  fragmentShader:`varying vec2 uvScreen;
  uniform sampler2D image,blurred;uniform vec2 stepSize;
  uniform vec4 settings;uniform vec3 tint;uniform float limit;
  void main(){
   vec4 base=texture2D(image,uvScreen);
   vec3 sum=vec3(0.);float weightSum=0.;
   for(int i=-6;i<=6;i++){
    float x=float(i),w=exp(-x*x/16.);
    sum+=texture2D(blurred,uvScreen+x*stepSize).rgb*w;weightSum+=w;
   }
   vec3 glow=sum/weightSum*settings.w*4.*tint;
   if(limit>0.)glow=min(glow,vec3(limit));
   float alpha=max(base.a,clamp(max(glow.r,max(glow.g,glow.b)),0.,1.));
   gl_FragColor=vec4((base.rgb+glow)/max(alpha,.00001),alpha);
   #include <colorspace_fragment>
  }`
 });
 const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);scene.add(quad);
 const size=new THREE.Vector2(),clear=new THREE.Color();
 return {
  tune({glow,color,clamp}){settings.value.fromArray(glow);tint.value.set(color);limit.value=clamp},
  draw(ball,cameraBall){
   const [,,radius,intensity]=settings.value;
   if(intensity<=0||radius<=0){renderer.render(ball,cameraBall);return}
   renderer.getDrawingBufferSize(size);
   if(source.width!==size.x||source.height!==size.y){
    source.setSize(size.x,size.y);blur.setSize(Math.max(1,size.x>>1),Math.max(1,size.y>>1));
   }
   renderer.getClearColor(clear);const alpha=renderer.getClearAlpha();
   renderer.setClearColor(0,0);renderer.setRenderTarget(source);renderer.clear();
   renderer.render(ball,cameraBall);
   material.uniforms.stepSize.value.set(radius/1280,0);
   quad.material=material;renderer.setRenderTarget(blur);renderer.render(scene,camera);
   composite.uniforms.stepSize.value.set(0,radius/720);
   quad.material=composite;renderer.setRenderTarget(null);renderer.setClearColor(clear,alpha);
   renderer.render(scene,camera);
  }
 };
}
