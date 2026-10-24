import argparse
from pathlib import Path

from Legacy.export_venus_turn import export


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-directory', required=True)
    parser.add_argument('--output-directory', required=True)
    args = parser.parse_args()
    export(Path(args.source_directory), Path(args.output_directory), action_ids=('120',),
           prefix='common_dust_full', source_prefix='fightfx', webp_quality=None,
           trim_transparent=True)
