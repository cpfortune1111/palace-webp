import json
import re


def definition_coordinates(text):
    coordinates = [320, 240]
    section = ''
    for line in text.splitlines():
        line = line.split(';', 1)[0].strip()
        if line.startswith('[') and line.endswith(']'):
            section = line[1:-1].strip().lower()
        elif section == 'info' and '=' in line:
            key, value = line.split('=', 1)
            if key.strip().lower() != 'localcoord':
                continue
            parts = value.split(',')
            for index, part in enumerate(parts[:2]):
                if not re.fullmatch(r'[+-]?\d+', part.strip()):
                    raise ValueError('Invalid character localcoord')
                number = int(part)
                if number <= 0:
                    raise ValueError('Nonpositive character localcoord')
                coordinates[index] = number
    return {'coordinateSystem': {'localcoord': coordinates,
                                 'webWorldWidth': 1280}}


def imported_coordinates(imported):
    manifest = json.loads((imported / 'manifest.json').read_text(encoding='utf-8-sig'))
    original = (imported / 'original').resolve()
    definition = (original / manifest['definition']).resolve()
    try:
        definition.relative_to(original)
    except ValueError:
        raise ValueError('Definition outside original import directory')
    return definition_coordinates(definition.read_text(encoding='utf-8-sig'))
