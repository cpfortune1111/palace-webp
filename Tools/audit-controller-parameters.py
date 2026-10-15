import argparse
import json
import re
from pathlib import Path


REFERENCE = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'


def finite_parameter_keys(body):
    pattern = r'for\s+(?P<index>\w+)\s*:=\s*(?P<first>\d+);\s*(?P=index)\s*<=\s*(?P<last>\d+);\s*(?P=index)\+\+\s*\{\s*(?P<key>\w+)\s*:=\s*fmt\.Sprintf\("(?P<format>[^"%]*%d[^"%]*)",\s*(?P=index)\)\s*if\s+err\s*:=\s*c\.stateParam\(is,\s*(?P<use>\w+)\s*,'
    names = set()
    resolved_positions = set()
    for match in re.finditer(pattern, body):
        first, last = int(match.group('first')), int(match.group('last'))
        if match.group('key') != match.group('use') or first > last or last - first > 64:
            continue
        names.update(match.group('format') % index for index in range(first, last + 1))
        resolved_positions.add(match.start('use'))
    return names, resolved_positions


def build_inventory(registry, compiler):
    functions = {}
    parameter_arguments = {}
    compiler = registry + '\n' + compiler
    starts = list(re.finditer(r'func \(c \*CharCompiler\) (\w+)\(', compiler))
    for index, match in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(compiler)
        functions[match.group(1)] = compiler[match.start():end]
        signature = compiler[match.end():].split(')', 1)[0]
        argument = re.match(r'is\s+IniSection\s*,\s*sc\s+[^,]+,\s*(\w+)\s+string\b', signature)
        if argument and argument.group(1) != 'prefix':
            parameter_arguments[match.group(1)] = argument.group(1)
    block = registry.split('c.scmap = map[string]scFunc{', 1)[1].split('\n\t}', 1)[0]
    key_helpers = set(parameter_arguments) | {'paramValue', 'paramPrefixValue', 'paramAnimtype', 'paramHittype', 'paramProjection', 'paramClsnType', 'paramStringList'}
    dynamic_key = r'(?:stateParam\(is,\s*|(?:' + '|'.join(sorted(map(re.escape, key_helpers))) + r')\(is,\s*sc,\s*)([a-zA-Z_]\w*)'
    entries = re.findall(r'"([a-z0-9]+)"\s*:\s*c\.(\w+)', block)
    controllers = []
    for name, function in entries:
        pending = [(function, '', ())]
        visited = set()
        parameters = set()
        unresolved = set()
        while pending:
            current, prefix, bindings = pending.pop()
            context = (current, prefix, bindings)
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
            bound = dict(bindings)
            finite_names, finite_positions = finite_parameter_keys(body)
            parameters.update(finite_names)
            if re.search(dynamic_key, body):
                dynamic = list(re.finditer(dynamic_key, body))
                parameters.update(bound[match.group(1)] for match in dynamic if match.group(1) in bound)
                if any(match.group(1) != 'prefix' and match.group(1) not in bound and match.start(1) not in finite_positions for match in dynamic):
                    unresolved.add(current + ': dynamic parameter names')
            for called in re.findall(r'c\.(\w+)\(is,', body):
                if called in functions:
                    argument = parameter_arguments.get(called)
                    if argument:
                        values = re.findall(r'c\.' + re.escape(called) + r'\(is,\s*sc,\s*(prefix\s*\+\s*"[^"]*"|"[^"]*"|[a-zA-Z_]\w*)\s*[,)]', body)
                        for value in values:
                            if value.startswith('"'):
                                resolved = value[1:-1]
                            elif value.startswith('prefix') and '+' in value:
                                resolved = prefix + re.search(r'"([^"]*)"', value).group(1)
                            else:
                                resolved = bound.get(value)
                            pending.append((called, prefix, ((argument, resolved),) if resolved is not None else ()))
                        if not values:
                            pending.append((called, prefix, ()))
                        continue
                    calls = re.findall(r'c\.' + re.escape(called) + r'\(is,\s*sc,\s*("[^"]*"|prefix)\s*[,)]', body)
                    if calls:
                        pending.extend((called, prefix if value == 'prefix' else value[1:-1], ()) for value in calls)
                    else:
                        pending.append((called, prefix, ()))
        if name in {'mapset', 'mapadd', 'parentmapset', 'parentmapadd', 'rootmapset', 'rootmapadd', 'teammapset', 'teammapadd'}:
            unresolved.add('map(KEY) assignment syntax requires semantic parsing')
        controllers.append({
            'controller': name,
            'compilerFunction': function,
            'parameterCandidates': sorted(parameters),
            'commonParameters': ['persistent', 'ignorehitpause'],
            'compilerFunctionsInspected': sorted({current for current, prefix, bindings in visited}),
            'compilerContextsInspected': [{'function': current, 'prefix': prefix, 'parameterBindings': dict(bindings)} for current, prefix, bindings in sorted(visited)],
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
