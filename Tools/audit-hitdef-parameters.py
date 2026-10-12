import argparse
import html
import json
import re
from collections import defaultdict
from pathlib import Path


IMPLEMENTED = {
    'damage', 'kill', 'fall.kill', 'pausetime', 'guard.pausetime',
    'ground.slidetime', 'ground.hittime', 'guard.slidetime', 'guard.hittime',
    'guard.ctrltime', 'air.hittime', 'yaccel', 'fall.damage', 'fall', 'air.fall',
    'fall.xvelocity', 'fall.yvelocity', 'down.recovertime',
    'ground.cornerpush.veloff', 'guard.cornerpush.veloff', 'air.cornerpush.veloff',
    'ground.cornerpush.velmul', 'guard.cornerpush.velmul', 'air.cornerpush.velmul',
    'p1sprpriority', 'p2sprpriority', 'score', 'fall.envshake.time',
    'fall.envshake.freq', 'fall.envshake.ampl', 'fall.envshake.phase',
    'fall.envshake.mul',
}
PARTIAL = {
    'guard.dist': 'Root/helper HitDefs share actor guard-distance vectors with AttackDist; projectile snapshots also feed InGuardDist. Full local scale/defaults, eligibility and reset/persistence remain pending.',
    'guard.dist.width': 'Root caller integer expressions, alias priority, negative retention and omitted back-zero update actual proximity queries. Root/helper caller and independent projectile paths exist; full default/reset parity remains pending.',
    'guard.dist.height': 'Root vertical range updates actual strict proximity checks with same-plane safeguard. Root/helper/projectile proximity aggregation exists; custom defaults, scale and native eligibility remain pending.',
    'guard.dist.depth': 'Root depth vectors and strict pure query tests exist; actual Z gameplay and full actor/projectile integration remain pending.',
    'hitredlife': 'Explicit caller expressions consume red life using the independent attack factor, target defense and bounds. Native defaults, attack-base composition, queued timing, other assertion interactions and keepstate parity remain pending.',
    'guardredlife': 'Explicit guard red-life damage executes with its independent factor. Native defaults, air guarding, queued timing and other assertion interactions remain pending.',
    'dizzypoints': 'Explicit hit point damage executes with its independent attack factor, target defense and no life cap. Native defaults, attack-base composition, queued timing, existing-dizzy suppression and other assertion interactions remain pending.',
    'guardpoints': 'Explicit guard point damage executes with its independent attack factor and target defense. Native defaults, air guarding, queued timing and assertions remain pending.',
    'guard.kill': 'Nonlethal guard floor and native lethal-chip switch to hit reaction exist. Pinned native char.go confirms this switch is intentional. NoKO/NoGuardKO/global survival assertions, rounding and queued damage parity remain pending.',
    'attr': 'Attack classification and attribute masks exist; team/override parity is incomplete.',
    'priority': 'Root P1/P2 simultaneous attacks support all Hit/Miss/Dodge combinations and unequal priorities. Helper/projectile attack-class ties are not unified with this root resolver.',
    'hitflag': 'M/A/F and stance checks exist; complete D/H/L and +/- eligibility semantics are missing.',
    'guardflag': 'Ground H/L/M and imported-character aerial A contacts honor stance assertions and source UnGuardable. Aerial reactions execute original states 154/155. Venus aerial guard assets/state import and full SCF_guard/input ordering remain pending.',
    'animtype': 'Light/Medium/Hard/DiagUp mappings exist; Back/Up and fallback parity are incomplete.',
    'air.animtype': 'Same limited reaction mapping as animtype.',
    'ground.type': 'High/Low/Trip are handled; None does not suppress native reaction correctly.',
    'air.type': 'High/Low/Trip are handled; None semantics are incomplete.',
    'ground.velocity': '2D grounded velocity exists; native falling/down-state alternatives are incomplete.',
    'air.velocity': '2D aerial velocity exists; optional Z component is not implemented.',
    'guard.velocity': 'Ground X velocity exists; optional Z is explicitly unsupported.',
    'airguard.velocity': 'Explicit XY and native 1.5x/0.5x fallback air velocity execute in imported-character aerial guard reactions. Z, full native scale/default and helper collision parity remain pending.',
    'airguard.ctrltime': 'Explicit caller integer expressions and guard.ctrltime fallback drive original aerial guard CtrlSet. Full command eligibility and version/default parity remain pending.',
    'airguard.cornerpush.veloff': 'Explicit values and ground fallback feed actual aerial guard cornerpush. Full native corner/scale conditions remain pending.',
    'airguard.cornerpush.velmul': 'Explicit values and existing default multiplier drive aerial guard cornerpush. Full native default/version parity remains pending.',
    'sparkno': 'Character-owned S-prefixed sparks only; common fightfx sparks/defaults are not complete.',
    'guard.sparkno': 'Character-owned S-prefixed sparks only; common fightfx sparks/defaults are not complete.',
    'sparkxy': 'Explicit character spark offsets exist; complete default/common-spark parity is missing.',
    'hitsound': 'Character-owned sound playback exists; common/character ownership and native defaults are not complete.',
    'guardsound': 'Same ownership/default limitations as hitsound.',
    'p1stateno': 'Current paired throw path only; standalone/custom-state ownership semantics are incomplete.',
    'p2stateno': 'Custom hit/throw transitions exist; p2getp1state and standalone parity are incomplete.',
    'p1facing': 'Paired throw path only.',
    'id': 'Hit metadata/helper targeting exist; complete target-ID filtering is missing.',
    'nochainid': 'Single-ID helper/projectile check only; two-ID and root attack checks are missing.',
}


