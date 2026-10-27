import json, pathlib, sys
root=pathlib.Path(sys.argv[1]).resolve()
for fix in json.loads(pathlib.Path(__file__).with_name('port-fixes.json').read_text()):
    target=root/fix['path'];text=target.read_text(encoding='utf-8')
    if text.count(fix['before'])!=1:raise ValueError('Patch context mismatch: '+fix['path'])
    target.write_text(text.replace(fix['before'],fix['after']),encoding='utf-8',newline='\n')
print('Applied verified browser compatibility fixes')
