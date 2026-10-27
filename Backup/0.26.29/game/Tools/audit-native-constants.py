import re


REFERENCE = 'cb56d73badb322f3725257c2e8cfd157b2c3989d'


def builtin_constants(source):
    start = source.index('\tcase "const":')
    end = source.index('\tcase "const240p":', start)
    block = source[start:end]
    block = block[block.index('switch c.token {') + len('switch c.token {'):]
    result = []
    pattern = r'\bcase\s+((?:"[^"]+"(?:,\s*)?)+):[^\r\n]*\r?\n\s*out\.append\((OC_const_\w+)\)'
    for match in re.finditer(pattern, block):
        for name in re.findall(r'"([^"]+)"', match[1]):
            result.append({'name': name, 'opcode': match[2]})
    cases = re.findall(r'\bcase\s+((?:"[^"]+"(?:,\s*)?)+):', block)
    expected = [name for case in cases for name in re.findall(r'"([^"]+)"', case)]
    if expected != [row['name'] for row in result]:
        raise ValueError('Unhandled Const compiler case')
    if len(set(expected)) != len(expected):
        raise ValueError('Duplicate Const name')
    return result
