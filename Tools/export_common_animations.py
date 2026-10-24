import argparse
import re
from pathlib import Path

from Legacy.export_venus_turn import export


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-directory', required=True)
    parser.add_argument('--output-directory', required=True)
    args = parser.parse_args()
    source = Path(args.source_directory)
    air = (source / 'fightfx.air').read_text(encoding='utf-8-sig')
    actions = tuple(dict.fromkeys(re.findall(r'^\s*\[Begin\s+Action\s+(\d+)\]', air, re.I | re.M)))
    if not actions:
        raise ValueError('No common animations found')
    export(source, Path(args.output_directory), action_ids=actions,
           prefix='common_animations_full', source_prefix='fightfx', webp_quality=None,
           blank_pairs=(), trim_transparent=True)
