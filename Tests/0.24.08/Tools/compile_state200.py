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
    if controller['type'].lower() in ('varset', 'varadd', 'parentvarset'):
        if 'v' in params:
            params['target'] = 'var(' + params.pop('v') + ')'
        else:
            target = next(key for key in params if key.startswith(('sysvar(', 'var(')))
            params['target'], params['value'] = target, params.pop(target)
    if 'movetype' in params:
        params['moveType'] = params.pop('movetype')
    controllers.append({'type': controller['type'], 'params': params, 'triggers': triggers,
                        'triggerall': triggerall, 'source': {'file': controller['file'], 'line': controller['line']}})
actions = {}
loop_starts = {}
for action in json.loads((root / 'air_sections.json').read_text(encoding='utf-8')):
    element = 0
    for entry in action['entries']:
        if entry['text'].lower() == 'loopstart':
            loop_starts[str(action['id'])] = element
        elif re.match(r'^-?\d+\s*,', entry['text']):
            element += 1
def compile_controller(controller):
    params, triggers, triggerall = {}, {}, []
    for entry in controller['entries']:
        if '=' not in entry['text']:
            if re.fullmatch(r'\*+', entry['text']):
                continue
            raise ValueError('Invalid source controller entry: ' + repr(entry))
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
    if controller['type'].lower() in ('varset', 'varadd', 'parentvarset'):
        if 'v' in params:
            params['target'] = 'var(' + params.pop('v') + ')'
        else:
            target = next(key for key in params if key.startswith(('sysvar(', 'var(')))
            params['target'], params['value'] = target, params.pop(target)
    if 'movetype' in params:
        params['moveType'] = params.pop('movetype')
    return {'type': controller['type'], 'params': params, 'triggers': triggers,
            'triggerall': triggerall, 'source': {'file': controller['file'], 'line': controller['line']}}

def compile_lifecycle_state(state_id):
    definition = next(item for item in states['states'] if item['id'] == state_id)
    fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
              for entry in definition['entries']}
    compiled = {'controllers': [compile_controller(controller) for controller in states['controllers']
                                 if controller['state'] == state_id],
                'source': {'file': definition['file'], 'line': definition['line']}}
    for field, target in (('type', 'type'), ('physics', 'physics'), ('movetype', 'moveType')):
        if field in fields:
            compiled[target] = fields[field]
    for field in ('ctrl', 'sprpriority', 'juggle', 'poweradd'):
        if field in fields:
            compiled[field] = int(fields[field])
    if 'anim' in fields:
        compiled['anim'] = fields['anim']
    if 'velset' in fields:
        compiled['velset'] = [float(value) for value in fields['velset'].split(',')]
    return compiled

lifecycle_states = {str(state_id): compile_lifecycle_state(state_id)
                    for state_id in (5900, 190, 191, 1990, 1991, 170, 175, 180, 181)}
global_controllers = {str(state_id): [compile_controller(controller) for controller in states['controllers']
                                     if controller['state'] == state_id] for state_id in (-3, -2)}
lifecycle_helpers = {str(state_id): compile_lifecycle_state(state_id)
                     for state_id in (9999, 915, 925, 950)}

attack_states = {}
for state_id in (200, 210, 230, 240, 400, 410, 430, 440, 600, 610, 630, 640):
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
sweep_hitdef = next(controller for controller in attack_states['440']['controllers'] if controller['type'] == 'HitDef')
sweep_hitdef['params']['ground.velocity'] = '-10,-18'
sweep_hitdef['params']['air.velocity'] = '-8,-18'
attack_commands = [compile_controller(controller) for controller in states['controllers']
                   if controller['state'] == -1 and controller['file'] == 'venus.cmd'
                   and any(entry['text'] == 'triggerall = !AILevel' for entry in controller['entries'])
                   and any(entry['text'] in tuple('value = ' + number for number in attack_states)
                           for entry in controller['entries'])]
special_ids = (1000, 1100, 1200, 3000, 3005)
helper_ids = (3050, 3051, 3052, 3055, 3056)
helper_states = {}
for state_id in special_ids + helper_ids:
    state_definition = next(item for item in states['states'] if item['id'] == state_id)
    fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
              for entry in state_definition['entries']}
    compiled = {'type': fields['type'], 'physics': fields['physics'], 'moveType': fields['movetype'],
                'ctrl': int(fields.get('ctrl', 0)), 'sprpriority': int(fields.get('sprpriority', 0)),
                'juggle': int(fields.get('juggle', 0)), 'poweradd': int(fields.get('poweradd', 0)),
                'controllers': [compile_controller(controller) for controller in states['controllers'] if controller['state'] == state_id]}
    if 'anim' in fields:
        compiled['anim'] = int(fields['anim'])
    if 'velset' in fields:
        compiled['velset'] = [float(value) for value in fields['velset'].split(',')]
    (attack_states if state_id in special_ids else helper_states)[str(state_id)] = compiled
