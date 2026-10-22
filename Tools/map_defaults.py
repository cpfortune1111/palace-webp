import json
import math
import re
import struct
from decimal import Decimal
from fractions import Fraction

from custom_constants import first_ini_section


def exact_float32(source, approximate):
    if not math.isfinite(approximate) or approximate == 0:
        return approximate
    token = source.replace('_', '').lstrip('+-')
    if token.lower().startswith('0x'):
        mantissa, exponent = re.split('[pP]', token[2:])
        parts = mantissa.split('.')
        fractional = len(parts[1]) if len(parts) > 1 else 0
        number = Fraction(int(''.join(parts), 16))
        shift = int(exponent) - fractional * 4
        number *= Fraction(2) ** shift
    else:
        number = Fraction(Decimal(token))
    def value_at(bits):
        return Fraction.from_float(struct.unpack('!f', struct.pack('!I', bits))[0])
    low = 0
    high = 0x7F7FFFFF
    while low < high:
        middle = (low + high + 1) // 2
        if value_at(middle) <= number:
            low = middle
        else:
            high = middle - 1
    if low == 0x7F7FFFFF:
        if number >= Fraction(2) ** 128 - Fraction(2) ** 103:
            raise ValueError('Map float outside float32 range')
        selected = low
    else:
        distance_low = number - value_at(low)
        distance_high = value_at(low + 1) - number
        selected = low + int(distance_high < distance_low or distance_high == distance_low and low % 2 == 1)
    result = struct.unpack('!f', struct.pack('!I', selected))[0]
    return math.copysign(result, approximate)


def quoted_map_string(source):
    if len(source) < 2 or source[0] != '"' or source[-1] != '"':
        raise ValueError('Map value must be a quoted string or number')
    body = source[1:-1]
    result = bytearray()
    position = 0
    escapes = {'a': 7, 'b': 8, 'f': 12, 'n': 10, 'r': 13, 't': 9, 'v': 11, '\\': 92, '"': 34}
    while position < len(body):
        character = body[position]
        position += 1
        if character != '\\':
            if character in '\n"':
                raise ValueError('Invalid Map string')
            result.extend(character.encode('utf-8'))
            continue
        if position == len(body):
            raise ValueError('Invalid Map escape')
        escape = body[position]
        position += 1
        if escape in escapes:
            result.append(escapes[escape])
            continue
        width = {'x': 2, 'u': 4, 'U': 8}.get(escape)
        if width:
            digits = body[position:position + width]
            if len(digits) != width or not re.fullmatch('[0-9a-fA-F]+', digits):
                raise ValueError('Invalid Map hexadecimal escape')
            position += width
            value = int(digits, 16)
            if escape == 'x':
                result.append(value)
            elif value > 0x10FFFF or 0xD800 <= value <= 0xDFFF:
                raise ValueError('Invalid Map Unicode scalar')
            else:
                result.extend(chr(value).encode('utf-8'))
            continue
        digits = escape + body[position:position + 2]
        if len(digits) != 3 or not re.fullmatch('[0-7]{3}', digits) or int(digits, 8) > 255:
            raise ValueError('Invalid Map octal escape')
        result.append(int(digits, 8))
        position += 2
    return result.decode('utf-8', errors='replace')


def map_default_value(raw):
    source = raw.strip()
    if '"' in source:
        return 'string', quoted_map_string(source)
    if re.fullmatch(r'[+-]?[0-9]+', source):
        negative = source.startswith('-')
        digits = source[1:] if source[0] in '+-' else source
        integer = 0
        for character in digits:
            integer = integer * 10 + ord(character) - ord('0')
            if integer > 2147483647:
                return 'int', -2147483648 if negative else 2147483647
        return 'int', -integer if negative else integer
    decimal = r'[0-9](?:_?[0-9])*'
    hexadecimal = r'[0-9a-fA-F](?:_?[0-9a-fA-F])*'
    mantissa = rf'(?:{decimal}(?:\.(?:{decimal})?)?|\.{decimal})'
    hex_mantissa = rf'(?:{hexadecimal}(?:\.(?:{hexadecimal})?)?|\.{hexadecimal})'
    if re.fullmatch(rf'[+-]?{mantissa}(?:[eE][+-]?{decimal})?', source):
        value = float(source.replace('_', ''))
    elif re.fullmatch(rf'[+-]?0[xX]_?{hex_mantissa}[pP][+-]?{decimal}', source):
        try:
            value = float.fromhex(source.replace('_', ''))
        except OverflowError as error:
            raise ValueError('Map float outside float32 range') from error
    elif source.lower() in ('nan', 'inf', '+inf', '-inf', 'infinity', '+infinity', '-infinity'):
        value = float(source)
    else:
        raise ValueError('Map value must be a quoted string or number')
    if math.isinf(value) and source.lower() not in ('inf', '+inf', '-inf', 'infinity', '+infinity', '-infinity'):
        raise ValueError('Map float outside float32 range')
    value = exact_float32(source, value)
    return 'float', 'NaN' if math.isnan(value) else '-Infinity' if value == -math.inf else 'Infinity' if value == math.inf else value


def definition_map_defaults(text, language=None):
    values = {}
    types = {}
    sections = []
    current = None
    for line in text.splitlines():
        header = line.strip().split(';', 1)[0].strip()
        if header.startswith('[') and header.endswith(']'):
            current = [header[1:-1].lower(), [line]]
            sections.append(current)
        elif current is not None:
            current[1].append(line)
    default_open = True
    localized_open = True
    localized_name = language + '.map' if language is not None else None
    for section, lines in sections:
        if section == 'map' and default_open:
            default_open = False
        elif section == localized_name and localized_open:
            default_open = False
            localized_open = False
        else:
            continue
        for name, raw in (first_ini_section('\n'.join(lines), section) or {}).items():
            types[name], values[name] = map_default_value(raw)
    return {'mapDefaults': values, 'mapDefaultTypes': types} if values else {}


def imported_map_defaults(imported, language=None):
    manifest = json.loads((imported / 'manifest.json').read_text(encoding='utf-8-sig'))
    original = (imported / 'original').resolve()
    definition = (original / manifest['definition']).resolve()
    if not definition.is_relative_to(original):
        raise ValueError('Map definition outside original import directory')
    return definition_map_defaults(definition.read_text(encoding='utf-8-sig'), language)
