Prototype 0.16.1 — CNS/ZSS Runtime Slice 1 hotfix

Fixes movement constants binding:
- Runtime movement constants now live in venus_runtime_states.json with the State IR.
- index.html reads constants from stateIR.constants, not venus_runtime.json.
- JSON fetches use cache:no-store plus ?v=0161 cache busting.
- Required constants are validated at startup; missing values show RUNTIME ERROR instead of silently becoming 0.

Expected regression values:
walk.fwd.x = 9
walk.back.x = -6.75
jump.neu.x = 0
jump.fwd.x = 8
jump.back.x = -8
jump.y = -40
movement.yaccel = 1.76

Joystick and stage/camera calibration unchanged.
