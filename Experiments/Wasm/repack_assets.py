"""Authenticate and compact an experimental pack into fresh bounded shards."""
import gzip, hashlib, json, mimetypes, pathlib, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from pack_assets import pack

def read_files(folder):
    folder=pathlib.Path(folder)
    manifest=json.loads((folder/'manifest.json').read_text(encoding='utf-8'))
    key=bytes(a^b for a,b in zip(*(bytes.fromhex(v) for v in manifest['keyParts'])))
    aes=AESGCM(key)
    cipher=(folder/manifest['index']['file']).read_bytes()
    assert hashlib.sha256(cipher).hexdigest()==manifest['index']['sha256']
    catalog=json.loads(gzip.decompress(aes.decrypt(bytes.fromhex(manifest['index']['iv']),cipher,b'palace-catalog-v1')))
    files={}
    for name,entry in catalog['files'].items():
        path=pathlib.PurePosixPath(name)
        if path.is_absolute() or '..' in path.parts or path.suffix.lower() in ('.sff','.snd'):
            raise ValueError('Forbidden pack path: '+name)
        chunks=[]
        for part in entry['parts']:
            with (folder/part['file']).open('rb') as stream:
                stream.seek(part['offset']);encrypted=stream.read(part['size'])
            chunks.append(aes.decrypt(bytes.fromhex(part['iv']),encrypted,part['id'].encode()))
        raw=b''.join(chunks)
        if entry['encoding']=='gzip':raw=gzip.decompress(raw)
        assert len(raw)==entry['size'] and hashlib.sha256(raw).hexdigest()==entry['sha256'],name
        files[name]=(raw,entry['mime'])
    return files

if __name__=='__main__':
    files=read_files(sys.argv[1])
    if len(sys.argv)>3:
        additions=pathlib.Path(sys.argv[3])
        for source in additions.rglob('*'):
            if source.is_file():
                name=source.relative_to(additions).as_posix()
                if source.suffix.lower() in ('.sff','.snd'):raise ValueError('Original archives are forbidden: '+name)
                files[name]=(source.read_bytes(),mimetypes.guess_type(source.name)[0] or 'application/octet-stream')
    result=pack(files,sys.argv[2])
    pathlib.Path(sys.argv[2],'build-summary.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result))
