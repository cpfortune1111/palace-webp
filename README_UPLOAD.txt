0.19.5a CMD Boolean Fix
Upload/replace ONLY index.html. Keep the 0.19.5 venus_runtime_states.json and venus_cmd_runtime.json.

Root cause:
command = "..." preprocessing returned the strings "true"/"false".
The deterministic AST correctly treated those as identifiers/queries, producing:
AST query true / AST query false.
Fix: command query preprocessing now emits numeric MUGEN-style truth values 1/0.

No gameplay/camera/joystick/state IR changes.
Retest walk, crouch, neutral/fwd/back jump, landing.
