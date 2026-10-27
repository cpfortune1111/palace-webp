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

    def scalar(name, default=1):
        return struct.unpack('<f', struct.pack('<f', float(values.get(name, default))))[0]

    color = [255, 255, 255]
    if 'color' in values:
        components = values['color'].split(',')
        if len(components) > 3:
            raise ValueError('Unsupported reflection color component count')
        color = [0, 0, 0]
        for channel, component in enumerate(components):
            if not re.fullmatch(r'[+-]?\d+', component.strip()):
                raise ValueError('Unsupported reflection color integer syntax')
            color[channel] = max(0, min(255, int(component)))

    window = [0, 0, 0, 0]
    if 'window' in values:
        components = values['window'].split(',')
        if len(components) > 4:
            raise ValueError('Unsupported reflection window component count')
        for index, component in enumerate(components):
            window[index] = struct.unpack('<f', struct.pack('<f', float(component)))[0]

    return {
        'intensity': max(0, min(255, integer('intensity', 0))),
        'color': color,
        'xscale': scalar('xscale'),
        'yscale': scalar('yscale'),
        'layerno': max(-1, min(0, integer('layerno', 0))),
        'angle': scalar('angle', 0),
        'xangle': scalar('xangle', 0),
        'yangle': scalar('yangle', 0),
        'window': window,
    }
