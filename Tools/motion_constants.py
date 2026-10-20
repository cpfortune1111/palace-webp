from custom_constants import first_ini_section, float32_json, imported_cns_text, native_atof
from character_coordinates import imported_coordinates
from data_constants import read_i32


VELOCITY_FIELDS = {
    'walk.fwd': [0], 'walk.back': [0],
    'run.fwd': [0, 0], 'run.back': [0, 0],
    'jump.neu': [0, 0], 'jump.back': [0], 'jump.fwd': [0],
    'runjump.back': [0, 0], 'runjump.fwd': [0, 0],
    'airjump.neu': [0, 0], 'airjump.back': [0], 'airjump.fwd': [0],
    'air.gethit.groundrecover': [-0.15, -3.5],
    'air.gethit.airrecover.mul': [0.5, 0.2],
    'air.gethit.airrecover.add': [0, -4.5],
    'air.gethit.airrecover.back': [-1], 'air.gethit.airrecover.fwd': [0],
    'air.gethit.airrecover.up': [-2], 'air.gethit.airrecover.down': [1.5],
    'air.gethit.ko.add': [-2.5, -2], 'air.gethit.ko.ymin': [-3],
    'ground.gethit.ko.xmul': [0.66], 'ground.gethit.ko.add': [-2.5, -2],
    'ground.gethit.ko.ymin': [-6],
    **{mode + '.' + direction: [0, 0, 0]
       for mode in ('walk', 'run', 'jump', 'runjump', 'airjump')
       for direction in ('up', 'down')}
}
MOVEMENT_FIELDS = {
    'airjump.num': [0], 'airjump.height': [0], 'yaccel': [0.44],
    'stand.friction': [0.85], 'stand.friction.threshold': [2],
    'crouch.friction': [0.82], 'crouch.friction.threshold': [0],
    'air.gethit.groundlevel': [25],
    'air.gethit.groundrecover.ground.threshold': [-20],
    'air.gethit.groundrecover.groundlevel': [10],
    'air.gethit.airrecover.threshold': [-1],
    'air.gethit.airrecover.yaccel': [0.35], 'air.gethit.trip.groundlevel': [15],
    'down.bounce.offset': [0, 20], 'down.bounce.yaccel': [0.4],
    'down.bounce.groundlevel': [12], 'down.gethit.offset': [0, 15],
    'down.friction.threshold': [0.05]
}


def read_components(values, key, previous):
    result = list(previous)
    for index, component in enumerate(values.get(key, '').split(',')[:len(result)]):
        if component.strip():
            result[index] = float32_json(native_atof(component))
    return result


def motion_constants(text, localcoord=320):
    ratio = float32_json(float32_json(localcoord) / 320)
    velocity = {key: [float32_json(float32_json(value) * (1 if key in ('air.gethit.airrecover.mul', 'ground.gethit.ko.xmul') else ratio)) for value in values]
                for key, values in VELOCITY_FIELDS.items()}
    values = first_ini_section(text, 'velocity') or {}
    for key in ('walk.fwd', 'walk.back', 'run.fwd', 'run.back',
                'jump.neu', 'jump.back', 'jump.fwd'):
        velocity[key] = read_components(values, key, velocity[key])
    velocity['runjump.back'] = [velocity['jump.back'][0], velocity['jump.neu'][1]]
    velocity['runjump.fwd'] = [velocity['jump.fwd'][0], velocity['jump.neu'][1]]
    velocity['airjump.neu'] = list(velocity['jump.neu'])
    velocity['airjump.back'] = list(velocity['jump.back'])
    velocity['airjump.fwd'] = list(velocity['jump.fwd'])
    for key in velocity:
        if key not in ('walk.fwd', 'walk.back', 'run.fwd', 'run.back',
                       'jump.neu', 'jump.back', 'jump.fwd'):
            velocity[key] = read_components(values, key, velocity[key])
    result = {}
    horizontal = {'walk.fwd', 'walk.back', 'jump.back', 'jump.fwd',
                  'airjump.back', 'airjump.fwd'}
    for key, components in velocity.items():
        for index, value in enumerate(components):
            name = key + '.' + 'xyz'[index] if len(components) > 1 or key in horizontal else key
            if name in ('jump.neu.y', 'airjump.neu.y', 'runjump.fwd.y'):
                name = {'jump.neu.y': 'jump.y', 'airjump.neu.y': 'airjump.y',
                        'runjump.fwd.y': 'runjump.y'}[name]
            result['velocity.' + name] = value
    values = first_ini_section(text, 'movement') or {}
    for key, defaults in MOVEMENT_FIELDS.items():
        scale = 1 if key in ('airjump.num', 'stand.friction', 'crouch.friction') else ratio
        components = [read_i32(values.get(key, ''), defaults[0])] if key == 'airjump.num' else read_components(values, key, [float32_json(float32_json(value) * scale) for value in defaults])
        for index, value in enumerate(components):
            name = key + '.' + 'xy'[index] if len(components) > 1 else key
            result['movement.' + name] = value
    return result


def imported_motion_constants(imported):
    width = imported_coordinates(imported)['coordinateSystem']['localcoord'][0]
    return {'originalMotionConstants': motion_constants(imported_cns_text(imported), width)}
