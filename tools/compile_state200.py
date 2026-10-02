import argparse
import hashlib
import json
import re
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--source-import', type=Path, default=Path('outputs/venus'))
parser.add_argument('--output', type=Path, default=Path('work/venus_battle200.json'))
arguments = parser.parse_args()
root = arguments.source_import
source = root / 'original'
states = json.loads((root / 'state_sections.json').read_text(encoding='utf-8'))
definition = next(state for state in states['states'] if state['id'] == 200)
controllers = []
for controller in states['controllers']:
    if controller['state'] != 200:
        continue
    params, triggers, triggerall = {}, {}, []
    for entry in controller['entries']:
        key, value = (part.strip() for part in entry['text'].split('=', 1))
        if key.lower() == 'type':
            continue
        if key.lower() == 'triggerall':
            triggerall.append(value)
        elif re.fullmatch(r'trigger\d+', key, re.I):
            triggers.setdefault(key[7:], []).append(value)
        else:
            params[key] = value
    if controller['type'].lower() == 'varset':
        if 'v' in params:
            params['target'] = 'var(' + params.pop('v') + ')'
        else:
            target = next(key for key in params if key.startswith('sysvar('))
            params['target'], params['value'] = target, params.pop(target)
    if 'movetype' in params:
        params['moveType'] = params.pop('movetype')
    controllers.append({'type': controller['type'], 'params': params, 'triggers': triggers,
                        'triggerall': triggerall, 'source': {'file': controller['file'], 'line': controller['line']}})
actions = {}
def compile_controller(controller):
    params, triggers, triggerall = {}, {}, []
    for entry in controller['entries']:
        key, value = (part.strip() for part in entry['text'].split('=', 1))
        key = key.lower()
        if key == 'type':
            continue
        if key == 'triggerall':
            triggerall.append(value)
        elif re.fullmatch(r'trigger\d+', key):
            triggers.setdefault(key[7:], []).append(value)
        else:
            params[key] = value
    if controller['type'].lower() == 'varset':
        if 'v' in params:
            params['target'] = 'var(' + params.pop('v') + ')'
        else:
            target = next(key for key in params if key.startswith('sysvar('))
            params['target'], params['value'] = target, params.pop(target)
    if 'movetype' in params:
        params['moveType'] = params.pop('movetype')
    return {'type': controller['type'], 'params': params, 'triggers': triggers,
            'triggerall': triggerall, 'source': {'file': controller['file'], 'line': controller['line']}}

attack_states = {}
for state_id in (200, 210, 230, 240, 400, 410, 430, 440):
    state_definition = next(item for item in states['states'] if item['id'] == state_id)
    fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
              for entry in state_definition['entries']}
    attack_states[str(state_id)] = {
        'type': fields['type'], 'physics': fields['physics'], 'moveType': fields['movetype'],
        'anim': int(fields['anim']), 'ctrl': int(fields['ctrl']),
        'sprpriority': int(fields['sprpriority']), 'juggle': int(fields['juggle']),
        'poweradd': int(fields.get('poweradd', 0)),
        'velset': [float(value) for value in fields['velset'].split(',')] if 'velset' in fields else [],
        'controllers': [compile_controller(controller) for controller in states['controllers']
                        if controller['state'] == state_id]}
attack_commands = [compile_controller(controller) for controller in states['controllers']
                   if controller['state'] == -1 and controller['file'] == 'venus.cmd'
                   and any(entry['text'] == 'triggerall = !AILevel' for entry in controller['entries'])
                   and any(entry['text'] in ('value = 200', 'value = 210', 'value = 230', 'value = 240', 'value = 400', 'value = 410', 'value = 430', 'value = 440')
                           for entry in controller['entries'])]
landing_sound = next(compile_controller(controller) for controller in states['controllers']
                     if controller['state'] == 52 and controller['type'] == 'PlaySnd')
locomotion_states = {}
deferred_locomotion = []
for state_id in (100, 105, 106):
    state_definition = next(item for item in states['states'] if item['id'] == state_id)
    fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
              for entry in state_definition['entries']}
    compiled = []
    for controller in states['controllers']:
        if controller['state'] != state_id:
            continue
        if controller['type'] == 'MakeDust':
            deferred_locomotion.append(controller)
            continue
        params, triggers, triggerall = {}, {}, []
        for entry in controller['entries']:
            key, value = (part.strip() for part in entry['text'].split('=', 1))
            if key.lower() == 'type':
                continue
            if key.lower() == 'triggerall':
                triggerall.append(value)
            elif re.fullmatch(r'trigger\d+', key, re.I):
                triggers.setdefault(key[7:], []).append(value)
            else:
                params[key] = value
        compiled.append({'type': controller['type'], 'params': params, 'triggers': triggers,
                         'triggerall': triggerall, 'source': {'file': controller['file'], 'line': controller['line']}})
    locomotion_states[str(state_id)] = {'type': fields['type'], 'physics': fields['physics'],
        'moveType': fields.get('movetype', 'I'), 'anim': int(fields['anim']), 'controllers': compiled}
    if 'ctrl' in fields:
        locomotion_states[str(state_id)]['ctrl'] = int(fields['ctrl'])
locomotion_constants = {}
source_text = (source / 'venus.cns').read_text(encoding='utf-8-sig')
for name in ('run.fwd', 'run.back'):
    match = re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)
    values = [float(value.strip()) for value in match[1].split(',')]
    for axis, value in zip(('x', 'y'), values):
        locomotion_constants['velocity.' + name + '.' + axis] = value
