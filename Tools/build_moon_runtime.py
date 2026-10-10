import argparse
import json
import re
from pathlib import Path

from compile_moon_states import DISABLED_ACTIONS, build, compile_controller, fields


def non_3do_controller(controller):
    compiled = compile_controller(controller)
    if any(re.search(r'3DO|var\(50\)\s*=\s*1\b', expression, re.I)
           for expression in compiled['triggerall']):
        return None
    compiled['triggers'] = {key: expressions for key, expressions in compiled['triggers'].items()
                            if not any(re.search(r'3DO|var\(50\)\s*=\s*1\b', expression, re.I)
                                       for expression in expressions)}
    return compiled if compiled['triggers'] else None


def compile_runtime(imported, output):
    audit = build(imported)
    raw = json.loads((imported / 'state_sections.json').read_text(encoding='utf-8'))
    definitions = raw['states']
    states = {}
    canonical = {value.lower(): value for value in ('Null', 'VarSet', 'VarAdd', 'ParentVarSet', 'StateTypeSet')}
    for definition in definitions:
        state_id = definition['id']
        if state_id < 0 or state_id in (195, 811, 822, 823, 1300, 1400, 3100, 3101, 3105, 3150, 3151, 3160):
            continue
        if str(state_id) in states:
            continue
        exported_id = 1110 if state_id == 1101 else state_id
        boundary = min((item['line'] for item in definitions if item['file'] == definition['file']
                        and item['line'] > definition['line']), default=float('inf'))
        values = fields(definition['entries'])
        state = {'type': values.get('type', 'S'), 'physics': values.get('physics', 'N'),
                 'moveType': values.get('movetype', 'I'), 'controllers': [],
                 'source': {'file': definition['file'], 'line': definition['line']}}
        for key in ('anim', 'ctrl', 'sprpriority', 'juggle', 'poweradd'):
            if key in values:
                state[key] = int(values[key]) if re.fullmatch(r'-?\d+', values[key]) else values[key]
        if state_id == 1101:
            state['anim'] = 1110
        if 'velset' in values:
            state['velset'] = [float(value) for value in values['velset'].split(',')]
        for controller in raw['controllers']:
            if controller['file'] != definition['file'] or not definition['line'] < controller['line'] < boundary:
                continue
            compiled = non_3do_controller(controller)
            if compiled is None:
                continue
            compiled['type'] = canonical.get(compiled['type'].lower(), compiled['type'])
            if compiled['type'] == 'ChangeState' and compiled['params'].get('value') == '1101':
                compiled['params']['value'] = '1110'
            if compiled['type'] == 'ChangeAnim' and compiled['params'].get('value', '').isdigit() and int(compiled['params']['value']) in DISABLED_ACTIONS:
                continue
            if state_id == 190 and compiled['type'] == 'ChangeState':
                compiled['triggers'] = {key: value for key, value in compiled['triggers'].items() if key in ('1', '2')}
            state['controllers'].append(compiled)
        states[str(exported_id)] = state
    constants, section = {}, None
    for line in (imported / 'original/moon.cns').read_text(encoding='utf-8-sig').splitlines():
        line = line.split(';', 1)[0].strip()
        if line.startswith('['):
            section = line.strip('[]').lower()
        elif section in ('data', 'size', 'velocity', 'movement') and '=' in line:
            key, value = (part.strip() for part in line.split('=', 1))
            try:
                numbers = [float(part) for part in value.split(',')]
            except ValueError:
                continue
            if len(numbers) > 1:
                for axis, number in zip(('x', 'y'), numbers):
                    constants[section + '.' + key + '.' + axis] = number
            else:
                constants[section + '.' + key] = numbers[0]
                if section == 'velocity':
                    constants[section + '.' + key + '.x'] = numbers[0]
    constants['velocity.jump.y'] = constants['velocity.jump.neu.y']
    globals_data = {}
    for state_id in (-3, -2):
        controllers = []
        for controller in raw['controllers']:
            if controller['state'] != state_id:
                continue
            compiled = non_3do_controller(controller)
            if compiled is None:
                continue
            if re.search(r'fvar\((?:10|11)\)', str(compiled), re.I):
                continue
            compiled['type'] = canonical.get(compiled['type'].lower(), compiled['type'])
            if compiled['params'].get('target') in ('var(50)', 'var(51)'):
                continue
            controllers.append(compiled)
        globals_data[str(state_id)] = controllers
    commands = []
    cmd_text = (imported / 'original/moon.cmd').read_text(encoding='utf-8-sig')
    default_time = int(re.search(r'command\.Time\s*=\s*(\d+)', cmd_text, re.I)[1])
    default_buffer = int(re.search(r'command\.buffer\.Time\s*=\s*(\d+)', cmd_text, re.I)[1])
    for section in json.loads((imported / 'command_sections.json').read_text(encoding='utf-8')):
        if section['section'].lower() != 'command':
            continue
        values = fields(section['entries'])
        if '3do' in values['name'].lower():
            continue
        steps = []
        for step in values['command'].split(','):
            tokens = []
            for token in step.strip().split('+'):
                match = re.fullmatch(r'([~/$>\d]*)([A-Za-z]+)', token.strip())
                if not match:
                    raise ValueError('Unsupported Moon command token: ' + token)
                prefix, key = match.groups()
                tokens.append({'key': key, 'release': '~' in prefix, 'hold': '/' in prefix,
                               'fourway': '$' in prefix, 'greater': '>' in prefix,
                               'releaseMinimum': int(re.search(r'\d+', prefix)[0]) if re.search(r'\d+', prefix) else 0})
            steps.append(tokens)
        commands.append({'name': values['name'].strip('"'), 'steps': steps,
                         'time': int(values.get('time', default_time)),
                         'bufferTime': int(values.get('buffer.time', default_buffer))})
    player_commands, ai_commands = [], []
    for controller in raw['controllers']:
        if controller['state'] != -1 or controller['type'].lower() != 'changestate':
            continue
        compiled = non_3do_controller(controller)
        if compiled is None or compiled['params'].get('value') not in states:
            continue
        target = player_commands if any(re.search(r'!AILevel', expression, re.I)
                                        for expression in compiled['triggerall']) else ai_commands
        target.append(compiled)
    bundle = {'character': 'SailorMoon', 'runtimeEnabled': True, 'states': states, 'constants': constants,
              'attackStates': {key: value for key, value in states.items() if value['moveType'] == 'A'},
              'locomotionStates': {key: states[key] for key in ('70', '100', '105')},
              'lifecycleStates': {key: states[key] for key in ('5900', '190', '191', '192', '170', '175', '180', '181', '1990', '1991')},
              'fallStates': {key: value for key, value in states.items() if 5000 <= int(key) < 5900},
              'lifecycleHelpers': {key: states[key] for key in ('915', '925', '950', '951', '9999')},
              'helperStates': {key: value for key, value in states.items()
                               if value['source']['file'] == 'moon_Helper.st'}, 'globalControllers': globals_data,
              'playerCommands': player_commands, 'attackCommands': player_commands, 'aiCommands': ai_commands,
              'commands': commands, 'collision': audit['collision'], 'loopStarts': audit['loopStarts'],
              'sizeConstants': constants, 'locomotionConstants': constants,
              'landingSound': next(item for item in states['52']['controllers'] if item['type'] == 'PlaySnd'),
              'hitVelocityControllers': {key: next(item for item in states[key]['controllers'] if item['type'] == 'HitVelSet')
                                        for key in ('151', '153', '5001', '5011')},
              'statePriorities': {key: value.get('sprpriority', 0) for key, value in states.items()},
              'powerMaximum': 3000, 'userOverrides': {}, 'recoveryEntryEnabled': False,
              'aiWalkControllers': [], 'guardDistance': {'front': constants['size.attack.dist'], 'back': 0},
              'koProfile': {'enabled': False}, 'hitPriorityDefaults': {'defender': 0},
              'cornerpushProfile': {'defaultMultiplier': .7, 'stopThreshold': 4},
              'source': {'character': 'SailorMoon', 'scope': 'All source states; non-3DO skills, recovery, KO and helpers',
                         'duplicatePolicy': 'first definition; IKEMEN compiler.go', 'disabledHardware': ['3do']}}
    output.write_text(json.dumps(bundle, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('Moon runtime:', len(states), 'states;', len(commands), 'command definitions')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--imported', type=Path, default=Path('outputs/moon'))
    parser.add_argument('--output', type=Path, default=Path('work/Char/Moon/Battle/moon_runtime.json'))
    arguments = parser.parse_args()
    compile_runtime(arguments.imported, arguments.output)
