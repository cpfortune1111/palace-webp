0.19.1 Ground Transition M1
Upload/replace ONLY:
- index.html
- venus_runtime_states.json

Test:
1. From State 0 hold DOWN: 0 -> 10 -> 11.
2. State 11 must show CTRL 1.
3. Release DOWN: 11 -> 12 -> 0.
4. State 12: CTRL becomes 1 at Time=1.
5. Regression: jump/landing, camera ±2850, EDGE 25%, zoom 1.860, joystick feel unchanged.

Source-derived additions:
State 10 VelMul Time=0 x=.75; CtrlSet !AILevel; ChangeState AnimTime=0 -> 11.
State 11 ChangeAnim Anim=6 && AnimTime=0 -> 11; low velocity check using abs()/Const().
State 12 CtrlSet Time=1; ChangeState AnimTime=0 -> 0.
The P2/AI guard-specific trigger group in State 12 is not active for this human single-player M1 slice yet.
