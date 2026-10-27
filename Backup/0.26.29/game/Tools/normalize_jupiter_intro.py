import json
from pathlib import Path


def normalize_intro(metadata):
    actions = metadata['actions']
    if '1912' not in actions and actions['1911'][0]['item'] == 41:
        actions['1912'] = actions['1911']
        actions['1911'] = [{**actions['1911'][0], 'item': 40, 'time': -1}]
    return metadata


if __name__ == '__main__':
    path = Path('work/Char/Jupiter/Battle/jupiter_full.json')
    metadata = normalize_intro(json.loads(path.read_text(encoding='utf-8')))
    path.write_text(json.dumps(metadata, separators=(',', ':')), encoding='utf-8')
