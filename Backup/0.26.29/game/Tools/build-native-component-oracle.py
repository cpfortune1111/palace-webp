"""Build a private source-extracted component oracle, not a full native engine."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess

from reference_go_scan import declaration, matching_delimiter

COMMIT = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
PINS = {'image': '0bc6c82b58d153a8ae4313290db5460275fbb4837f28cecb8fdc88ad3be3222c',
        'anim': '0385650e39a91a4c43cd02dd926b3306cf4bb88f9be7b26df572702f93b07afd',
        'common': 'd7a40673b3bfcd7f6b320747e37679431fefd1aad7040e2d1f60484e03148ac6'}

cli = argparse.ArgumentParser(description=__doc__)
for name in ('image', 'anim', 'common', 'go', 'output'):
    cli.add_argument('--' + name, required=True, type=Path)
args = cli.parse_args()
sources = {}
for name, sha in PINS.items():
    data = getattr(args, name).read_bytes()
    if hashlib.sha256(data).hexdigest() != sha:
        raise ValueError('Unpinned oracle source: ' + name)
    sources[name] = data.decode('utf-8-sig')
output = args.output.resolve()
output.mkdir(parents=True, exist_ok=True)
go = args.go.resolve()
environment = {**os.environ, 'GOENV': 'off', 'GOTOOLCHAIN': 'local', 'GO111MODULE': 'off',
               'GOPROXY': 'off', 'GOSUMDB': 'off', 'CGO_ENABLED': '0',
               'GOCACHE': str(output / 'cache'), 'GOPATH': str(output / 'gopath')}
version = subprocess.check_output([str(go), 'version'], env=environment, text=True).strip()
if not version.startswith('go version go1.27.3 '):
    raise ValueError('Oracle compiler must be pinned go1.27.3')

selected = []
for file, markers in {
    'image': ['func (s *Sprite) Rle8Decode(', 'func (s *Sprite) Rle5Decode(',
              'func (s *Sprite) Lz5Decode(', 'func (s *Sprite) readV2(',
              'type SffHeader struct ', 'func (sh *SffHeader) Read(',
              'func (s *Sprite) readHeaderV2('],
    'anim': ['type AnimFrame struct ', 'func newAnimFrame(', 'func ReadAnimFrame('],
    'common': ['func IsNumeric(', 'func Atoi(', 'func Atof('],
}.items():
    for marker in markers:
        result = declaration(sources[file], marker)
        selected.append({'source': file, 'marker': marker, 'line': result['line'],
                         'sha256': hashlib.sha256(result['text'].encode('utf-8')).hexdigest(),
                         'text': result['text']})

image = sources['image']
enum_start = image.index('type TransType int32')
enum_open = image.index('(', image.index('const (', enum_start))
enum_text = image[enum_start:matching_delimiter(image, enum_open, '(', ')')]
common = sources['common']
constant_start = common.index('const (')
constant_open = common.index('(', constant_start)
constant_text = common[constant_start:matching_delimiter(common, constant_open, '(', ')')]

wrapper = r'''package main
import("bytes"; "crypto/sha256"; "encoding/binary"; "encoding/json"; "fmt"; "image"; "image/draw"; "image/png"; "io"; "math"; "os"; "strconv"; "strings")
type diagnostic struct{Channel string; Message string}
var warnings []diagnostic
type oracleSystem struct{}
func (*oracleSystem) appendToConsole(value string){warnings=append(warnings,diagnostic{"console",value})}
var sys = &oracleSystem{}
func LogMessage(format string,values ...interface{}){warnings=append(warnings,diagnostic{"log",fmt.Sprintf(format,values...)})}
func Error(value string)error{return fmt.Errorf("%s",value)}
type Sprite struct{Size [2]uint16; Group,Number uint16; Offset [2]int16; palidx int; rle int; coldepth byte; pixels []byte; raw []byte; rawWidth,rawHeight,rawDepth int32}
func(s *Sprite)SetPxl(value []byte){s.pixels=append([]byte{},value...)}
func(s *Sprite)SetRaw(value []byte,width,height,depth int32){s.raw=append([]byte{},value...);s.rawWidth=width;s.rawHeight=height;s.rawDepth=depth}
type request struct{Kind string; Blend string; Line string; Format int; Width,Height uint16; Depth byte; Payload []byte; FilePath string; Indices []uint32}
type response struct{Type string; Alpha [2]byte; Pixels []byte; Raw []byte; RawWidth,RawHeight,RawDepth int32; Error string; Panic string; Warnings []diagnostic; Frames []response; FileSha256 string; Group,Number uint16; Offset [2]int16; Palette int; Index uint32; Present bool; FrameIntegers [7]int32; FrameFloatBits [3]uint32}
func spriteResult(sprite *Sprite)(result response){result.Pixels=sprite.pixels;result.Raw=sprite.raw;result.RawWidth=sprite.rawWidth;result.RawHeight=sprite.rawHeight;result.RawDepth=sprite.rawDepth;result.Group=sprite.Group;result.Number=sprite.Number;result.Offset=sprite.Offset;result.Palette=sprite.palidx;return}
func evaluate(value request)(result response){
 defer func(){if recovered:=recover();recovered!=nil{result.Panic=fmt.Sprint(recovered)}}()
 warnings=nil
 if value.Kind=="frame"{
  if len(value.Line)>16384{result.Error="Oracle frame fixture limit";return}
  frame,err:=ReadAnimFrame(value.Line);if err!=nil{result.Error=err.Error()}
  if frame!=nil{result.Present=true;result.FrameIntegers=[7]int32{frame.Group,frame.Number,frame.Xoffset,frame.Yoffset,frame.Time,int32(frame.Hscale),int32(frame.Vscale)};result.FrameFloatBits=[3]uint32{math.Float32bits(frame.Xscale),math.Float32bits(frame.Yscale),math.Float32bits(frame.Angle)};result.Alpha=[2]byte{frame.SrcAlpha,frame.DstAlpha};switch frame.TransType{case TT_none:result.Type="none";case TT_add:result.Type="add";case TT_sub:result.Type="sub";case TT_subadd:result.Type="subadd";default:result.Type="other"}}
 }else if value.Kind=="alpha"{
  if strings.ContainsAny(value.Blend,",\n\r"){result.Error="Oracle alpha fixture excludes frame separators";return}
  frame,err:=ReadAnimFrame("0,0,0,0,1,,"+value.Blend)
  if err!=nil{result.Error=err.Error()}
  if frame!=nil{result.Alpha=[2]byte{frame.SrcAlpha,frame.DstAlpha};switch frame.TransType{case TT_none:result.Type="none";case TT_add:result.Type="add";case TT_sub:result.Type="sub";case TT_subadd:result.Type="subadd";default:result.Type="other"}}
 }else if value.Kind=="sprite"{
  if int(value.Width)*int(value.Height)>1048576||len(value.Payload)>16*1024*1024{result.Error="Oracle fixture limit";return}
  sprite:=Sprite{Size:[2]uint16{value.Width,value.Height},rle:-value.Format,coldepth:value.Depth}
  if err:=sprite.readV2(bytes.NewReader(value.Payload),0,uint32(len(value.Payload)));err!=nil{result.Error=err.Error()}
  savedError:=result.Error;result=spriteResult(&sprite);result.Error=savedError
 }else if value.Kind=="container"{
  data,err:=os.ReadFile(value.FilePath);if err!=nil{result.Error=err.Error();return}
  if len(data)>512*1024*1024||len(value.Indices)>64{result.Error="Oracle container fixture limit";return}
  result.FileSha256=fmt.Sprintf("%x",sha256.Sum256(data));reader:=bytes.NewReader(data)
  var header SffHeader;var lofs,tofs uint32
  if err:=header.Read(reader,&lofs,&tofs);err!=nil{result.Error=err.Error();return}
  if header.Version[0]!=2{result.Error="Oracle container fixture requires SFF v2";return}
  for _,index:=range value.Indices{
   if index>=header.NumberOfSprites{result.Error="Oracle fixture sprite index out of range";return}
   reader.Seek(int64(header.FirstSpriteHeaderOffset)+int64(index)*28,io.SeekStart)
   sprite:=Sprite{};var offset,size uint32;var link uint16
   if err:=sprite.readHeaderV2(reader,&offset,&size,lofs,tofs,&link);err!=nil{result.Error=err.Error();return}
   if size==0{result.Error="Oracle physical-sprite fixture excludes links";return}
   if int(sprite.Size[0])*int(sprite.Size[1])>1048576{result.Error="Oracle pixel fixture limit";return}
   if err:=sprite.readV2(reader,int64(offset),size);err!=nil{result.Error=err.Error();return}
   frame:=spriteResult(&sprite);frame.Index=index;result.Frames=append(result.Frames,frame)
  }
 }else{result.Error="Unknown oracle component"}
 result.Warnings=warnings
 return
}
func main(){var input []request;if err:=json.NewDecoder(os.Stdin).Decode(&input);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(2)};result:=make([]response,len(input));for i,value:=range input{result[i]=evaluate(value)};if err:=json.NewEncoder(os.Stdout).Encode(result);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(2)}}
'''
generated = wrapper + '\n' + enum_text + '\n' + constant_text + '\n' + '\n\n'.join(row['text'] for row in selected)
source_file = output / 'oracle.go'
source_file.write_text(generated, encoding='utf-8')
executable = output / ('native-component-oracle.exe' if os.name == 'nt' else 'native-component-oracle')
subprocess.run([str(go), 'build', '-trimpath', '-o', str(executable), str(source_file)], env=environment, cwd=output, check=True, timeout=180)
receipt = {'scope': 'Unmodified extracted function bodies with facade Sprite/renderer/error/log dependencies. Component oracle only; not full native scheduling, assets, rendering or engine certification.',
           'commit': COMMIT, 'compiler': version, 'sourcePins': PINS,
           'functions': [{key: value for key, value in row.items() if key != 'text'} for row in selected],
           'generatedSourceSha256': hashlib.sha256(source_file.read_bytes()).hexdigest(),
           'executableSha256': hashlib.sha256(executable.read_bytes()).hexdigest(),
           'executable': str(executable), 'facades': ['Sprite decoded-byte capture instead of texture upload', 'error constructor', 'console/log capture'],
           'limits': 'Frame metadata, alpha and decoded-pixel fixtures only; frame lines at most 16384 bytes, no file separators in alpha, at most 1048576 pixels or 16 MiB direct payload. Physical SFF v2 fixture samples at most 64 indices and 512 MiB per source; complete AIR file policy/animation execution, linked sprites, palette/GPU behavior and file recovery are not certified.'}
(output / 'build-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
print('PASS built pinned source-extracted alpha/frame/sprite component oracle with '+str(len(selected))+' unchanged declarations')