charge_controllers = [compile_controller(controller) for controller in states['controllers']
                      if controller['state'] == -3 and any(re.search(r'(?:var\((?:16|17)\)|v\s*=\s*(?:16|17)\b)', entry['text']) for entry in controller['entries'])]
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
size_constants = {}
for name in ('ground.front', 'ground.back', 'air.front', 'air.back', 'height'):
    size_constants['size.' + name] = float(re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)[1])
for axis, value in zip(('x', 'y'), re.search(r'^head\.pos\s*=\s*([^;\n]+)', source_text, re.M)[1].split(',')):
    size_constants['size.head.pos.' + axis] = float(value)
for name in ('run.fwd', 'run.back'):
    match = re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)
    values = [float(value.strip()) for value in match[1].split(',')]
    for axis, value in zip(('x', 'y'), values):
        locomotion_constants['velocity.' + name + '.' + axis] = value
for action in json.loads((root / 'air_sections.json').read_text(encoding='utf-8')):
    if action['id'] not in (5300,1000,1005,1100,1105,1200,1205,3000,3001,3005,902,9021,904,9041,9085,9086,5002,5007,5012,5017,5022,5027,600, 610, 630, 640, 900, 5040, 5200, 5210, 0, 5, 6, 10, 11, 12, 20, 21, 40, 41, 42, 43, 47, 52, 100, 105, 106, 200, 210, 230, 240, 241, 400, 410, 430, 440, 120, 121, 130, 131, 140, 141, 150, 151, 5000, 5001, 5005, 5006, 5010, 5011, 5015, 5016, 5020, 5021, 5025, 5026, 5030, 5035, 5050, 5060, 5070, 5100, 5110, 5120, 5140, 5150, 5160, 5170):
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
for state_id in (5020, 5030, 5035, 5040, 5050, 5070, 5071, 5100, 5101, 5110, 5120, 5150, 5200, 5201, 5210):
    state_definition = next(item for item in states['states'] if item['id'] == state_id)
    fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
              for entry in state_definition['entries']}
    fall_states[str(state_id)] = {'type': fields['type'], 'moveType': fields['movetype'], 'physics': fields['physics'],
                                 'controllers': [compile_controller(controller) for controller in states['controllers'] if controller['state'] == state_id]}
    if 'velset' in fields:
        fall_states[str(state_id)]['velset'] = [float(value) for value in fields['velset'].split(',')]
    for field in ('anim', 'ctrl'):
        if field in fields:
            fall_states[str(state_id)][field] = int(fields[field])
for name in ('air.gethit.groundrecover', 'air.gethit.airrecover.mul', 'air.gethit.airrecover.add'):
    for axis, number in zip(('x', 'y'), re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)[1].split(',')):
        locomotion_constants['velocity.' + name + '.' + axis] = float(number)
for name in ('air.gethit.airrecover.back', 'air.gethit.airrecover.fwd', 'air.gethit.airrecover.up', 'air.gethit.airrecover.down'):
    locomotion_constants['velocity.' + name] = float(re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)[1])
for name in ('air.gethit.groundrecover.ground.threshold', 'air.gethit.groundrecover.groundlevel', 'air.gethit.airrecover.threshold', 'air.gethit.airrecover.yaccel'):
    locomotion_constants['movement.' + name] = float(re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)[1])
for name in ('air.gethit.groundlevel', 'air.gethit.trip.groundlevel', 'down.bounce.yaccel', 'down.bounce.groundlevel', 'down.friction.threshold'):
    locomotion_constants['movement.' + name] = float(re.search(r'^' + re.escape(name) + r'\s*=\s*([^;\n]+)', source_text, re.M)[1])
for axis, number in zip(('x', 'y'), re.search(r'^down.bounce.offset\s*=\s*([^;\n]+)', source_text, re.M)[1].split(',')):
    locomotion_constants['movement.down.bounce.offset.' + axis] = float(number)
locomotion_constants['data.liedown.time'] = float(re.search(r'^liedown.time\s*=\s*(\d+)', source_text, re.M)[1])
human_commands = [compile_controller(controller) for controller in sorted(states['controllers'], key=lambda controller: controller['line'])
                  if controller['state'] == -1 and controller['file'] == 'venus.cmd'
                  and any(entry['text'] == 'triggerall = !AILevel' for entry in controller['entries'])]