for action in json.loads((root / 'air_sections.json').read_text(encoding='utf-8')):
    if action['id'] not in (0, 5, 6, 10, 11, 12, 20, 21, 40, 41, 42, 43, 47, 52, 100, 105, 106, 200, 210, 230, 240, 241, 400, 410, 430, 440, 120, 121, 130, 131, 140, 141, 150, 151, 5000, 5001, 5005, 5006, 5010, 5011, 5015, 5016, 5020, 5021, 5025, 5026, 5030, 5035, 5050, 5060, 5070, 5100, 5110, 5120, 5140, 5150, 5160, 5170):
        continue
    defaults, pending, boxes = {}, {}, []
    for entry in action['entries']:
        line = entry['text']
        match = re.fullmatch(r'Clsn([12])(Default)?:\s*(\d+)', line, re.I)
        if match:
            kind = 'c' + match[1]
            target = defaults if match[2] else pending
            target[kind] = []
            active = target[kind]
        elif re.match(r'Clsn[12]\[', line, re.I):
            active.append([int(value.strip()) for value in line.split('=', 1)[1].split(',')])
        elif re.match(r'^-?\d+\s*,', line):
            boxes.append({kind: pending.get(kind, defaults.get(kind, [])) for kind in ('c1', 'c2')})
            pending = {}
    actions[str(action['id'])] = boxes
priorities = {}
hit_velocity_controllers = {}
for controller in states['controllers']:
    if controller['state'] not in (151, 153, 5001, 5011) or controller['type'].lower() != 'hitvelset':
        continue
    params, triggers = {}, {}
    for entry in controller['entries']:
        key, value = (part.strip() for part in entry['text'].split('=', 1))
        if key.lower() == 'type':
            continue
        if re.fullmatch(r'trigger\d+', key, re.I):
            triggers.setdefault(key[7:], []).append(value)
        else:
            params[key] = value
    hit_velocity_controllers[str(controller['state'])] = {
        'type': controller['type'], 'params': params, 'triggers': triggers,
        'source': {'file': controller['file'], 'line': controller['line']}}
for state in states['states']:
    for entry in state['entries']:
        match = re.fullmatch(r'sprpriority\s*=\s*(-?\d+)', entry['text'], re.I)
        if match:
            priorities[str(state['id'])] = int(match[1])
attack_distance = re.search(r'^attack\.dist\s*=\s*(\d+)', (source / 'venus.cns').read_text(encoding='utf-8-sig'), re.M)
if attack_distance is None:
    raise ValueError('Missing source attack.dist')
power_maximum = int(re.search(r'^power\s*=\s*(\d+)', source_text, re.M)[1])
fall_states = {}
for state_id in (5030, 5035, 5050, 5070, 5071, 5100, 5101, 5110, 5120, 5150):
    state_definition = next(item for item in states['states'] if item['id'] == state_id)
    fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
              for entry in state_definition['entries']}
    fall_states[str(state_id)] = {'type': fields['type'], 'moveType': fields['movetype'], 'physics': fields['physics'],
                                 'controllers': [compile_controller(controller) for controller in states['controllers'] if controller['state'] == state_id]}
    if 'velset' in fields:
        fall_states[str(state_id)]['velset'] = [float(value) for value in fields['velset'].split(',')]
for name in ('air.gethit.groundlevel', 'air.gethit.trip.groundlevel', 'down.bounce.yaccel', 'down.bounce.groundlevel', 'down.friction.threshold'):
    locomotion_constants['movement.' + name] = float(re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)[1])
for axis, number in zip(('x', 'y'), re.search(r'^down.bounce.offset\s*=\s*([^;\n]+)', source_text, re.M)[1].split(',')):
    locomotion_constants['movement.down.bounce.offset.' + axis] = float(number)
locomotion_constants['data.liedown.time'] = float(re.search(r'^liedown.time\s*=\s*(\d+)', source_text, re.M)[1])
bundle = {'powerMaximum': power_maximum, 'attackStates': attack_states, 'attackCommands': attack_commands, 'landingSound': landing_sound,
          'fallStates': fall_states,
          'locomotionStates': locomotion_states, 'locomotionConstants': locomotion_constants,
          'deferredLocomotionEffects': deferred_locomotion,
          'guardDistance': {'front': int(attack_distance[1]), 'back': 0,
                           'basis': 'Venus Size attack.dist; IKEMEN default rear distance 0; strict axis-position range'},
          'statePriorities': priorities, 'hitVelocityControllers': hit_velocity_controllers,
          'hitPriorityDefaults': {'attacker': 'keep', 'defender': 0},
          'cornerpushProfile': {'legacy': True, 'defaultMultiplier': 0.7, 'stopThreshold': 4,
                                'basis': 'Venus DEF has no ikemenversion; IKEMEN legacyCornerpush defaults and 1280 localcoord originLs=0.25'},
          'state200': {'type': 'S', 'physics': 'S', 'anim': 200, 'ctrl': 0, 'moveType': 'A',
                       'sprpriority': priorities['200'],
                       'juggle': 1, 'velset': [0, 0], 'controllers': controllers}, 'collision': actions,
          'source': {'definitionLine': definition['line'], 'baseline': 'source-import-v1',
                     'sha256': {name: hashlib.sha256((source / name).read_bytes()).hexdigest()
                                for name in ('venus.cns', 'venus_Common.cns', 'venus.cmd', 'venus.air')}},
          'intentionalBlankPairs': [[122, 0], [951, 99]], 'unfinishedActions': [645], 'airGuard': False}
arguments.output.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding='utf-8')
print('Compiled State 200 controllers:', len(controllers), 'AIR collision actions:', len(actions))
