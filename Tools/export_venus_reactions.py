import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / 'Legacy'))
from export_venus_turn import export

export(Path('outputs/venus/original'), Path('work/Char/Venus'), ('5700', '5800'),
       'venus_reactions_full', 'venus', webp_quality=85)
