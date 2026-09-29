0.19.5 CMD/Input Compatibility M1
Upload index.html + venus_runtime_states.json + venus_cmd_runtime.json.
Parsed actual venus.cmd: 23 Command definitions.
M1 activates held-direction commands holdfwd /$F, holdback /$B, holdup /$U, holddown /$D.
Expression evaluator resolves command = "name" and command != "name" via CMD registry.
Scope: no full sequence/buffer syntax (~ / $ + comma timing) or buttons yet; State -1 attacks not enabled. Existing basic movement dispatcher remains, but now consumes named CMD commands instead of raw joystick booleans.
