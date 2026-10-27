import json,pathlib,shutil,sys
source=pathlib.Path(sys.argv[1]).resolve();dest=pathlib.Path(sys.argv[2]).resolve();here=pathlib.Path(__file__).resolve().parent
if dest.exists():raise SystemExit('Use a new private engine directory')
if here.parents[1]==dest or here.parents[1] in dest.parents:raise SystemExit('Native sources must remain outside the site')
shutil.copytree(source,dest)
fixes=[
('src/image.go','func (s *Sprite) isBlank() bool {','\n palaceEnsureSprite(s)'),
('src/image.go','func (s *Sprite) Draw(x, y, xscale, yscale float32, rxadd float32, rot Rotation, projectionMode int32, fLength float32, fx *PalFX, window *[4]int32) {','\n palaceEnsureSprite(s)'),
('src/anim.go','func (a *Animation) isBlank() bool {','\n palaceWarmAnimation(a)'),
('src/image.go','func loadSff(filename string, char bool, isMainThread bool, isActPal bool) (*Sff, error) {','\n if isPalaceSprites(filename){return loadPalaceSprites(filename,nil,isMainThread)}'),
('src/image.go','func preloadSff(filename string, char bool, preloadSpr map[[2]uint16]bool) (*Sff, []int32, error) {','\n if isPalaceSprites(filename){s,e:=loadPalaceSprites(filename,preloadSpr,true);return s,[]int32{1},e}'),
('src/sound.go','func LoadSndFiltered(filename string, keepItem func([2]int32) bool, max uint32) (*Snd, error) {','\n if isPalaceSounds(filename){return loadPalaceSounds(filename,keepItem,max)}'),
('src/sound.go','type Sound struct {','\n palaceCompressed bool\n palaceFile string'),
('src/sound.go','func (s *Sound) GetStreamer() beep.StreamSeeker {','\n if s.palaceCompressed{return palaceSoundStreamer(s)}'),
('src/system.go','systemScriptInit(l)','\n registerPalaceHost(l)'),
('src/system.go','func (s *System) update() bool {','\n palaceHostFrame()'),
('src/char.go','// Damage on hit\n\t\tif hitResult == 1 {','\n palaceRecordHit(c,hd.numhits)'),
('src/char.go','func (c *Char) computeDamage(damage float64, kill, absolute bool, atkmul float32, attacker *Char, bounds bool) int32 {','\n if !absolute&&damage>0{damage*=palaceDamageMultiplier(attacker,c)}')]
for name,before,addition in fixes:
 p=dest/name;text=p.read_text(encoding='utf-8');assert text.count(before)==1,name;p.write_text(text.replace(before,before+addition),encoding='utf-8',newline='\n')
p=dest/'src/sound.go';text=p.read_text(encoding='utf-8').replace('&Sound{wavData, wavfmt, s.Len()}','&Sound{wavData:wavData, format:wavfmt, length:s.Len()}');p.write_text(text,encoding='utf-8',newline='\n')
p=dest/'src/system.go';text=p.read_text(encoding='utf-8');before='p[0].lifeMax = Max(1, int32(math.Floor(float64(lmax))))';assert text.count(before)==1;text=text.replace(before,'p[0].lifeMax = Max(1, int32(math.Floor(float64(lmax)*palaceLifeScale(i))))');p.write_text(text,encoding='utf-8',newline='\n')
for p in (here/'engine').glob('*.go'):shutil.copyfile(p,dest/'src'/p.name)
print('Prepared derivative-media and host interface engine')
