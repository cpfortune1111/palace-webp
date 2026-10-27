import math

from custom_constants import first_ini_section, float32_json, imported_cns_text


DATA_DEFAULTS = {
    'life': 1000, 'power': 3000, 'dizzypoints': 1000, 'guardpoints': 1000,
    'attack': 100, 'defence': 100, 'fall.defence_up': 50,
    'liedown.time': 60, 'airjuggle': 15, 'sparkno': 2, 'guard.sparkno': 40,
    'hitsound.channel': -1, 'guardsound.channel': -1, 'ko.echo': 0,
    'volume': 256, 'intpersistindex': 2147483647, 'floatpersistindex': 2147483647
}


def native_atoi(value):
    value = value.strip()
    if not value:
        return 0
    digits = value[1:] if value[0] in '-+' else value
    number = 0
    for character in digits:
        if not '0' <= character <= '9':
            break
        number = number * 10 + ord(character) - ord('0')
        if number > 2147483647:
            return -2147483648 if value[0] == '-' else 2147483647
    return -number if value[0] == '-' else number


def read_i32(value, previous):
    component = value.split(',', 1)[0].strip()
    return native_atoi(component) if component else previous


def signed32(value):
    return (value + 2147483648) % 4294967296 - 2147483648


def trunc_divide(value, divisor):
    return (abs(value) // divisor) * (-1 if value < 0 else 1)


def data_constants(text):
    values = first_ini_section(text, 'data')
    data = dict(DATA_DEFAULTS)
    if values is not None:
        for key in ('life', 'power'):
            if key in values and values[key]:
                data[key] = read_i32(values[key], data[key])
        data['dizzypoints'] = data['guardpoints'] = data['life']
        for key in DATA_DEFAULTS:
            if key in ('life', 'power', 'volume', 'intpersistindex', 'floatpersistindex'):
                continue
            if key in values and values[key]:
                data[key] = read_i32(values[key], data[key])
        temporary = 0
        if values.get('volume', ''):
            temporary = read_i32(values['volume'], temporary)
            data['volume'] = signed32(trunc_divide(temporary, 2) + 256)
        if values.get('volumescale', ''):
            temporary = read_i32(values['volumescale'], temporary)
            data['volume'] = trunc_divide(signed32(temporary * 64), 25)
        for key in ('intpersistindex', 'floatpersistindex'):
            if key in values:
                data[key] = read_i32(values[key], 0)
    multiplier = float32_json(float32_json(float32_json(data['fall.defence_up']) + 100) / 100)
    reciprocal = math.copysign(math.inf, multiplier) if multiplier == 0 else 1 / multiplier
    result = {'data.' + key: value for key, value in data.items()}
    result['data.fall.defence_mul'] = float32_json(reciprocal)
    return result


def imported_data_constants(imported):
    return {'dataConstants': data_constants(imported_cns_text(imported))}
