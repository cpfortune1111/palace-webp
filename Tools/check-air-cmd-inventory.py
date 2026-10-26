"""Verify actual pinned AIR/CMD audit inputs and metadata, not engine conformance."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re

cli = argparse.ArgumentParser(description=__doc__)
for name in ('anim', 'input', 'compiler', 'air', 'mugen-cmd'):
    cli.add_argument('--' + name, required=True, type=Path)
args = cli.parse_args()
root = Path(__file__).resolve().parents[1]
ledger = json.loads((root / 'Docs/AIR-CMD-COVERAGE.json').read_text(encoding='utf-8-sig'))
references = ledger['references']
pins = {Path(row['path']).name: row['sha256'] for row in references['nativeSources']}
sources = {}
for name, source_name in (('anim', 'anim.go'), ('input', 'input.go'), ('compiler', 'compiler.go'), ('air', 'air.html'), ('mugen_cmd', 'kfm.cmd')):
    data = getattr(args, name).read_bytes()
    expected = pins[source_name] if name in ('anim', 'input', 'compiler') else references['air']['sha256'] if name == 'air' else references['cmdExample']['sha256']
    assert hashlib.sha256(data).hexdigest() == expected, source_name + ' pin'
    sources[name] = data.decode('utf-8-sig')

compiler = sources['compiler'].split('func (c *CharCompiler) Compile(', 1)[1]
specific = compiler.split('// Read specific parameters', 1)[1].split('// Parse the command string', 1)[0]
specific_keys = re.findall(r'is\.Read(?:I32|Bool)\("([^"]+)"', specific)
assert {row['name'] for row in ledger['cmd']['commandParameters']} == {'name', 'command', *specific_keys}
defaults = compiler.split('case "defaults":', 1)[1].split('// Parse commands', 1)[0]
assert set(re.findall(r'is\.Read(?:I32|Bool)\("([^"]+)"', defaults)) == set(ledger['cmd']['defaultsParameters'])
remaps = compiler.split('case "remap":', 1)[1].split('case "defaults":', 1)[0]
assert set(re.findall(r'rm\("([^"]+)"', remaps)) == set(ledger['cmd']['nativeButtons'])
constructor = sources['input'].split('func NewCommandList(', 1)[1].split('func (cl *CommandList) AddCommand', 1)[0]
for key, value in ledger['cmd']['nativeCommandListDefaults'].items():
    assert re.search(r'\b' + key + r':\s*' + str(value).lower() + r'\b', constructor), key
for field in ledger['cmd']['nativeApiCommandSpecFields']:
    spec = sources['input'].split('type CommandSpec struct {', 1)[1].split('}', 1)[0]
    assert re.search(r'^\s*' + field + r'\s+', spec, re.M), field

symbols = sources['input'].split('func (c *Command) ReadCommandSymbols(', 1)[1].split('func (c *Command) AutoGreaterExpand(', 1)[0]
groups = re.findall(r"case\s+((?:'[^']+'\s*,\s*)+'[^']+')\s*:", symbols)
key_sets = [set(re.findall(r"'([^']+)'", group)) for group in groups]
assert set(ledger['cmd']['nativeDirectionBases']) in key_sets
assert set(ledger['cmd']['nativeButtons']) in key_sets
assert set(re.findall(r'k = CK_(\w+)', symbols)) == set(ledger['cmd']['nativeDirectionTokens'])
prefixes = symbols.split('ParseKey:', 1)[0]
assert set(re.findall(r"case '([^']+)':", prefixes)) == set(ledger['cmd']['prefixes'])
for separator in ledger['cmd']['separators']:
    assert '"' + separator + '"' in symbols

spec = importlib.util.spec_from_file_location('document_reference', root / 'Tools/audit-engine-expression-baseline.py')
document_reference = importlib.util.module_from_spec(spec)
spec.loader.exec_module(document_reference)
document = document_reference.DocumentTree()
document.feed(sources['air'])
section = next(node.parent for node in document.root.walk('h2') if document_reference.compact(node.text()) == 'Interpolation')
assert {document_reference.compact(node.text()) for node in section.walk('dt')} == {row['name'] for row in ledger['air']['interpolation']}
assert [row['position'] for row in ledger['air']['frameFields']] == list(range(1, 11))
for index in range(10):
    assert 'ary[' + str(index) + ']' in sources['anim'], 'native AIR field ' + str(index + 1)

rows = ledger['air']['frameFields'] + ledger['air']['directives'] + ledger['air']['interpolation'] + [ledger['air']['blendConsumer']] + ledger['cmd']['commandParameters'] + ledger['cmd']['rules']
assert len({row['id'] for row in rows}) == len(rows)
for row in rows:
    assert set(row['stages']) == {'Parsed', 'Executable', 'Source-verified', 'Semantically tested'}
    assert set(row['stages'].values()) <= {'Unassessed', 'Partial', 'Unsupported'}
for source in ledger['air']['blendConsumer']['runtimeConsumers'] + ledger['air']['blendConsumer']['tests'] + ledger['cmd']['examinedConsumers']:
    assert (root / source).is_file(), source
assert ledger['goalComplete'] is False
print('PASS five pinned AIR/CMD inputs, native parameter/default/key facts, interpolation names and distinct partial evidence records')
