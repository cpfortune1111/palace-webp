import pathlib,sys
root=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);source=(root/'Engine/palace-menu.js').read_text(encoding='utf-8')
before="api.start(next,next==='training'?'infinite':options.timer,choice);api.pause(false);"
after="const pending=api.start(next,next==='training'?'infinite':options.timer,choice);if(pending&&typeof pending.then==='function')await pending;api.pause(false);"
assert source.count(before)==1
target=out/'Engine/palace-menu.js';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(source.replace(before,after),encoding='utf-8')
source=(root/'Engine/select-screen.js').read_text(encoding='utf-8');before="function hardwareFor(target){return ['SailorJupiter','SailorNeptune','SailorSaturn'].includes(choices[target])?['snes']:choices[target]==='SailorMoon'?['snes','saturn']:hardwareValues}";after=before.replace(':hardwareValues}',":hardwareValues.filter(value=>value!=='3do')}");assert source.count(before)==1;(out/'Engine/select-screen.js').write_text(source.replace(before,after),encoding='utf-8')
print('Derived optional async battle-start presentation adapter; original UI unchanged')
