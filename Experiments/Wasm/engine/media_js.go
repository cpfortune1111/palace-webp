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
 "sort"
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
 sort.SliceStable(manifest.Sprites,func(i,j int)bool{return manifest.Sprites[i].File<manifest.Sprites[j].File})
 s:=newSff();s.filename=filename;s.header.Version[0]=2;s.header.NumberOfPalettes=1;s.palList.SetSource(0,make([]uint32,256));s.palList.PalTable[[2]uint16{1,1}]=0
 for _,entry:=range manifest.Sprites{
  if preload!=nil&&!preload[[2]uint16{entry.Group,entry.Number}]{continue};if loadingCanceled(){return nil,ErrLoadingCanceled}
  if entry.W<1||entry.H<1||entry.W>16384||entry.H>16384{return nil,fmt.Errorf("invalid derivative sprite dimensions")}
  sprite:=newSprite();sprite.Group=entry.Group;sprite.Number=entry.Number;sprite.Size=[2]uint16{uint16(entry.W),uint16(entry.H)};sprite.Offset=[2]int16{entry.AxisX,entry.AxisY};sprite.coldepth=32;sprite.palidx=0;s.sprites[[2]uint16{entry.Group,entry.Number}]=sprite
  palaceSpriteSources[sprite]=&palaceSpriteSource{entry:entry,lastFrame:-10}
  palaceEnsureSprite(sprite)
  if palaceUploads%32==0{palaceLoading("Preparing character graphics")}
 }
 s.header.NumberOfSprites=uint32(len(s.sprites));return s,nil
}

// All selected-character textures are prepared before the game loop starts.
func palaceLoading(phase string){if hook:=js.Global().Get("__palaceLoading");hook.Type()==js.TypeFunction{hook.Invoke(phase,palaceUploads,palaceSoundLoads)}}
func palaceAudioContext(ctor js.Value,rate beep.SampleRate)js.Value{if context:=js.Global().Get("__palaceAudioContext");context.Type()==js.TypeObject&&context.Get("state").String()!="closed"{return context};return ctor.New(map[string]interface{}{"sampleRate":int(rate),"latencyHint":"interactive"})}
func palaceSoundCue(group,number int32,source string){if hook:=js.Global().Get("__palaceSoundCue");hook.Type()==js.TypeFunction{hook.Invoke(group,number,source)} }
type palaceSpriteSource struct{entry palaceSprite;lastFrame int64;stamp uint64;bytes int64}
type palaceAtlasPage struct{image image.Image;bytes int64;stamp uint64;lastFrame int64}
var palaceSpriteSources=map[*Sprite]*palaceSpriteSource{}
var palaceAtlasPages=map[string]*palaceAtlasPage{}
var palaceStamp uint64
var palaceGPUBytes,palaceGPUPeak,palaceAtlasBytes,palaceAtlasPeak,palaceUploads,palaceEvictions,palaceDecodes,palaceSoundLoads int64
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
 // Textures stay resident for the entire match. No combat-time eviction/reload.
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
 if glCtx.Call("isContextLost").Bool(){panic(fmt.Errorf("graphics context lost during battle preparation"))};if code:=glCtx.Call("getError").Int();code==0x0505{panic(fmt.Errorf("insufficient graphics memory to prepare complete characters"))}
 source.bytes=size;palaceGPUBytes+=size;palaceUploads++;if palaceGPUBytes>palaceGPUPeak{palaceGPUPeak=palaceGPUBytes}
}
func palaceStreamingStats()map[string]interface{}{return map[string]interface{}{"mode":"battle-ready","registeredSprites":len(palaceSpriteSources),"gpuBytes":palaceGPUBytes,"uploads":palaceUploads,"evictions":0,"soundLoads":palaceSoundLoads}}
type palaceSoundEntry struct { Group int32 `json:"group"`; Number int32 `json:"number"`; File string `json:"file"` }
func loadPalaceSounds(filename string,keep func([2]int32)bool,max uint32)(*Snd,error){
 data,err:=os.ReadFile(filename);if err!=nil{return nil,err};var manifest struct{Sounds []palaceSoundEntry `json:"sounds"`};if err=json.Unmarshal(data,&manifest);err!=nil{return nil,err};snd:=newSnd();snd.filename=filename
 for _,entry:=range manifest.Sounds{key:=[2]int32{entry.Group,entry.Number};if !keep(key){continue};raw,e:=os.ReadFile(entry.File);if e!=nil{return nil,e};stream,format,e:=vorbis.Decode(io.NopCloser(bytes.NewReader(raw)));if e!=nil{return nil,e};buffer:=beep.NewBuffer(format);buffer.Append(stream);e=stream.Err();stream.Close();if e!=nil{return nil,e};snd.table[key]=&Sound{palaceCompressed:true,palacePCM:buffer,format:format,length:buffer.Len(),palaceGroup:entry.Group,palaceNumber:entry.Number,palaceSource:filename};palaceSoundLoads++;palaceLoading("Preparing character audio");if max>0&&uint32(len(snd.table))>=max{break}}
 return snd,nil
}
func palaceSoundStreamer(sound *Sound)beep.StreamSeeker{
 palaceSoundCue(sound.palaceGroup,sound.palaceNumber,sound.palaceSource);return sound.palacePCM.Streamer(0,sound.palacePCM.Len())
}
func isPalaceSprites(filename string)bool{return strings.HasSuffix(filename,".pms")}
func isPalaceSounds(filename string)bool{return strings.HasSuffix(filename,".pma")}
