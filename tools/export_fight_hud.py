import json
import shutil
from pathlib import Path
from export_venus_turn import export

source = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace')
output = Path('work')
scratch = output / 'fight-hud-source'
scratch.mkdir(exist_ok=True)
shutil.copyfile(source / 'data/fight.sff', scratch / 'fight.sff')
definition = (source / 'data/fight.def').read_text(encoding='utf-8-sig')
actions = []
active = False
for line in definition.splitlines():
    if line.strip().startswith('['):
        active = line.lower().startswith('[begin action 1001]') or line.lower().startswith('[begin action 1311]')
    if active:
        actions.append(line)
for animation, group, item in [(11, 11, 1), (12, 12, 1), (60, 60, 0), (51, 51, 0)]:
    actions.extend([f'[Begin Action {animation}]', f'{group},{item},0,0,-1'])
(scratch / 'fight.air').write_text('\n'.join(actions), encoding='utf-8')
export(scratch, output, ('1001', '1311', '11', '12', '60', '51'), 'fight_hud', 'fight')
shutil.copyfile(source / 'font/timer.sff', scratch / 'timer.sff')
(scratch / 'timer.air').write_text('\n'.join(f'[Begin Action {digit}]\n3,{48+digit},0,0,-1' for digit in range(10)), encoding='utf-8')
export(scratch, output, tuple(str(digit) for digit in range(10)), 'timer_hud', 'timer')
