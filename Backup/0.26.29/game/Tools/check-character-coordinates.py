from character_coordinates import definition_coordinates


assert definition_coordinates('')['coordinateSystem']['localcoord'] == [320, 240]
assert definition_coordinates('[Info]\nlocalcoord = 1280,720 ; comment')['coordinateSystem'] == {
    'localcoord': [1280, 720], 'webWorldWidth': 1280}
assert definition_coordinates('[Size]\nlocalcoord=640,480')['coordinateSystem']['localcoord'] == [320, 240]
assert definition_coordinates('[INFO]\nLOCALCOORD=640')['coordinateSystem']['localcoord'] == [640, 240]
for value in ('0,720', '-1,240', 'bad,240'):
    try:
        definition_coordinates('[Info]\nlocalcoord=' + value)
    except ValueError:
        continue
    raise AssertionError('Invalid coordinates were accepted')
print('Character coordinate defaults, definition section/case, partial pair and explicit invalid-input diagnostics passed')
