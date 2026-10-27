from pathlib import Path
from export_venus_turn import export

scratch = Path('work/title-source')
definition = Path(r'F:\Ikemen_GO-dev-windows\Moon Palace\data\system.def').read_text(encoding='utf-8-sig')
lines = []
active = False
for line in definition.splitlines():
    if line.strip().startswith('['):
        active = any(line.lower().startswith(f'[begin action {action}]') for action in (0, 21, 30))
    if active:
        lines.append(line)
(scratch / 'system.air').write_text('\n'.join(lines), encoding='utf-8')
export(scratch, Path('work'), ('0', '21', '30'), 'title_animation', 'system')
