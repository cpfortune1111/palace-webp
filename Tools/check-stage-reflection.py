from stage_reflection import parse_stage_reflection


assert parse_stage_reflection('') == {'intensity': 0, 'xscale': 1, 'yscale': 1, 'layerno': 0}
assert parse_stage_reflection('[Reflection]\nintensity=50') == {'intensity': 50, 'xscale': 1, 'yscale': 1, 'layerno': 0}
assert parse_stage_reflection('[reflection]\nintensity=999\nlayerno=-8\nxscale=-2\nyscale=0') == {'intensity': 255, 'xscale': -2, 'yscale': 0, 'layerno': -1}
assert parse_stage_reflection('[REFLECTION]\nintensity=-1\nlayerno=3 ; ignored comment\n[Music]\nintensity=99')['intensity'] == 0
assert parse_stage_reflection('[Reflection]\nlayerno=+2')['layerno'] == 0
assert parse_stage_reflection('[Reflection]\nxscale=.1')['xscale'] == 0.10000000149011612
try:
    parse_stage_reflection('[Reflection]\nlayerno=invalid')
except ValueError:
    pass
else:
    raise AssertionError('Invalid reflection integer syntax was silently accepted')
print('Stage reflection import preserves native defaults, clamped layer/intensity and float32 scales for supported literal syntax')
