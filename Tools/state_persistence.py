PERSISTENCE_FIELDS = ('hitcountpersist', 'movehitpersist', 'hitdefpersist')


def import_state_persistence(state, values):
    for key in PERSISTENCE_FIELDS:
        if key in values:
            state[key] = values[key]
    return state


def import_bundle_persistence(bundle, definitions):
    first_definitions = {}
    for definition in definitions:
        first_definitions.setdefault(str(definition['id']), definition)
    for name in ('attackStates', 'helperStates', 'lifecycleStates', 'lifecycleHelpers',
                 'fallStates', 'locomotionStates'):
        for state_id, state in bundle.get(name, {}).items():
            definition = first_definitions.get(state_id)
            if definition is not None:
                values = {entry['text'].split('=', 1)[0].strip().lower():
                          entry['text'].split('=', 1)[1].strip()
                          for entry in definition['entries'] if '=' in entry['text']}
                import_state_persistence(state, values)
    if 'state200' in bundle and '200' in first_definitions:
        definition = first_definitions['200']
        values = {entry['text'].split('=', 1)[0].strip().lower():
                  entry['text'].split('=', 1)[1].strip()
                  for entry in definition['entries'] if '=' in entry['text']}
        import_state_persistence(bundle['state200'], values)
    return bundle
