0.19.2a Movement Fix
Upload/replace ONLY index.html. Keep the existing 0.19.2 venus_runtime_states.json.

Fixes:
1. Ground physics S/C now integrates posX from source VelSet velocity, restoring forward/back walk.
2. command="holdfwd"/"holdback" ignores tiny horizontal joystick drift inside the locked ±15° neutral vertical cone, restoring true neutral jump.

Test:
- pure left/right walk moves Venus
- straight up => neutral jump
- up-right/up-left outside ±15° => forward/back jump
- crouch 10->11->12->0 remains good
- camera/EDGE/zoom/joystick thresholds unchanged
