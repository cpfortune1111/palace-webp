"""Build authenticated, compressed, interleaved derivative-media bundles."""
import argparse, gzip, hashlib, json, pathlib, secrets, random
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def pack(files,destination):
    destination=pathlib.Path(destination)
    if destination.exists() and any(destination.iterdir()):raise ValueError('Pack destination must be empty')
    destination.mkdir(parents=True,exist_ok=True)
    key=secrets.token_bytes(32);aes=AESGCM(key);entries={};fragments=[];shared={}
    for name,value in sorted(files.items()):
        content,mime=value;compressed=gzip.compress(content,compresslevel=9,mtime=0);encoding='gzip' if len(compressed)<len(content)*.95 else 'identity';payload=compressed if encoding=='gzip' else content
        record=dict(size=len(content),sha256=hashlib.sha256(content).hexdigest(),mime=mime,encoding=encoding,parts=[]);entries[name]=record
        identity=(record['sha256'],encoding)
        if identity in shared:record['parts']=shared[identity];continue
        shared[identity]=record['parts']
        for offset in range(0,max(1,len(payload)),256*1024):
            identity=secrets.token_hex(16);iv=secrets.token_bytes(12);cipher=aes.encrypt(iv,payload[offset:offset+256*1024],identity.encode());part=dict(id=identity,iv=iv.hex(),size=len(cipher));record['parts'].append(part);fragments.append((part,cipher))
    random.SystemRandom().shuffle(fragments);bundle=bytearray();number=0;bundles=[]
    def flush():
        nonlocal bundle,number
        name='part-'+str(number).zfill(4)+'.mpak';data=bytes(bundle);(destination/name).write_bytes(data);bundles.append(dict(file=name,size=len(data),sha256=hashlib.sha256(data).hexdigest()));bundle=bytearray();number+=1
    for part,cipher in fragments:
        if bundle and len(bundle)+len(cipher)>4*1024*1024:flush()
        part['file']='part-'+str(number).zfill(4)+'.mpak';part['offset']=len(bundle);bundle.extend(cipher)
    if bundle:flush()
    iv=secrets.token_bytes(12);catalog=aes.encrypt(iv,gzip.compress(json.dumps(dict(files=entries),separators=(',',':')).encode(),mtime=0),b'palace-catalog-v1');(destination/'catalog.bin').write_bytes(catalog)
    mask=secrets.token_bytes(32);manifest=dict(version=1,algorithm='AES-256-GCM',keyParts=[bytes(a^b for a,b in zip(key,mask)).hex(),mask.hex()],index=dict(file='catalog.bin',iv=iv.hex(),sha256=hashlib.sha256(catalog).hexdigest()),bundles=bundles)
    (destination/'manifest.json').write_text(json.dumps(manifest,separators=(',',':')),encoding='utf-8')
    return dict(files=len(files),logicalBytes=sum(len(v[0]) for v in files.values()),bundleBytes=sum(x['size'] for x in bundles),bundles=len(bundles))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('input');parser.add_argument('output');a=parser.parse_args();root=pathlib.Path(a.input)
    print(pack({p.relative_to(root).as_posix():(p.read_bytes(),'application/octet-stream') for p in root.rglob('*') if p.is_file()},a.output))
