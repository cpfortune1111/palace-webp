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
        params['target'] = 'var(' + params.pop('v') + ')'
    if 'movetype' in params:
        params['moveType'] = params.pop('movetype')
    controllers.append({'type': controller['type'], 'params': params, 'triggers': triggers,
                        'triggerall': triggerall, 'source': {'file': controller['file'], 'line': controller['line']}})
actions = {}
for action in json.loads((root / 'air_sections.json').read_text(encoding='utf-8')):
    if action['id'] not in (0, 5, 6, 200, 130, 131, 150, 151, 5000, 5005):
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
for state in states['states']:
    for entry in state['entries']:
        match = re.fullmatch(r'sprpriority\s*=\s*(-?\d+)', entry['text'], re.I)
        if match:
            priorities[str(state['id'])] = int(match[1])
bundle = {'statePriorities': priorities, 'hitPriorityDefaults': {'attacker': 'keep', 'defender': 0},
          'state200': {'type': 'S', 'physics': 'S', 'anim': 200, 'ctrl': 0, 'moveType': 'A',
                       'sprpriority': priorities['200'],
                       'juggle': 1, 'velset': [0, 0], 'controllers': controllers}, 'collision': actions,
          'source': {'definitionLine': definition['line'], 'baseline': 'source-import-v1',
                     'sha256': {name: hashlib.sha256((source / name).read_bytes()).hexdigest()
                                for name in ('venus.cns', 'venus_Common.cns', 'venus.cmd', 'venus.air')}},
          'intentionalBlankPairs': [[122, 0], [951, 99]], 'unfinishedActions': [645], 'airGuard': False}
arguments.output.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding='utf-8')
print('Compiled State 200 controllers:', len(controllers), 'AIR collision actions:', len(actions))
