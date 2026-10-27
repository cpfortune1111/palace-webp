import argparse
import hashlib
import json
import re
import wave
from collections import Counter
from pathlib import Path

from import_venus_sources import sections


def fields(section):
    result = {}
    for entry in section['entries']:
        if '=' in entry['text']:
            key, value = entry['text'].split('=', 1)
            result.setdefault(key.strip().lower(), []).append(value.strip())
    return result


def semantic_states(path):
    states = {}
    owner = None
    for section in sections(path.read_bytes()):
        match = re.match(r'^statedef\s+(-?\d+)', section['section'], re.I)
        if match:
            owner = int(match[1])
            states[owner] = [{'kind': 'definition', 'fields': fields(section)}]
        elif re.match(r'^state\s', section['section'], re.I) and owner is not None:
            states[owner].append({'kind': 'controller', 'fields': fields(section)})
    return states


def audit(root, legacy, destination):
    manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
    original = root / 'original'
    controllers = json.loads((root / 'state_sections.json').read_text(encoding='utf-8'))['controllers']
    findings = []
    for reference in manifest['referenceChecks']:
        if reference['status'] != 'missing':
            continue
        section = next(controller for controller in controllers
                       if controller['file'] == reference['file']
                       and any(entry['line'] == reference['line'] for entry in controller['entries']))
        params = fields(section)
        triggers = [value for key, values in params.items() if key.startswith('trigger') for value in values]
        existence_guard = any(re.fullmatch(r'(?i)SelfAnimExist\(\s*' + reference['expression'] + r'\s*\)', value)
                              for value in triggers)
        disabled_throw = reference['type'] == 'changestate' and 'StateNo = 999' in triggers
        classification = 'existence-guarded' if existence_guard else 'restricted-to-state-999' if disabled_throw else 'ordered-fallback-review'
        findings.append({**reference, 'classification': classification, 'triggers': triggers,
                         'note': 'Do not synthesize missing source assets or states.'})
    drift = []
    for name in ('venus.cns', 'venus_Common.cns'):
        old = semantic_states(legacy / ('legacy-' + name))
        new = semantic_states(original / name)
        drift.append({'file': name, 'legacyStates': len(old), 'sourceStates': len(new),
                      'addedStates': sorted(set(new) - set(old)), 'removedStates': sorted(set(old) - set(new)),
                      'changedStates': sorted(state for state in set(old) & set(new) if old[state] != new[state]),
                      'state200': {'legacy': old.get(200), 'source': new.get(200)} if name == 'venus.cns' else None})
    sff = json.loads((root / 'sff_directory.json').read_text(encoding='utf-8'))
    formats = Counter(sprite['format'] for sprite in sff['sprites'] if sprite['bytes'])
    missing = {}
    for frame in manifest['missingAIRSpriteReferences']:
        key = ','.join(map(str, frame['sprite']))
        missing.setdefault(key, []).append({'action': frame['action'], 'line': frame['line']})
    destination.mkdir(parents=True, exist_ok=True)
    sounds_dir = destination / 'sounds'
    sounds_dir.mkdir(exist_ok=True)
    snd = (original / 'venus.snd').read_bytes()
    sound_results = []
    for entry in json.loads((root / 'snd_directory.json').read_text(encoding='utf-8')):
        sample = snd[entry['offset']:entry['offset'] + entry['bytes']]
        if hashlib.sha256(sample).hexdigest() != entry['sha256']:
            raise ValueError('Sound payload hash mismatch')
        filename = f"{entry['group']}-{entry['number']}.wav"
        (sounds_dir / filename).write_bytes(sample)
        with wave.open(str(sounds_dir / filename), 'rb') as audio:
            sound_results.append({**entry, 'file': 'sounds/' + filename, 'channels': audio.getnchannels(),
                                  'sampleRate': audio.getframerate(), 'sampleWidth': audio.getsampwidth(),
                                  'frames': audio.getnframes()})
    state200 = [controller for controller in controllers if controller['state'] == 200 and controller['file'] == 'venus.cns']
    report = {'schema': 1, 'baseline': '0.23.7', 'staticMissingReview': findings,
              'missingSpritePairs': missing, 'semanticDrift': drift, 'nonLinkedSFFFormats': dict(formats),
              'soundExports': sound_results, 'state200SourceControllers': state200,
              'limits': ['Semantic drift compares parsed fields, not evaluated MUGEN expressions.',
                         'State 999 restriction is not a global proof of unreachability.',
                         'AIR group/number -1 is an intentional empty frame, verified against IKEMEN Animation.UpdateSprite.',
                         'Sound payload export is byte-preserving; browser playback is not connected.']}
    (destination / 'source_audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'soundsExported': len(sound_results), 'staticMissingClassifications': Counter(item['classification'] for item in findings),
                      'distinctMissingSpritePairs': len(missing), 'drift': [{key: value for key, value in item.items() if key != 'state200'} for item in drift]}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-import', type=Path, required=True)
    parser.add_argument('--legacy-dir', type=Path, required=True)
    parser.add_argument('--destination', type=Path, required=True)
    arguments = parser.parse_args()
    audit(arguments.source_import, arguments.legacy_dir, arguments.destination)
