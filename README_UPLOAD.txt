0.19.2 Generic Controller M2
Upload/replace index.html + venus_runtime_states.json.

Source-driven migrations:
- State 20: human command holdfwd/holdback -> generic VelSet; generic ChangeAnim owns AIR 20/21.
- State 40: generic VarSet sysvar(1); command expressions; nested ifelse(); generic VelSet; generic ChangeState -> 50.
- State 50: generic VarSet + source ChangeAnim selection.
- State 52: friction threshold now source expression abs(Vel X) < Const(...), generic VelSet.

Temporary adapters intentionally remaining:
- State 50 VelYPositive -> 51 phase split.
- State 50/51 PosYAtGround -> State 52 landing.
These are next engine/common-state semantics work, not Venus-specific replacements.

Regression:
0->10->11->12->0; State11 CTRL1; jump neutral/fwd/back; landing State52; camera/EDGE/zoom/joystick unchanged.
