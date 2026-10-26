"""Verify native command grammar/counters against fixtures; not Web matcher conformance."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
from import_venus_sources import sections

cli = argparse.ArgumentParser(description=__doc__)
cli.add_argument('--receipt', type=Path, required=True)
cli.add_argument('--output', type=Path, required=True)
cli.add_argument('--symbols-corpus', type=Path, help='Optional PRIVATE raw command fixture output; never publish')
cli.add_argument('--character-cmd', type=Path, action='append', default=[])
args = cli.parse_args()
receipt = json.loads(args.receipt.read_text(encoding='utf-8'))
assert receipt['commit'] == 'cb56d73badb322f3725257c2e8cfd157b2c3989d'
assert receipt['compiler'].startswith('go version go1.27.3 ')
assert hashlib.sha256(Path(receipt['executable']).read_bytes()).hexdigest() == receipt['executableSha256']


def request(command, frames=None, **changes):
    return {'Command': command, 'Time': 15, 'StepTime': 15, 'Buffer': 2,
            'BufferHitPause': True, 'BufferPauseEnd': True, 'Frames': frames or [], **changes}


cases, expected = [], []
keys = ['U', 'D', 'B', 'F', 'L', 'R', 'UB', 'UF', 'DB', 'DF', 'UL', 'UR', 'DL', 'DR', 'N', 'a', 'b', 'c', 'x', 'y', 'z', 's', 'd', 'w', 'm']
for key in keys:
    for prefix in ('', '/', '~', '~3', '$', '~$', '/~3$', '>'):
        cases.append(request(prefix + key))
        expected.append({'key': key, 'hold': '/' in prefix, 'release': '~' in prefix,
                         'fourway': '$' in prefix and key in keys[:15], 'charge': 3 if '3' in prefix else 0,
                         'greater': '>' in prefix})
for command in ('a+b|c', 'a|', 'a++b', 'ab', 'D,,a', '//a', '~~a', 'q'):
    cases.append(request(command));expected.append({'error': True})
cases.append(request(''));expected.append({'empty': True})
for or_logic in (False, True):
    for held in ([], ['a'], ['b'], ['a', 'b']):
        cases.append(request('a|b' if or_logic else 'a+b', [{'Held': held, 'Facing': 1}]))
        expected.append({'complete': [any(key in held for key in ('a', 'b')) if or_logic else all(key in held for key in ('a', 'b'))]})
cases.append(request('/a|b', [{'Held': ['a'], 'Facing': 1}] * 3));expected.append({'complete': [True, True, True]})
cases.append(request('~a|b', [{'Held': ['a'], 'Facing': 1}, {'Held': ['a'], 'Facing': 1}, {'Held': [], 'Facing': 1}]))
expected.append({'complete': [False, False, True]})
cases.append(request('D,a|b', [{'Held': ['D', 'b'], 'Facing': 1}]))
expected.append({'complete': [True]})
cases.append(request('a', [{'Held': ['a']}, {'Held': []}, {'Held': []}]))
expected.append({'buffers': [2, 1, 0]})
cases.append(request('a', [{'Held': ['a'], 'HitPause': True, 'Extra': 1}, {'Held': [], 'HitPause': True}, {'Held': []}]))
expected.append({'buffers': [3, 3, 2]})
for command, complete in (('a', False), ('/a', True)):
    cases.append(request(command, [{'Held': ['a'], 'AI': True, 'Helper': True}]))
    expected.append({'complete': [complete]})
cases.append(request('a|b', [{'Held': ['x']}], Remap={'a': 'x', 'b': 'y'}))
expected.append({'complete': [True], 'remapped': ['x', 'y']})
cases.append(request('/L', [
    {'Held': ['L'], 'Facing': 1, 'Queries': ['L', 'B', 'F', 'N']},
    {'Held': ['L'], 'Facing': -1, 'Queries': ['L', 'B', 'F', 'N']}]))
expected.append({'complete': [True, True], 'states': [{'L': 1, 'B': 1, 'F': -1, 'N': -1}, {'L': 2, 'B': -1, 'F': 1, 'N': -2}]})
fixture_count = len(cases)
characters = []
for path in args.character_cmd:
    data = path.read_bytes();start = len(cases);lines = []
    for section in sections(data):
        if section['section'].lower() != 'command':continue
        fields = {entry['text'].split('=', 1)[0].strip().lower(): entry['text'].split('=', 1)[1].strip()
                  for entry in section['entries'] if '=' in entry['text']}
        assert 'command' in fields, (path.stem, section['line'])
        cases.append(request(fields['command']));expected.append({'character': path.stem})
        lines.append(section['line'])
    characters.append({'name': path.stem, 'sourceSha256': hashlib.sha256(data).hexdigest(), 'definitions': len(lines),
                       'start': start, 'lines': lines})
run = subprocess.run([receipt['executable']], input=json.dumps(cases), capture_output=True, text=True, timeout=60, check=True)
if args.symbols_corpus:
    args.symbols_corpus.write_text(json.dumps({'commit': receipt['commit'], 'cases': cases[fixture_count:]}), encoding='utf-8')
results = json.loads(run.stdout)
assert len(results) == len(expected)
for index, (actual, want) in enumerate(zip(results, expected)):
    assert not actual['Panic'], (index, actual['Panic'])
    if 'character' in want:continue
    assert bool(actual['Error']) == want.get('error', False), (index, actual['Error'])
    if want.get('error'):continue
    if want.get('empty'):
        assert not actual['Steps'];continue
    if 'key' in want:
        assert len(actual['Steps']) == 1 and len(actual['Steps'][0]['Keys']) == 1
        step, key = actual['Steps'][0], actual['Steps'][0]['Keys'][0]
        assert (key['Key'], key['Hold'], key['Release'], key['Fourway'], key['Charge'], step['Greater']) == (want['key'], want['hold'], want['release'], want['fourway'], want['charge'], want['greater']), (index, step)
    if 'complete' in want:assert [tick['Complete'] for tick in actual['Ticks']] == want['complete'], (index, actual['Ticks'])
    if 'buffers' in want:assert [tick['Buffer'] for tick in actual['Ticks']] == want['buffers'], (index, actual['Ticks'])
    if 'remapped' in want:assert [key['Key'] for key in actual['Steps'][0]['Keys']] == want['remapped']
    if 'states' in want:
        for tick, states in zip(actual['Ticks'], want['states']):
            for key, value in states.items():assert tick['States'][key] == value, (index, key, tick['States'])
for character in characters:
    start = character.pop('start');lines = character.pop('lines');parsed = results[start:start+len(lines)]
    character['diagnostics'] = [{'line': line, 'error': result['Error']} for line, result in zip(lines, parsed) if result['Error']]
    character['withoutDiagnostics'] = len(lines) - len(character['diagnostics'])
report = {'commit': receipt['commit'], 'compiler': receipt['compiler'], 'oracleExecutableSha256': receipt['executableSha256'],
          'syntheticCases': fixture_count, 'characters': characters, 'originalDefinitions': sum(row['definitions'] for row in characters),
          'matched': True, 'scope': 'Pinned native individual-command parser, matching and actual input counter/state functions under fixture-provided configuration and physical-direction booleans. Not Web execution, hardware/SOCD, CommandList sharing or file/version policy.', 'goalComplete': False}
args.output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print('PASS '+str(fixture_count)+' native command fixtures; inspected '+str(report['originalDefinitions'])+' original definitions across '+str(len(characters))+' files')