def function_body(source, name):
    start = source.index('func (c *CharCompiler) ' + name + '(')
    end = source.find('\nfunc ', start + 5)
    return source[start:end if end >= 0 else None]


def controller_usage(value, character, usage):
    if isinstance(value, dict):
        if value.get('type', '').lower() in ('hitdef', 'projectile'):
            for parameter in value.get('params', {}):
                usage[parameter.lower()].add(character)
        for child in value.values():
            controller_usage(child, character, usage)
    elif isinstance(value, list):
        for child in value:
            controller_usage(child, character, usage)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ikemen', type=Path, default=Path('outputs/ikemen-compiler-functions.go'))
    parser.add_argument('--mugen', type=Path, default=Path('outputs/mugen-sctrls.html'))
    parser.add_argument('--output', type=Path, default=Path('work/Docs/HITDEF-AUDIT.md'))
    args = parser.parse_args()
    compiler = args.ikemen.read_text(encoding='utf-8-sig')
    compiler_hitdef = function_body(compiler, 'hitDefSub') + function_body(compiler, 'hitDef')
    ikemen = set(re.findall(r'(?:stateParam|param\w*)\(is,\s*(?:sc,\s*)?"([\w.]+)"', compiler_hitdef))
    ikemen.update('palfx.' + name for name in re.findall(r'prefix\+"([\w.]+)"', function_body(compiler, 'palFXSub')))
    document = args.mugen.read_text(encoding='utf-8-sig')
    section = document[document.index('id="hitdef"'):document.index('id="hitfalldamage"')]
    terms = [html.unescape(re.sub('<[^>]+>', '', term)) for term in re.findall(r'<dt>(.*?)</dt>', section, re.S)]
    mugen = {match.group(1).lower() for term in terms if (match := re.match(r'([\w.]+)\s*=', term))}
    usage = defaultdict(set)
    root = Path('work')
    for character in ('Moon', 'Jupiter', 'Neptune', 'Saturn'):
        path = root / 'Char' / character / 'Battle' / (character.lower() + '_runtime.json')
        controller_usage(json.loads(path.read_text(encoding='utf-8-sig')), character, usage)
    for path in root.glob('venus_*.json'):
        controller_usage(json.loads(path.read_text(encoding='utf-8-sig')), 'Venus', usage)
    parameters = sorted(ikemen | mugen)
    rows = []
    for parameter in parameters:
        status = 'Implemented' if parameter in IMPLEMENTED else 'Partial' if parameter in PARTIAL else 'Not implemented'
        note = PARTIAL.get(parameter, 'Execution path present; numeric expression/default parity has not been certified for every input.' if status == 'Implemented' else 'No complete native execution path. Importing/storing a value is not implementation.')
        rows.append({'parameter': parameter, 'status': status, 'usedBy': sorted(usage[parameter]), 'reference': 'MUGEN + Ikemen' if parameter in mugen and parameter in ikemen else 'MUGEN' if parameter in mugen else 'Ikemen', 'note': note})
    missing_used = [row['parameter'] for row in rows if row['status'] == 'Not implemented' and row['usedBy']]
    lines = [
        '# HitDef parameter audit — 0.24.48', '',
        'This is an implementation audit, NOT a declaration of complete MUGEN/Ikemen compatibility.',
        'Scope: every named HitDef parameter in the official MUGEN 1.1 beta documentation and the pinned Ikemen compiler, including delegated PalFX parameters. Projectile-only parameters, controller persistent/ignorehitpause, StateDef parameters and undocumented fork extensions are outside this table.', '',
        '[MUGEN reference](https://www.elecbyte.com/mugendocs-11b1/sctrls.html#hitdef)',
        '[Pinned Ikemen compiler](https://github.com/ikemen-engine/Ikemen-GO/blob/cb56d73badb322f3725257c2e8cfd157b2c3989d/src/compiler_functions.go)', '',
        'Implemented means a WEB execution path exists, not that every default/expression/mode has engine-identical behavior. Partial and Not implemented must not be treated as supported. Current battles use two roots, 2D and no team mode. Both root simultaneous attacks now use the native equal-priority Hit/Miss/Dodge table; cancelled ties leave their HitDefs active.', '',
        f'Audited parameters: {len(rows)}. Current-source parameters with no complete execution path: ' + ', '.join(missing_used) + '.', '',
        'Runtime files reviewed: index.html, Char/Venus/venus-special-runtime.js, Engine/score-runtime.js, Engine/hit-priority.js, Engine/hit-attribute-mask.js, Engine/point-controllers.js, Engine/redlife-controllers.js and Engine/damage-assertions.js. Imported character runtime data was inspected for explicit usage, not inferred from visual tests.', '',
        '| Parameter | WEB status | Explicit source use | Reference | Limitation |',
        '|---|---|---|---|---|',
    ]
    lines.extend('| ' + ' | '.join([row['parameter'], row['status'], ', '.join(row['usedBy']) or '—', row['reference'], row['note']]) + ' |' for row in rows)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    args.output.with_suffix('.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'audited': len(rows), 'mugen': len(mugen), 'ikemen': len(ikemen), 'missingUsed': missing_used}))


if __name__ == '__main__':
    main()
