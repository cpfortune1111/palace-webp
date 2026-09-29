Prototype 0.19.0 · CNS Runtime M1
BUILD cns-runtime-m1-20260929-01

Upload/replace:
1. index.html
2. venus_runtime_states.json

Do NOT replace StageTraining.glb or image/atlas files.

Acceptance tests:
- Hold DOWN: State 11 should show CTRL 1 (generic !AILevel -> CtrlSet).
- Jump/land: State 52 begins CTRL 0; at Time=3 generic trigger group grants CTRL 1.
- Hold UP through landing: once State 52 gains CTRL, direct 52 -> 40 is allowed.
- Camera ±2850, player ±3750, EDGE 25%, zoom 1.860, joystick ±30°/±15° unchanged.

M1 note:
Generic trigger-group/evaluator path is now used for State 11 and State 52 CtrlSet/ChangeState.
Movement/landing adapters remain temporarily for regression safety and will be removed incrementally.
