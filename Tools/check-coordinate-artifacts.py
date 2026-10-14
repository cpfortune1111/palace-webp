import json
from pathlib import Path

from character_coordinates import imported_coordinates


workspace = Path(__file__).resolve().parents[2]
for name, relative in (
    ('venus', 'Char/Venus/venus_battle200.json'),
    ('moon', 'Char/Moon/Battle/moon_runtime.json'),
    ('jupiter', 'Char/Jupiter/Battle/jupiter_runtime.json'),
    ('neptune', 'Char/Neptune/Battle/neptune_runtime.json'),
    ('saturn', 'Char/Saturn/Battle/saturn_runtime.json'),
):
    exported = json.loads((workspace / 'work' / relative).read_text(encoding='utf-8-sig'))
    expected = imported_coordinates(workspace / 'outputs' / name)
    assert exported['coordinateSystem'] == expected['coordinateSystem'], name
print('All five runtime coordinate artifacts agree with their original imported character definitions')