enabled_targets = set(attack_states) | {'100', '105'}
ai_commands = [compile_controller(controller) for controller in sorted(states['controllers'], key=lambda controller: controller['line'])
               if controller['state'] == -1 and controller['file'] == 'venus.cmd'
               and any(entry['text'] == 'triggerall = AILevel' for entry in controller['entries'])]
ai_commands = [controller for controller in ai_commands if controller['params'].get('value') in enabled_targets | {'20', '40', '120'}]
player_commands = [controller for controller in human_commands if controller['params'].get('value') in enabled_targets]
deferred_commands = [controller for controller in human_commands if controller['params'].get('value') not in enabled_targets]
command_definitions = []
cmd_source = (source / 'venus.cmd').read_text(encoding='utf-8')
default_time = int(re.search(r'^command\.Time\s*=\s*(\d+)', cmd_source, re.M | re.I)[1])
default_buffer = int(re.search(r'^command\.buffer\.Time\s*=\s*(\d+)', cmd_source, re.M | re.I)[1])
for section in json.loads((root / 'command_sections.json').read_text(encoding='utf-8')):
    if section['section'].lower() != 'command':
        continue
    fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
              for entry in section['entries']}
    steps = []
    for step in fields['command'].split(','):
        tokens = []
        for token in step.strip().split('+'):
            match = re.fullmatch(r'([~/$>]*)([A-Za-z]+)', token.strip())
            if not match:
                raise ValueError('Unsupported original command token: ' + token)
            prefix, key = match.groups()
            tokens.append({'key': key, 'release': '~' in prefix, 'hold': '/' in prefix,
                           'fourway': '$' in prefix, 'greater': '>' in prefix})
        steps.append(tokens)
    command_definitions.append({'name': fields['name'].strip('"'), 'command': fields['command'],
                                'time': int(fields.get('time', default_time)), 'bufferTime': int(fields.get('buffer.time', default_buffer)),
                                'steps': steps, 'supportedM2': True, 'source': {'file': section['file'], 'line': section['line']}})
(arguments.output.parent / 'venus_cmd_runtime.json').write_text(json.dumps({
    'version': '0.23.38', 'defaults': {'time': default_time, 'buffer.time': default_buffer}, 'commands': command_definitions,
    'sourceSha256': hashlib.sha256((source / 'venus.cmd').read_bytes()).hexdigest()
}, ensure_ascii=False, indent=2), encoding='utf-8')
bundle = {'powerMaximum': power_maximum, 'attackStates': attack_states, 'attackCommands': attack_commands,
          'lifecycleStates': lifecycle_states, 'globalControllers': global_controllers,
          'lifecycleHelpers': lifecycle_helpers,
          'sizeConstants': size_constants,
          'helperStates': helper_states, 'chargeControllers': charge_controllers,
          'playerCommands': player_commands, 'aiCommands': ai_commands, 'deferredPlayerCommands': deferred_commands, 'landingSound': landing_sound,
          'fallStates': fall_states, 'loopStarts': loop_starts,
          'recoveryEntryEnabled': False,
          'noAirGuardControllers': [compile_controller(controller) for controller in states['controllers'] if controller['state'] == -2 and controller['type'] == 'AssertSpecial' and any('NoAirGuard' in entry['text'] for entry in controller['entries'])],
          'userOverrides': {'440': {'ground.velocity': '-10,-18', 'air.velocity': '-8,-18', 'basis': 'User-requested 0.23.27 tuning; archived CNS unchanged'},
                            '1150': {'cameraTopEnding': True, 'basis': 'User-requested 0.23.35: reach visible camera top, then source projhitanim/VY=0; overrides original thirty-tick expiry and upper world height bound; archived CNS unchanged'}},
          'koProfile': {'enabled': False, 'groundXMultiplier': 0.66, 'groundAdd': [-10, -8], 'groundYMinimum': -24,
                        'airAdd': [-10, -8], 'airYMinimum': -12,
                        'basis': 'IKEMEN CharVelocity defaults multiplied by Venus localcoord width / 320; source CNS has no KO velocity overrides; player kovelocity=true'},
          'locomotionStates': locomotion_states, 'locomotionConstants': locomotion_constants,
          'aiWalkControllers': [compile_controller(controller) for controller in states['controllers']
                                if controller['state'] == 20 and controller['file'] == 'venus_Common.cns'
                                and any(entry['text'] == 'triggerall = AILevel' for entry in controller['entries'])],
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
                                for name in ('venus.cns', 'venus_Common.cns', 'venus_Helper.st', 'venus.cmd', 'venus.air')}},
          'intentionalBlankPairs': [[122, 0], [951, 99]], 'unfinishedActions': [645], 'airGuard': False}
arguments.output.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding='utf-8')
print('Compiled State 200 controllers:', len(controllers), 'AIR collision actions:', len(actions))
