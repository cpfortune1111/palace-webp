import argparse
import hashlib
import json
import re
import shutil
import struct
import zipfile
from collections import Counter
from pathlib import Path


def digest(data):
    return hashlib.sha256(data).hexdigest()


def sections(data):
    result = []
    for number, raw in enumerate(data.decode('utf-8-sig').splitlines(), 1):
        line = raw.split(';', 1)[0].strip()
        match = re.fullmatch(r'\[(.*?)\]', line)
        if match:
            result.append({'section': match[1], 'line': number, 'entries': []})
        elif line and result:
            result[-1]['entries'].append({'line': number, 'text': line})
    return result


def run(source, destination, runtime):
    destination.mkdir(parents=True, exist_ok=True)
    original = destination / 'original'
    original.mkdir(exist_ok=True)
    definition = source / 'SailorVenus.def'
    definition_sections = sections(definition.read_bytes())
    dependencies = {}
    for section in definition_sections:
        if section['section'].lower() == 'files':
            for entry in section['entries']:
                key, value = entry['text'].split('=', 1)
                if value.strip():
                    dependencies[key.strip().lower()] = value.strip().strip('"')
    names = sorted(set(dependencies.values()) | {definition.name})
    files = []
    for name in names:
        path = (source / name).resolve()
        if not path.is_relative_to(source.resolve()):
            raise ValueError('Source dependency escapes character directory')
        data = path.read_bytes()
        shutil.copyfile(path, original / name)
        files.append({'path': name, 'bytes': len(data), 'sha256': digest(data),
                      'roles': sorted(key for key, value in dependencies.items() if value == name)})
    controllers = []
    states = []
    commands = []
    parsed = {}
    for name in names:
        if Path(name).suffix.lower() not in ('.cns', '.st', '.cmd', '.def', '.dat'):
            continue
        parsed[name] = sections((source / name).read_bytes())
        owner = None
        for section in parsed[name]:
            match = re.match(r'^statedef\s+(-?\d+)', section['section'], re.I)
            if match:
                owner = int(match[1])
                states.append({'id': owner, 'file': name, **section})
            elif re.match(r'^state\s', section['section'], re.I):
                controller = {'state': owner, 'file': name, **section}
                controller['type'] = next((entry['text'].split('=', 1)[1].strip() for entry in section['entries']
                                           if re.match(r'^type\s*=', entry['text'], re.I)), 'UNSPECIFIED')
                controllers.append(controller)
            elif section['section'].lower() == 'command':
                commands.append({'file': name, **section})
    actions = []
    for section in sections((source / dependencies['anim']).read_bytes()):
        match = re.fullmatch(r'Begin Action\s+(-?\d+)', section['section'], re.I)
        if not match:
            continue
        frames = []
        for entry in section['entries']:
            if re.match(r'^-?\d+\s*,', entry['text']):
                values = [part.strip() for part in entry['text'].split(',')]
                frames.append({'line': entry['line'], 'sprite': [int(values[0]), int(values[1])],
                               'offset': [int(values[2]), int(values[3])], 'ticks': int(values[4]),
                               'extra': values[5:]})
        actions.append({'id': int(match[1]), 'frames': frames, **section})
    sff = (source / dependencies['sprite']).read_bytes()
    if sff[:12] != b'ElecbyteSpr\x00' or sff[15] != 2:
        raise ValueError('Only inspected SFF v2 is supported')
    sprite_offset, count, palette_offset, palette_count = struct.unpack_from('<4I', sff, 36)
    sprites = []
    for index in range(count):
        header = struct.unpack_from('<HHHHhhHBBIIHH', sff, sprite_offset + index * 28)
        sprites.append(dict(zip(('group', 'number', 'width', 'height', 'axisX', 'axisY', 'link',
                                 'format', 'depth', 'offset', 'bytes', 'palette', 'flags'), header), index=index))
    palettes = []
    for index in range(palette_count):
        header = struct.unpack_from('<HHHHII', sff, palette_offset + index * 16)
        palettes.append(dict(zip(('group', 'number', 'colors', 'link', 'offset', 'bytes'), header), index=index))
    snd = (source / dependencies['sound']).read_bytes()
    if snd[:12] != b'ElecbyteSnd\x00':
        raise ValueError('Unexpected SND header')
    sound_count, offset = struct.unpack_from('<2I', snd, 16)
    sounds = []
    visited = set()
    for index in range(sound_count):
        if offset in visited or offset + 16 > len(snd):
            raise ValueError('Invalid SND linked directory')
        visited.add(offset)
        next_offset, length, group, number = struct.unpack_from('<IIii', snd, offset)
        sample = snd[offset + 16:offset + 16 + length]
        if len(sample) != length:
            raise ValueError('Truncated sound')
        sounds.append({'group': group, 'number': number, 'bytes': length, 'sha256': digest(sample),
                       'offset': offset + 16, 'riff': sample[:4] == b'RIFF'})
        offset = next_offset
    sprite_keys = {(sprite['group'], sprite['number']) for sprite in sprites}
    missing_sprites = [{'action': action['id'], **frame} for action in actions for frame in action['frames']
                       if frame['sprite'][0] >= 0 and tuple(frame['sprite']) not in sprite_keys]
    source_types = Counter(controller['type'].lower() for controller in controllers)
    runtime_types = {value.lower() for value in re.findall(r"case '([^']+)':", runtime.read_text(encoding='utf-8'))}
    coverage = [{'type': kind, 'controllers': amount,
                 'status': 'handler-present-not-full-semantic-coverage' if kind in runtime_types else 'no-runtime-handler'}
                for kind, amount in sorted(source_types.items())]
    references = []
    state_ids = {state['id'] for state in states}
    action_ids = {action['id'] for action in actions}
    sound_ids = {(sound['group'], sound['number']) for sound in sounds}
    for controller in controllers:
        kind = controller['type'].lower()
        target_key = {'changestate': 'value', 'selfstate': 'value', 'changeanim': 'value',
                      'helper': 'stateno', 'explod': 'anim', 'projectile': 'projanim', 'playsnd': 'value'}.get(kind)
        if not target_key:
            continue
        for entry in controller['entries']:
            parts = entry['text'].split('=', 1)
            if len(parts) != 2 or parts[0].strip().lower() != target_key:
                continue
            value = parts[1].strip()
            reference = {'file': controller['file'], 'line': entry['line'], 'state': controller['state'],
                         'type': kind, 'expression': value, 'status': 'dynamic-or-external-review'}
            if kind == 'playsnd':
                match = re.fullmatch(r'(?i)(s?)(-?\d+)\s*,\s*(-?\d+)', value)
                if match:
                    reference['status'] = 'present' if (int(match[2]), int(match[3])) in sound_ids else 'missing'
            elif re.fullmatch(r'-?\d+', value):
                targets = state_ids if kind in ('changestate', 'selfstate', 'helper') else action_ids
                reference['status'] = 'present' if int(value) in targets else 'missing'
            references.append(reference)
    manifest = {'schema': 1, 'character': 'Sailor Venus', 'baseline': '0.23.7',
                'definition': definition.name, 'dependencies': dependencies, 'files': files,
                'counts': {'files': len(files), 'states': len(states), 'controllers': len(controllers),
                           'commands': len(commands), 'actions': len(actions), 'sprites': len(sprites),
                           'palettes': len(palettes), 'sounds': len(sounds)},
                'missingAIRSpriteReferences': missing_sprites, 'controllerCoverage': coverage,
                'referenceChecks': references, 'runtimeSHA256': digest(runtime.read_bytes()),
                'limits': ['Raw section entries are preserved; expressions are not compiled or semantically validated.',
                           'Dynamic and external references require review; static missing references may be unused source branches.',
                           'Imported sources are NOT wired into the playable runtime.',
                           'Original SFF/SND are in the local source package, not uploaded to GitHub.']}
    bundles = {'manifest.json': manifest, 'state_sections.json': {'states': states, 'controllers': controllers},
               'command_sections.json': commands, 'air_sections.json': actions,
               'sff_directory.json': {'sprites': sprites, 'palettes': palettes}, 'snd_directory.json': sounds,
               'text_sections.json': parsed}
    for name, content in bundles.items():
        (destination / name).write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    archive = destination.parent / 'venus-source-import-v1.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as output:
        for path in sorted(destination.rglob('*')):
            if path.is_file():
                output.write(path, 'venus/' + path.relative_to(destination).as_posix())
    print(json.dumps({'counts': manifest['counts'], 'missingSprites': len(missing_sprites),
                      'archiveBytes': archive.stat().st_size, 'archiveSHA256': digest(archive.read_bytes()),
                      'coverage': coverage}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--destination', type=Path, required=True)
    parser.add_argument('--runtime', type=Path, required=True)
    arguments = parser.parse_args()
    run(arguments.source, arguments.destination, arguments.runtime)
