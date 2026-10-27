from stage_reflection import parse_stage_reflection


assert parse_stage_reflection('[Reflection]\nwindow=-20,-40,20,0')['window'] == [-20, -40, 20, 0]
angles = {'angle': 0, 'xangle': 0, 'yangle': 0, 'color': [255, 255, 255], 'window': [0, 0, 0, 0]}
assert parse_stage_reflection('') == {'intensity': 0, 'xscale': 1, 'yscale': 1, 'layerno': 0, **angles}
assert parse_stage_reflection('[Reflection]\nintensity=50') == {'intensity': 50, 'xscale': 1, 'yscale': 1, 'layerno': 0, **angles}
assert parse_stage_reflection('[reflection]\nintensity=999\nlayerno=-8\nxscale=-2\nyscale=0') == {'intensity': 255, 'xscale': -2, 'yscale': 0, 'layerno': -1, **angles}
assert parse_stage_reflection('[REFLECTION]\nintensity=-1\nlayerno=3 ; ignored comment\n[Music]\nintensity=99')['intensity'] == 0
assert parse_stage_reflection('[Reflection]\nlayerno=+2')['layerno'] == 0
assert parse_stage_reflection('[Reflection]\nxscale=.1')['xscale'] == 0.10000000149011612
rotated = parse_stage_reflection('[Reflection]\nangle=-7.5\nxangle=.1\nyangle=20')
assert [rotated['angle'], rotated['xangle'], rotated['yangle']] == [-7.5, 0.10000000149011612, 20]
assert parse_stage_reflection('[Reflection]\ncolor=999,-1,128')['color'] == [255, 0, 128]
assert parse_stage_reflection('[Reflection]\ncolor=64')['color'] == [64, 0, 0]
for invalid in ['1,2,3,4', '1,no,3']:
    try:
        parse_stage_reflection('[Reflection]\ncolor=' + invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid reflection color was silently accepted')
try:
    parse_stage_reflection('[Reflection]\nlayerno=invalid')
except ValueError:
    pass
else:
    raise AssertionError('Invalid reflection integer syntax was silently accepted')
assert parse_stage_reflection('[Reflection]\nwindow=1,2')['window'] == [1, 2, 0, 0]
assert parse_stage_reflection('[Reflection]\nwindow=.1')['window'] == [0.10000000149011612, 0, 0, 0]
for invalid in ['1,2,3,4,5', '1,bad,3,4']:
    try:
        parse_stage_reflection('[Reflection]\nwindow=' + invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('Invalid reflection window was silently accepted')
print('Stage reflection import preserves native defaults, clamped layer/intensity/RGB and float32 scales/angles/windows for supported literal syntax')
