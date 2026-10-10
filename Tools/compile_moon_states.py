import argparse
import json
import re
from pathlib import Path


DISABLED_ACTIONS = {195, 612, 614, 830, 3199}


def fields(entries):
    return {entry['text'].split('=', 1)[0].strip().lower():
            entry['text'].split('=', 1)[1].strip()
            for entry in entries if '=' in entry['text']}


def is_3do(controller):
    text = '\n'.join(entry['text'] for entry in controller['entries'])
    return bool(re.search(r'3DO|var\(50\)\s*=\s*1\b', text, re.I))


def compile_controller(controller):
    params, triggers, triggerall = {}, {}, []
    for entry in controller['entries']:
        if '=' not in entry['text']:
            continue
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
        elif 'fv' in params:
            params['target'] = 'fvar(' + params.pop('fv') + ')'
        else:
            target = next((key for key in params if key.startswith(('var(', 'sysvar('))), None)
            if target:
                params['target'], params['value'] = target, params.pop(target)
    if 'movetype' in params:
        params['moveType'] = params.pop('movetype')
    return {'type': controller['type'], 'params': params,
            'triggers': triggers, 'triggerall': triggerall,
            'source': {'file': controller['file'], 'line': controller['line']}}


def build(imported):
    raw = json.loads((imported / 'state_sections.json').read_text(encoding='utf-8'))
    definitions = raw['states']
    variants, excluded = {}, []
    for definition in definitions:
        state_id = definition['id']
        if not 0 <= state_id <= 999:
            continue
        next_line = min((other['line'] for other in definitions
                         if other['file'] == definition['file'] and other['line'] > definition['line']),
                        default=float('inf'))
        compiled = fields(definition['entries'])
        compiled['moveType'] = compiled.pop('movetype', 'I')
        compiled['source'] = {'file': definition['file'], 'line': definition['line']}
        compiled['controllers'] = []
        for controller in raw['controllers']:
            if controller['file'] != definition['file'] or not definition['line'] < controller['line'] < next_line:
                continue
            values = fields(controller['entries'])
            reason = None
            if is_3do(controller):
                reason = '3DO excluded by author'
            elif controller['type'].lower() == 'changeanim' and values.get('value', '').isdigit() and int(values['value']) in DISABLED_ACTIONS:
                reason = 'Unfinished animation excluded by author'
            elif state_id == 823 and values.get('value') == '10612':
                reason = 'Unfinished transition excluded by author'
            if reason:
                excluded.append({'state': state_id, 'file': controller['file'], 'line': controller['line'], 'reason': reason})
            else:
                compiled['controllers'].append(compile_controller(controller))
        variants.setdefault(str(state_id), []).append(compiled)
    commands, ai_commands, deferred = [], [], []
    for controller in raw['controllers']:
        if controller['state'] != -1 or controller['type'].lower() != 'changestate':
            continue
        values = fields(controller['entries'])
        target = values.get('value', '')
        if is_3do(controller):
            excluded.append({'state': -1, 'file': controller['file'], 'line': controller['line'], 'reason': '3DO excluded by author'})
        elif target.isdigit() and target in variants:
            compiled = compile_controller(controller)
            target_list = commands if any(re.search(r'!AILevel', entry['text'], re.I)
                                          for entry in controller['entries']) else ai_commands
            target_list.append(compiled)
        else:
            deferred.append({'target': target, 'file': controller['file'], 'line': controller['line']})
    collisions, loops = {}, {}
    for action in json.loads((imported / 'air_sections.json').read_text(encoding='utf-8')):
        if action['id'] in DISABLED_ACTIONS:
            continue
        defaults, pending, boxes, active = {}, {}, [], None
        for entry in action['entries']:
            text = entry['text']
            match = re.fullmatch(r'Clsn([12])(Default)?:\s*(\d+)', text, re.I)
            if match:
                target = defaults if match[2] else pending
                active = target['c' + match[1]] = []
            elif re.match(r'Clsn[12]\[', text, re.I):
                if active is None:
                    raise ValueError('Collision box without declaration')
                active.append([int(value.strip()) for value in text.split('=', 1)[1].split(',')])
            elif text.lower() == 'loopstart':
                loops[str(action['id'])] = len(boxes)
            elif re.match(r'^-?\d+\s*,', text):
                boxes.append({kind: pending.get(kind, defaults.get(kind, [])) for kind in ('c1', 'c2')})
                pending = {}
        collisions[str(action['id'])] = boxes
    return {'character': 'SailorMoon', 'scope': [0, 999], 'hardware': ['snes', 'saturn'],
            'runtimeEnabled': False, 'stateVariants': variants,
            'unresolvedDuplicates': [key for key, value in variants.items() if len(value) > 1],
            'playerCommands': commands, 'aiCommands': ai_commands, 'deferredCommands': deferred,
            'excludedControllers': excluded, 'disabledActions': sorted(DISABLED_ACTIONS),
            'collision': collisions, 'loopStarts': loops}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--imported', type=Path, default=Path('outputs/moon'))
    parser.add_argument('--output', type=Path, default=Path('outputs/moon/moon_states_0_999.json'))
    arguments = parser.parse_args()
    bundle = build(arguments.imported)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Moon states:', len(bundle['stateVariants']), 'commands:', len(bundle['playerCommands']),
          'excluded controllers:', len(bundle['excludedControllers']))


if __name__ == '__main__':
    main()
