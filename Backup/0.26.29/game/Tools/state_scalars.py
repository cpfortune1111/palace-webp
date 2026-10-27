import re

from state_velocity import STATE_GROUPS


STATE_SCALAR_FIELDS = ('sprpriority', 'facep2', 'juggle', 'ctrl', 'poweradd')


def state_scalar(value):
    value = str(value).strip()
    if re.fullmatch(r'[+-]?\d+', value):
        number = int(value)
        if -2147483648 <= number <= 2147483647:
            return number
    return value


def import_bundle_state_scalars(bundle, definitions, renamed=None, retain_missing=False):
    first = {}
    for definition in definitions:
        number = definition['id']
        if number < 0:
            continue
        first.setdefault(str((renamed or {}).get(number, number)), definition)

    def update(state, number):
        definition = first.get(str(number))
        if definition is None:
            return
        fields = {}
        for entry in definition['entries']:
            key, separator, value = entry['text'].partition('=')
            key = key.strip().lower()
            if separator and key in STATE_SCALAR_FIELDS:
                fields.setdefault(key, value.strip())
        for key in STATE_SCALAR_FIELDS:
            if fields.get(key, ''):
                state[key] = state_scalar(fields[key])
            elif not retain_missing:
                state.pop(key, None)

    for group in STATE_GROUPS:
        for number, state in bundle.get(group, {}).items():
            update(state, number)
    if 'state200' in bundle:
        update(bundle['state200'], 200)
    return bundle


if __name__ == '__main__':
    import argparse
    import json
    from pathlib import Path

    parser = argparse.ArgumentParser()
    parser.add_argument('--imported', type=Path, required=True)
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--retain-missing', action='store_true')
    arguments = parser.parse_args()
    definitions = json.loads((arguments.imported / 'state_sections.json').read_text(encoding='utf-8-sig'))['states']
    bundle = json.loads(arguments.input.read_text(encoding='utf-8-sig'))
    import_bundle_state_scalars(bundle, definitions, retain_missing=arguments.retain_missing)
    arguments.output.write_text(json.dumps(bundle, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
