"""Lexical extraction from pinned Go reference text, not a Go compiler/parser."""
import re


def matching_delimiter(source, start, opening='{', closing='}'):
    if start < 0 or start >= len(source) or source[start] != opening:
        raise ValueError('Expected opening reference delimiter')
    depth, index = 1, start + 1
    while index < len(source):
        if source.startswith('//', index):
            end = source.find('\n', index + 2)
            index = len(source) if end < 0 else end + 1
            continue
        if source.startswith('/*', index):
            end = source.find('*/', index + 2)
            if end < 0:
                raise ValueError('Unterminated reference comment')
            index = end + 2
            continue
        char = source[index]
        if char in ('"', "'", '`'):
            quote = char
            index += 1
            while index < len(source):
                if source[index] == '\\' and quote != '`':
                    index += 2
                elif source[index] == quote:
                    index += 1
                    break
                else:
                    index += 1
            else:
                raise ValueError('Unterminated reference literal')
            continue
        if char == opening:
            depth += 1
        elif char == closing:
            depth -= 1
            if depth == 0:
                return index + 1
        index += 1
    raise ValueError('Unterminated reference delimiter')


def declaration(source, marker):
    matches = list(re.finditer(r'^' + re.escape(marker), source, re.M))
    if len(matches) != 1:
        raise ValueError('Expected one reference declaration: ' + marker)
    start = matches[0].start()
    brace = source.find('{', matches[0].end())
    end = matching_delimiter(source, brace)
    return {'text': source[start:end], 'body': source[brace + 1:end - 1],
            'start': start, 'end': end, 'line': source.count('\n', 0, start) + 1}
