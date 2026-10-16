import json
import math
import struct


def native_atof(value):
    value = value.strip()
    if not value:
        return 0.0
    digits = value[1:] if value[0] in '-+' else value
    number = 0.0
    position = 0
    decimal = 0
    while position < len(digits):
        character = digits[position]
        if character == '.':
            if decimal:
                break
            decimal = position + 1
        elif '0' <= character <= '9':
            number = number * 10 + (ord(character) - ord('0'))
        else:
            break
        position += 1
    exponent = 0.0
    if position + 1 < len(digits) and digits[position] in 'eE':
        cursor = position + 1
        if digits[cursor] in '-+':
            cursor += 1
        while cursor < len(digits) and '0' <= digits[cursor] <= '9':
            exponent = exponent * 10 + (ord(digits[cursor]) - ord('0'))
            cursor += 1
        if exponent:
            if value[position + 1] == '-':
                exponent *= -1
            if not decimal:
                decimal = position
    if decimal:
        integer = int(exponent) if math.isfinite(exponent) and -(2 ** 63) <= exponent < 2 ** 63 else -(2 ** 63)
        power = decimal - position + integer
        factor = math.inf if power > 308 else 0.0 if power < -323 else 10.0 ** power
        number *= factor
    return -number if value[0] == '-' else number


def float32_json(value):
    try:
        value = struct.unpack('f', struct.pack('f', value))[0]
    except OverflowError:
        value = math.copysign(math.inf, value)
    if math.isnan(value):
        return 'NaN'
    if math.isinf(value):
        return '-Infinity' if value < 0 else 'Infinity'
    return value


def constants_section(text):
    lines = [line.strip() for line in text.splitlines()]
    for index, raw in enumerate(lines):
        header = raw.split(';', 1)[0].strip()
        if not header.startswith('[') or not header.endswith(']'):
            continue
        name = header[1:header.index(']')]
        space = name.find(' ')
        if (name[:space + 1] if space >= 0 else name).lower() != 'constants':
            continue
        result = {}
        for raw in lines[index + 1:]:
            if raw.startswith('['):
                break
            line = raw.split(';', 1)[0].strip()
            positions = [line.find(character) for character in '= \t' if character in line]
            boundary = min(positions) if positions else -1
            if boundary <= 0:
                continue
            key = line[:boundary].lower()
            if key not in result:
                value = line.split('=', 1)[1].strip() if '=' in line else ''
                result[key] = float32_json(native_atof(value))
        return result
    return {}


def imported_custom_constants(imported):
    manifest = json.loads((imported / 'manifest.json').read_text(encoding='utf-8-sig'))
    filename = manifest.get('dependencies', {}).get('cns', '')
    if not filename:
        return {}
    original = (imported / 'original').resolve()
    source = (original / filename).resolve()
    if not source.is_relative_to(original):
        raise ValueError('Constants source outside original import directory')
    constants = constants_section(source.read_text(encoding='utf-8-sig'))
    return {'customConstants': constants} if constants else {}
