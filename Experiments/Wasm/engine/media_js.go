//go:build js

package main

import (
 "bytes"
 "encoding/json"
 "fmt"
 "image"
 "image/draw"
 "io"
 "os"
 "strings"
 "syscall/js"
 "github.com/gopxl/beep/v2"
 "github.com/gopxl/beep/v2/vorbis"
 _ "golang.org/x/image/webp"
)

type palaceSprite struct { Group uint16 `json:"group"`; Number uint16 `json:"number"`; File string `json:"file"`; X int `json:"x"`; Y int `json:"y"`; W int `json:"w"`; H int `json:"h"`; AxisX int16 `json:"axisX"`; AxisY int16 `json:"axisY"` }
type palaceSprites struct { Sprites []palaceSprite `json:"sprites"` }
func loadPalaceSprites(filename string,preload map[[2]uint16]bool,mainThread bool)(*Sff,error){
 if s:=findActiveSff(filename);s!=nil{return s,nil}
 data,err:=os.ReadFile(filename);if err!=nil{return nil,err};var manifest palaceSprites;if err=json.Unmarshal(data,&manifest);err!=nil{return nil,err}
 s:=newSff();s.filename=filename;s.header.Version[0]=2;s.header.NumberOfPalettes=1;s.palList.SetSource(0,make([]uint32,256));s.palList.PalTable[[2]uint16{1,1}]=0
 for _,entry:=range manifest.Sprites{
  if preload!=nil&&!preload[[2]uint16{entry.Group,entry.Number}]{continue};if loadingCanceled(){return nil,ErrLoadingCanceled}
  if entry.W<1||entry.H<1||entry.W>16384||entry.H>16384{return nil,fmt.Errorf("invalid derivative sprite dimensions")}
  sprite:=newSprite();sprite.Group=entry.Group;sprite.Number=entry.Number;sprite.Size=[2]uint16{uint16(entry.W),uint16(entry.H)};sprite.Offset=[2]int16{entry.AxisX,entry.AxisY};sprite.coldepth=32;sprite.palidx=0;s.sprites[[2]uint16{entry.Group,entry.Number}]=sprite
  palaceSpriteSources[sprite]=&palaceSpriteSource{entry:entry,lastFrame:-10}
 }
 s.header.NumberOfSprites=uint32(len(s.sprites));return s,nil
}

// Only rendered frames become GPU textures. Parsing an AIR must not upload it.
type palaceSpriteSource struct{entry palaceSprite;lastFrame int64;stamp uint64;bytes int64}
type palaceAtlasPage struct{image image.Image;bytes int64;stamp uint64;lastFrame int64}
var palaceSpriteSources=map[*Sprite]*palaceSpriteSource{}
var palaceAtlasPages=map[string]*palaceAtlasPage{}
var palacePrefetched=map[string]bool{}
var palaceStamp uint64
var palaceGPUBytes,palaceGPUPeak,palaceAtlasBytes,palaceAtlasPeak,palaceUploads,palaceEvictions,palaceDecodes,palaceSoundLoads int64
const palaceGPUBudget int64=192*1024*1024
const palaceAtlasBudget int64=128*1024*1024

