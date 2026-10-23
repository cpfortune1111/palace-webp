import re
import struct


def parse_stage_reflection(definition):
    values = {}
    active = False
    for raw in definition.lstrip('\ufeff').splitlines():
        line = raw.split(';', 1)[0].strip()
        if line.startswith('[') and line.endswith(']'):
            active = line[1:-1].strip().lower() == 'reflection'
        elif active and '=' in line:
            name, value = line.split('=', 1)
            values[name.strip().lower()] = value.strip()

    def integer(name, default):
        if name not in values:
            return default
        if not re.fullmatch(r'[+-]?\d+', values[name]):
            raise ValueError('Unsupported reflection integer syntax: ' + name)
        return int(values[name])

    def scalar(name):
        return struct.unpack('<f', struct.pack('<f', float(values.get(name, 1))))[0]

    return {
        'intensity': max(0, min(255, integer('intensity', 0))),
        'xscale': scalar('xscale'),
        'yscale': scalar('yscale'),
        'layerno': max(-1, min(0, integer('layerno', 0))),
    }
