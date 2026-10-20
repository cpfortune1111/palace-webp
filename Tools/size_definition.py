from custom_constants import first_ini_section, float32_json, imported_cns_text, native_atof
from data_constants import read_i32


def size_definition(text):
    values = first_ini_section(text, 'size') or {}
    size = {
        'xscale': 1, 'yscale': 1,
        'standbox': [-16, -60, 16, 0], 'crouchbox': [-16, -60, 16, 0],
        'airbox': [-12, -60, 12, 0], 'downbox': [-16, -60, 16, 0],
        'attackDistance': {'x': [160, 0], 'y': [1000, 1000], 'z': [4, 4]},
        'projectileAttackDistance': {'x': [90, 0], 'y': [1000, 1000], 'z': [10, 10]},
        'projectileDoScale': 0, 'headPosition': [-5, -90], 'midPosition': [-5, -60],
        'shadowOffset': 0, 'drawOffset': [0, 0], 'depth': [4, 4],
        'attackDepth': [4, 4], 'weight': 100, 'pushFactor': 1
    }

    def read(key, previous):
        result = list(previous)
        if values.get(key, ''):
            for index, component in enumerate(values[key].split(',')[:len(result)]):
                if component.strip():
                    result[index] = float32_json(native_atof(component))
        return result

    for key in ('xscale', 'yscale'):
        size[key] = read(key, [size[key]])[0]
    for key, box, index, negate in [('ground.front', 'standbox', 2, False),
                                    ('ground.back', 'standbox', 0, True),
                                    ('air.front', 'airbox', 2, False),
                                    ('air.back', 'airbox', 0, True),
                                    ('height', 'standbox', 1, True)]:
        if values.get(key, ''):
            value = read(key, [size[box][index]])[0]
            size[box][index] = float32_json(-float(value)) if negate else value
    size['crouchbox'] = list(size['standbox'])
    size['airbox'][1] = size['standbox'][1]
    size['airbox'][3] = size['standbox'][3]
    size['downbox'] = list(size['standbox'])
    for key, target in [('stand.sizebox', 'standbox'), ('crouch.sizebox', 'crouchbox'),
                        ('air.sizebox', 'airbox'), ('down.sizebox', 'downbox')]:
        size[target] = read(key, size[target])
    for prefix, target in [('attack.dist', 'attackDistance'),
                           ('proj.attack.dist', 'projectileAttackDistance')]:
        size[target]['x'][0] = read(prefix, [size[target]['x'][0]])[0]
        for suffix, axis in [('width', 'x'), ('height', 'y'), ('depth', 'z')]:
            size[target][axis] = read(prefix + '.' + suffix, size[target][axis])
    for key, target in [('head.pos', 'headPosition'), ('mid.pos', 'midPosition'),
                        ('draw.offset', 'drawOffset'), ('depth', 'depth'), ('attack.depth', 'attackDepth')]:
        size[target] = read(key, size[target])
    for key, target in [('shadowoffset', 'shadowOffset'), ('pushfactor', 'pushFactor')]:
        size[target] = read(key, [size[target]])[0]
    for key, target in [('proj.doscale', 'projectileDoScale'), ('weight', 'weight')]:
        if values.get(key, ''):
            size[target] = read_i32(values[key], size[target])
    return size


def imported_size_definition(imported):
    return {'sizeDefinition': size_definition(imported_cns_text(imported))}
