STATE_GROUPS = ('states', 'attackStates', 'helperStates', 'lifecycleStates',
                'lifecycleHelpers', 'fallStates', 'locomotionStates')


def state_velocity(value):
    return value.strip() or []


def import_bundle_velocity(bundle, definitions, renamed=None):
    first = {}
    for definition in definitions:
        number = definition['id']
        if number < 0:
            continue
        number = (renamed or {}).get(number, number)
        first.setdefault(str(number), definition)

    def update(state, number):
        definition = first.get(str(number))
        if definition is None:
            return
        for entry in definition['entries']:
            key, separator, value = entry['text'].partition('=')
            if separator and key.strip().lower() == 'velset':
                state['velset'] = state_velocity(value)
                break

    for group in STATE_GROUPS:
        for number, state in bundle.get(group, {}).items():
            update(state, number)
    if 'state200' in bundle:
        update(bundle['state200'], 200)
    return bundle
