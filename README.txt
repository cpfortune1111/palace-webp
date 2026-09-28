Prototype 0.13 — first Venus runtime slice

Real Venus source used:
- venus.sff / venus.air for runtime animation atlas
- venus.cns + venus_Common.cns for movement/state semantics
- CNS constants imported:
  walk.fwd=9.0
  walk.back=-6.75
  jump.neu.y=-40.0
  jump.fwd.x=8.0
  jump.back.x=-8.0
  movement.yaccel=1.76

Implemented compatibility slice:
- State 0 idle
- State 20 forward/back walk with AIR 20/21
- State 11 crouch
- State 40 jump start
- State 50/51 airborne motion using Venus CNS constants
- State 52 / AIR 47 landing
- 60Hz-style state update
- Keyboard arrows (Up or Z jump)
- Touch buttons are held canonical inputs instead of direct animation selectors
- Venus starts at X=-280, ground Y=660, 1:1 scale
- Mars remains fixed comparison dummy at X=+280
- Stage zoom 1.860 and stage Y -60 unchanged

This is NOT yet a general CNS/CMD interpreter. It is the first engine runtime slice reproduced from Venus' real CNS semantics so we can validate movement before implementing the parser/VM.
