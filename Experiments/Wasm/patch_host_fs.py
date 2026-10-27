import pathlib,sys
source=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);text=source.read_text(encoding='utf-8')
before='if (l.compSize === 0 && l.size === 0) {'
after='if (l.provider) { data = await l.provider(); if (data.length !== l.size) throw new Error("external asset size mismatch"); } else '+before
assert text.count(before)==1;text=text.replace(before,after)
before='globalThis.mountZip = mountZip;'
after='''globalThis.mountExternalFiles = function(entries, mountPoint, provider) {
 mountPoint = absPath(mountPoint); mkdirAt(mountPoint);
 for (const [name,entry] of Object.entries(entries)) {
  if (name.startsWith('/') || name.split('/').includes('..')) throw new Error('Invalid virtual asset path');
  setFileAt(mountPoint + '/' + name, makeLazyFile({size:entry.size,compSize:0,provider:()=>provider(name)}));
 }
};
 globalThis.mountZip = mountZip;'''
assert text.count(before)==1;out.write_text(text.replace(before,after),encoding='utf-8',newline='\n')
