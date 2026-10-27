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
 "github.com/gopxl/beep/v2/vorbis"
 _ "golang.org/x/image/webp"
)

type palaceSprite struct { Group uint16 `json:"group"`; Number uint16 `json:"number"`; File string `json:"file"`; X int `json:"x"`; Y int `json:"y"`; W int `json:"w"`; H int `json:"h"`; AxisX int16 `json:"axisX"`; AxisY int16 `json:"axisY"` }
type palaceSprites struct { Sprites []palaceSprite `json:"sprites"` }
func loadPalaceSprites(filename string,preload map[[2]uint16]bool,mainThread bool)(*Sff,error){
 if s:=findActiveSff(filename);s!=nil{return s,nil}
 data,err:=os.ReadFile(filename);if err!=nil{return nil,err};var manifest palaceSprites;if err=json.Unmarshal(data,&manifest);err!=nil{return nil,err}
 s:=newSff();s.filename=filename;s.header.Version[0]=2;s.header.NumberOfPalettes=1;s.palList.SetSource(0,make([]uint32,256));s.palList.PalTable[[2]uint16{1,1}]=0
 sort.SliceStable(manifest.Sprites,func(i,j int)bool{return manifest.Sprites[i].File<manifest.Sprites[j].File})
 var page image.Image;last:=""
 for _,entry:=range manifest.Sprites{
  if preload!=nil&&!preload[[2]uint16{entry.Group,entry.Number}]{continue};if loadingCanceled(){return nil,ErrLoadingCanceled}
  if entry.W<1||entry.H<1||entry.W>16384||entry.H>16384{return nil,fmt.Errorf("invalid derivative sprite dimensions")}
  if entry.File!=last{raw,e:=os.ReadFile(entry.File);if e!=nil{return nil,e};page,_,e=image.Decode(bytes.NewReader(raw));if e!=nil{return nil,e};last=entry.File}
  rect:=image.Rect(entry.X,entry.Y,entry.X+entry.W,entry.Y+entry.H);if !rect.In(page.Bounds()){return nil,fmt.Errorf("derivative sprite exceeds atlas")}
  pixels:=image.NewRGBA(image.Rect(0,0,entry.W,entry.H));draw.Draw(pixels,pixels.Bounds(),page,rect.Min,draw.Src)
  sprite:=newSprite();sprite.Group=entry.Group;sprite.Number=entry.Number;sprite.Size=[2]uint16{uint16(entry.W),uint16(entry.H)};sprite.Offset=[2]int16{entry.AxisX,entry.AxisY};sprite.coldepth=32;sprite.palidx=0;sprite.SetRaw(pixels.Pix,int32(entry.W),int32(entry.H),32);s.sprites[[2]uint16{entry.Group,entry.Number}]=sprite
  if mainThread{sys.runMainThreadTask()}
 }
 s.header.NumberOfSprites=uint32(len(s.sprites));return s,nil
}
type palaceSoundEntry struct { Group int32 `json:"group"`; Number int32 `json:"number"`; File string `json:"file"` }
func loadPalaceSounds(filename string,keep func([2]int32)bool,max uint32)(*Snd,error){
 data,err:=os.ReadFile(filename);if err!=nil{return nil,err};var manifest struct{Sounds []palaceSoundEntry `json:"sounds"`};if err=json.Unmarshal(data,&manifest);err!=nil{return nil,err};snd:=newSnd();snd.filename=filename
 for _,entry:=range manifest.Sounds{key:=[2]int32{entry.Group,entry.Number};if !keep(key){continue};raw,e:=os.ReadFile(entry.File);if e!=nil{return nil,e};stream,format,e:=vorbis.Decode(io.NopCloser(bytes.NewReader(raw)));if e!=nil{return nil,e};snd.table[key]=&Sound{wavData:raw,format:format,length:stream.Len(),palaceCompressed:true};stream.Close();if max>0&&uint32(len(snd.table))>=max{break}}
 return snd,nil
}
func isPalaceSprites(filename string)bool{return strings.HasSuffix(filename,".pms")}
func isPalaceSounds(filename string)bool{return strings.HasSuffix(filename,".pma")}
