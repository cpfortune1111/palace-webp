import math
import struct


def attack_distance_constants(text):
    result = {}
    section = ''
    seen = set()
    names = {prefix + suffix for prefix in ('attack.dist', 'proj.attack.dist')
             for suffix in ('', '.width', '.height', '.depth')}
    for raw_line in text.splitlines():
        line = raw_line.split(';', 1)[0].strip()
        if line.startswith('[') and line.endswith(']'):
            section = line[1:-1].strip().lower()
            continue
        if section != 'size' or '=' not in line:
            continue
        key, value = (part.strip() for part in line.split('=', 1))
        key = key.lower()
        if key not in names or key in seen:
            continue
        seen.add(key)
        count = 1 if key.endswith('attack.dist') else 2
        components = value.split(',')[:count]
        for index, component in enumerate(components):
            if not component.strip():
                continue
            number = float(component)
            if not math.isfinite(number):
                raise ValueError('Nonfinite Size attack distance: ' + key)
            number = struct.unpack('f', struct.pack('f', number))[0]
            if not math.isfinite(number):
                raise ValueError('Overflowing Size attack distance: ' + key)
            target = 'size.' + key
            if count == 2:
                target += '.' + ('x', 'y')[index]
            result[target] = number
    return result


def update_attack_distance_constants(constants, text):
    for prefix in ('size.attack.dist', 'size.proj.attack.dist'):
        constants.pop(prefix, None)
        for axis in ('width', 'height', 'depth'):
            for suffix in ('', '.x', '.y'):
                constants.pop(prefix + '.' + axis + suffix, None)
    constants.update(attack_distance_constants(text))
    return constants
