import json
import re
import struct
from pathlib import Path
from export_venus_turn import export
from PIL import Image

source = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace\data')
export(source.parent / 'chars/SailorVenus', Path('work'), ('170', '181', '190', '191', '1910', '1911'), 'venus_round')
export(source, Path('work'), tuple(str(value) for value in range(930, 936)), 'round_fx', 'fightfx')
definition = (source / 'fight.def').read_text(encoding='utf-8-sig')
section = definition.split('[Round]', 1)[1].split('[Begin Action', 1)[0]
values = dict(re.findall(r'^([\w.]+)\s*=\s*(\d+)\s*$', section, re.M))
config = {target: int(values[key]) for target, key in [('matchWins', 'match.wins'), ('maxDraws', 'match.maxdrawgames'), ('startWait', 'start.waittime'), ('controlWait', 'ctrl.time'), ('overWait', 'over.waittime'), ('overTime', 'over.time'), ('winTime', 'win.time')]}
Path('work/round_flow.json').write_text(json.dumps(config))
lines = []
active = False
for line in definition.splitlines():
    if line.strip().startswith('['):
        active = bool(re.match(r'\[Begin Action (80|200)\]', line, re.I))
    if active:
        lines.append(line)
scratch = Path('work/fight-hud-source')
(scratch / 'fight.air').write_text('\n'.join(lines), encoding='utf-8')
export(scratch, Path('work'), ('80', '200'), 'round_hud', 'fight')
atlas = Image.open('work/round_hud_atlas.png').convert('RGBA')
atlas.save('work/round_hud_atlas.webp', lossless=True, exact=True)
assert Image.open('work/round_hud_atlas.webp').convert('RGBA').tobytes() == atlas.tobytes()
sound = (source / 'fight.snd').read_bytes()
count, offset = struct.unpack_from('<2I', sound, 16)
destination = Path('work/round-sounds')
destination.mkdir(exist_ok=True)
for index in range(count):
    next_offset, size, group, item = struct.unpack_from('<4I', sound, offset)
    if (group, item) in [(0, 1), (0, 2), (0, 3), (1, 0), (2, 0), (2, 1), (2, 2)]:
        payload = sound[offset + 16:offset + 16 + size]
        if payload[:4] != b'RIFF':
            raise ValueError('Expected WAV')
        (destination / f'{group}-{item}.wav').write_bytes(payload)
    offset = next_offset
sound = (source.parent / 'chars/SailorVenus/venus.snd').read_bytes()
count, offset = struct.unpack_from('<2I', sound, 16)
for index in range(count):
    next_offset, size, group, item = struct.unpack_from('<4I', sound, offset)
    if (group, item) in [(170, 0), (180, 0), (180, 1), (190, 0), (190, 1)]:
        payload = sound[offset + 16:offset + 16 + size]
        if payload[:4] != b'RIFF':
            raise ValueError('Expected character WAV')
        (Path('work/battle-sounds') / f'{group}-{item}.wav').write_bytes(payload)
    offset = next_offset
