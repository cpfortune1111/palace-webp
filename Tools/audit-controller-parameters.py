import argparse
import json
import re
from pathlib import Path


REFERENCE = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'


def build_inventory(registry, compiler):
    functions = {}
    starts = list(re.finditer(r'func \(c \*CharCompiler\) (\w+)\(', compiler))
    for index, match in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(compiler)
        functions[match.group(1)] = compiler[match.start():end]
    block = registry.split('c.scmap = map[string]scFunc{', 1)[1].split('\n\t}', 1)[0]
    entries = re.findall(r'"([a-z0-9]+)"\s*:\s*c\.(\w+)', block)
    controllers = []
    for name, function in entries:
        pending = [function]
        visited = set()
        parameters = set()
        unresolved = set()
        while pending:
            current = pending.pop()
            if current in visited:
                continue
            visited.add(current)
            body = functions.get(current)
            if body is None:
                unresolved.add(current)
                continue
            parameters.update(re.findall(r'(?:stateParam|param\w*)\(is,\s*(?:sc,\s*)?"([^"]+)"', body))
            parameters.update(re.findall(r'is\["([^"]+)"\]', body))
            if re.search(r'(?:stateParam|param\w*)\(is,\s*(?:sc,\s*)?(?:prefix|[a-zA-Z_]\w*\s*\+)', body):
                unresolved.add(current + ': dynamic parameter names')
            for called in re.findall(r'c\.(\w+)\(is,', body):
                if called in functions:
                    pending.append(called)
        controllers.append({
            'controller': name,
            'compilerFunction': function,
            'parameterCandidates': sorted(parameters),
            'commonParameters': ['persistent', 'ignorehitpause'],
            'compilerFunctionsInspected': sorted(visited),
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
