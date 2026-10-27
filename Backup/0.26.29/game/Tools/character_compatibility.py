import json
import re


def parse_version(value, length, stop_on_error):
    result = [0] * length
    for index, part in enumerate(value.split('.')[:length]):
        part = part.strip()
        if not re.fullmatch(r'\d+', part) or int(part) > 65535:
            return result if stop_on_error else [0, 5]
        result[index] = int(part)
    return result


def definition_compatibility(text):
    values = {}
    section = ''
    for line in text.splitlines():
        line = line.split(';', 1)[0].strip()
        if line.startswith('[') and line.endswith(']'):
            section = line[1:-1].strip().lower()
        elif section == 'info' and '=' in line:
            key, value = line.split('=', 1)
            values[key.strip().lower()] = value.strip()
    ikemen = parse_version(values.get('ikemenversion', ''), 3, True)
    mugen = parse_version(values.get('mugenversion', ''), 2, False)
    if mugen not in ([1, 0], [1, 1]):
        mugen = [0, 5]
    active = bool(ikemen[0] or ikemen[1])
    return {'compatibility': 'ikemen' if active else 'mugen',
            'engineVersions': {'mugen': [1, 1] if active else mugen, 'ikemen': ikemen}}


def imported_compatibility(imported):
    manifest = json.loads((imported / 'manifest.json').read_text(encoding='utf-8-sig'))
    original = (imported / 'original').resolve()
    definition = (original / manifest['definition']).resolve()
    if not definition.is_relative_to(original):
        raise ValueError('Definition outside original import directory')
    return definition_compatibility(definition.read_text(encoding='utf-8-sig'))