func palaceAtlas(file string)image.Image{
 palaceStamp++
 if page:=palaceAtlasPages[file];page!=nil{page.stamp=palaceStamp;page.lastFrame=int64(sys.frameCounter);return page.image}
 raw,err:=os.ReadFile(file);if err!=nil{panic(err)}
 decoded,_,err:=image.Decode(bytes.NewReader(raw));if err!=nil{panic(err)}
 size:=int64(decoded.Bounds().Dx())*int64(decoded.Bounds().Dy())*4
 for palaceAtlasBytes+size>palaceAtlasBudget&&len(palaceAtlasPages)>0{
  oldest:="";var stamp uint64=^uint64(0)
  for name,page:=range palaceAtlasPages{if page.lastFrame+2<int64(sys.frameCounter)&&page.stamp<stamp{oldest,stamp=name,page.stamp}}
  if oldest==""{break}
  palaceAtlasBytes-=palaceAtlasPages[oldest].bytes;delete(palaceAtlasPages,oldest)
 }
 palaceAtlasPages[file]=&palaceAtlasPage{decoded,size,palaceStamp,int64(sys.frameCounter)};palaceAtlasBytes+=size;palaceDecodes++
 if palaceAtlasBytes>palaceAtlasPeak{palaceAtlasPeak=palaceAtlasBytes};return decoded
}
func palaceEnsureSprite(sprite *Sprite){
 source:=palaceSpriteSources[sprite];if source==nil{return}
 palaceStamp++;source.stamp=palaceStamp;source.lastFrame=int64(sys.frameCounter)
 if page:=palaceAtlasPages[source.entry.File];page!=nil{page.lastFrame=int64(sys.frameCounter)}
 if sprite.Tex!=nil{return}
 entry:=source.entry
 size:=int64(entry.W)*int64(entry.H)*4
 // Keep current/recent draw-list textures alive, even if the live set exceeds the target.
 for palaceGPUBytes+size>palaceGPUBudget{
  var victim *Sprite;var oldest uint64=^uint64(0)
  for candidate,item:=range palaceSpriteSources{if candidate.Tex!=nil&&item.lastFrame+2<int64(sys.frameCounter)&&item.stamp<oldest{victim,oldest=candidate,item.stamp}}
  if victim==nil{break}
  if texture,ok:=victim.Tex.(*Texture_WebGL2);ok{glDeleteTexture(texture.handle)}
  victim.Tex=nil;palaceGPUBytes-=palaceSpriteSources[victim].bytes;palaceEvictions++
 }
 decoder:=js.Global().Get("__palaceDecodeSprite")
 if decoder.Type()==js.TypeFunction{
  type result struct{bitmap js.Value;err string};ready:=make(chan result,1)
  callback:=js.FuncOf(func(this js.Value,args []js.Value)interface{}{if args[0].Type()==js.TypeString{ready<-result{err:args[0].String()}}else{ready<-result{bitmap:args[1]}};return nil})
  decoder.Invoke(entry.File,entry.X,entry.Y,entry.W,entry.H,callback);value:=<-ready;callback.Release();if value.err!=""{panic(fmt.Errorf("sprite decode: %s",value.err))}
  texture:=gfx.newTexture(int32(entry.W),int32(entry.H),32,sys.cfg.Video.RGBSpriteBilinearFilter).(*Texture_WebGL2);texture.SetDataFromTexImageSource(value.bitmap);value.bitmap.Call("close");sprite.Tex=texture
 }else{
  page:=palaceAtlas(entry.File);rect:=image.Rect(entry.X,entry.Y,entry.X+entry.W,entry.Y+entry.H)
  if !rect.In(page.Bounds()){panic(fmt.Errorf("derivative sprite exceeds atlas: %s",entry.File))}
  pixels:=image.NewRGBA(image.Rect(0,0,entry.W,entry.H));draw.Draw(pixels,pixels.Bounds(),page,rect.Min,draw.Src)
  sprite.Tex=gfx.newTexture(int32(entry.W),int32(entry.H),32,sys.cfg.Video.RGBSpriteBilinearFilter);sprite.Tex.SetData(pixels.Pix)
 }
 source.bytes=size;palaceGPUBytes+=size;palaceUploads++;if palaceGPUBytes>palaceGPUPeak{palaceGPUPeak=palaceGPUBytes}
}
func palaceWarmAnimation(animation *Animation){
 if animation==nil||animation.sff==nil||animation.spr==nil{return}
 palaceEnsureSprite(animation.spr)
 // Warm nearby frames only on an already decoded atlas; no speculative network reads.
 for offset:=1;offset<=3;offset++{
  index:=int(animation.curelem)+offset;if index>=len(animation.frames){break}
  frame:=animation.frames[index];group,number:=frame.Group,frame.Number
  if mapping,ok:=animation.remap[group];ok{if remapped,ok:=mapping[number];ok{group,number=remapped[0],remapped[1]}}
  sprite:=animation.sff.GetSprite(uint16(group),uint16(number));source:=palaceSpriteSources[sprite]
  if source!=nil{cached:=palaceAtlasPages[source.entry.File]!=nil;check:=js.Global().Get("__palaceAtlasReady");if check.Type()==js.TypeFunction{cached=check.Invoke(source.entry.File).Bool()};if cached{palaceEnsureSprite(sprite)}else if !palacePrefetched[source.entry.File]{prefetch:=js.Global().Get("__palacePrefetch");if prefetch.Type()==js.TypeFunction{palacePrefetched[source.entry.File]=true;prefetch.Invoke(source.entry.File)}}}
 }
}
func palaceStreamingStats()map[string]interface{}{stats:=js.Global().Get("__palaceImageStats");if stats.Type()==js.TypeObject&&js.Global().Get("__palaceDecodeSprite").Type()==js.TypeFunction{palaceAtlasBytes=int64(stats.Get("bytes").Int());palaceAtlasPeak=int64(stats.Get("peak").Int());palaceDecodes=int64(stats.Get("decodes").Int())};return map[string]interface{}{"registeredSprites":len(palaceSpriteSources),"gpuBytes":palaceGPUBytes,"gpuPeak":palaceGPUPeak,"gpuBudget":palaceGPUBudget,"atlasBytes":palaceAtlasBytes,"atlasPeak":palaceAtlasPeak,"uploads":palaceUploads,"evictions":palaceEvictions,"atlasDecodes":palaceDecodes,"soundLoads":palaceSoundLoads}}
type palaceSoundEntry struct { Group int32 `json:"group"`; Number int32 `json:"number"`; File string `json:"file"` }
func loadPalaceSounds(filename string,keep func([2]int32)bool,max uint32)(*Snd,error){
 data,err:=os.ReadFile(filename);if err!=nil{return nil,err};var manifest struct{Sounds []palaceSoundEntry `json:"sounds"`};if err=json.Unmarshal(data,&manifest);err!=nil{return nil,err};snd:=newSnd();snd.filename=filename
 for _,entry:=range manifest.Sounds{key:=[2]int32{entry.Group,entry.Number};if !keep(key){continue};snd.table[key]=&Sound{palaceCompressed:true,palaceFile:entry.File};if max>0&&uint32(len(snd.table))>=max{break}}
 return snd,nil
}
func palaceSoundStreamer(sound *Sound)beep.StreamSeeker{
 if sound.wavData==nil{raw,err:=os.ReadFile(sound.palaceFile);if err!=nil{panic(err)};sound.wavData=raw;palaceSoundLoads++}
 stream,format,err:=vorbis.Decode(io.NopCloser(bytes.NewReader(sound.wavData)));if err!=nil{panic(err)}
 sound.format=format;sound.length=stream.Len();return stream
}
func isPalaceSprites(filename string)bool{return strings.HasSuffix(filename,".pms")}
func isPalaceSounds(filename string)bool{return strings.HasSuffix(filename,".pma")}
