import argparse
import json
import re
from pathlib import Path


REFERENCE = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'


def build_inventory(registry, compiler):
    functions = {}
    compiler = registry + '\n' + compiler
    starts = list(re.finditer(r'func \(c \*CharCompiler\) (\w+)\(', compiler))
    for index, match in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(compiler)
        functions[match.group(1)] = compiler[match.start():end]
    block = registry.split('c.scmap = map[string]scFunc{', 1)[1].split('\n\t}', 1)[0]
    entries = re.findall(r'"([a-z0-9]+)"\s*:\s*c\.(\w+)', block)
    controllers = []
    for name, function in entries:
        pending = [(function, '')]
        visited = set()
        parameters = set()
        unresolved = set()
        while pending:
            current, prefix = pending.pop()
            context = (current, prefix)
            if context in visited:
                continue
            visited.add(context)
            body = functions.get(current)
            if body is None:
                unresolved.add(current)
                continue
            parameters.update(re.findall(r'(?:stateParam|param\w*)\(is,\s*(?:sc,\s*)?"([^"]+)"', body))
            parameters.update(re.findall(r'is\["([^"]+)"\]', body))
            parameters.update(prefix + suffix for suffix in re.findall(r'(?:stateParam\(is,\s*|param\w*\(is,\s*sc,\s*|is\[)prefix\s*\+\s*"([^"]+)"', body))
            if re.search(r'stateParam\(is,\s*[a-zA-Z_]\w*|param\w*\(is,\s*sc,\s*[a-zA-Z_]\w*', body):
                dynamic = re.findall(r'(?:stateParam\(is,\s*|param\w*\(is,\s*sc,\s*)([a-zA-Z_]\w*)', body)
                if any(value != 'prefix' for value in dynamic):
                    unresolved.add(current + ': dynamic parameter names')
            for called in re.findall(r'c\.(\w+)\(is,', body):
                if called in functions:
                    calls = re.findall(r'c\.' + re.escape(called) + r'\(is,\s*sc,\s*("[^"]*"|prefix)\s*[,)]', body)
                    if calls:
                        pending.extend((called, prefix if value == 'prefix' else value[1:-1]) for value in calls)
                    else:
                        pending.append((called, prefix))
        if name == 'mapreset':
            parameters.update('exclude' + str(index) for index in range(2, 9))
        if name in {'mapset', 'mapadd', 'parentmapset', 'parentmapadd', 'rootmapset', 'rootmapadd', 'teammapset', 'teammapadd'}:
            unresolved.add('map(KEY) assignment syntax requires semantic parsing')
        controllers.append({
            'controller': name,
            'compilerFunction': function,
            'parameterCandidates': sorted(parameters),
            'commonParameters': ['persistent', 'ignorehitpause'],
            'compilerFunctionsInspected': sorted({current for current, prefix in visited}),
            'compilerContextsInspected': [{'function': current, 'prefix': prefix} for current, prefix in sorted(visited)],
            'unresolvedExtraction': sorted(unresolved),
            'coverageStatus': 'not semantically certified',
        })
    if len({row['controller'] for row in controllers}) != len(entries):
        raise ValueError('Duplicate controller registry entries')
    return {'referenceCommit': REFERENCE, 'controllerCount': len(controllers), 'controllers': controllers}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--registry', type=Path, default=Path('outputs/ikemen-compiler.go'))
    parser.add_argument('--compiler', type=Path, default=Path('outputs/ikemen-compiler-functions.go'))
    parser.add_argument('--output', type=Path, default=Path('work/Docs/CONTROLLER-AUDIT.json'))
    args = parser.parse_args()
    inventory = build_inventory(args.registry.read_text(encoding='utf-8-sig'), args.compiler.read_text(encoding='utf-8-sig'))
    args.output.write_text(json.dumps(inventory, indent=2) + '\n', encoding='utf-8')
    lines = [
        '# Controller compatibility work ledger', '',
        f"Reference: Ikemen GO `{REFERENCE}`; {inventory['controllerCount']} registered controllers.", '',
        'This is a source inventory, not a claim of full compatibility. Parameter candidates require semantic review; dynamic names and delegated parsing require manual verification. Existing execution paths are not automatically certified.', '',
        'Completion requires each controller and parameter to have native defaults, expression evaluation, ownership/redirection, pause/persistence semantics, executable tests, and game regression coverage. Unsupported features must not be silently ignored.', '',
        '| Controller | Parameter candidates | Extraction follow-up | Semantic certification |',
        '| --- | --- | --- | --- |',
    ]
    for row in inventory['controllers']:
        parameters = ', '.join(row['parameterCandidates']).replace('|', '\\|') or 'None extracted; verify reference'
        unresolved = ', '.join(row['unresolvedExtraction']) or 'Review delegated parser/defaults'
        lines.append(f"| {row['controller']} | {parameters} | {unresolved} | Pending |")
    args.output.with_suffix('.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(json.dumps({'controllers': inventory['controllerCount'], 'certified': 0}))


if __name__ == '__main__':
    main()
