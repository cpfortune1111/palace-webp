0.19.0 CNS Runtime M1
Upload/replace:
1. index.html after applying apply_0190.py to the exact repo 0.18.4 index.html
2. venus_runtime_states_0190.json

Acceptance:
- Hold DOWN: State 11 should show CTRL 1 (source: trigger1 = !AILevel).
- Jump and keep holding UP through landing: State 52 starts CTRL 0; at Time=3 generic CtrlSet grants CTRL 1 and command dispatch may re-enter State 40 without requiring State 0.
- Camera ±2850, player ±3750, EDGE 25%, zoom 1.860 remain unchanged.
