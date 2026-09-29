0.19.6a CMD Direction Fix
Upload/replace ONLY index.html. Keep 0.19.6 venus_runtime_states.json + venus_cmd_runtime.json.

Root cause:
The M2 implementation of '$' was wrong. /$U was allowed to match F/B, so walking could satisfy holdup and enter State 40. Because jump remained held/matched, it could repeatedly re-enter jump start animation.

Fix:
- $F/$B now require the requested horizontal component.
- $U/$D now require the requested vertical component.
- diagonals naturally satisfy both relevant components.
- one-token held commands remain current-state queries and bypass sequence buffer latching.

No state IR, camera, EDGE, zoom, or joystick geometry changes.
Retest: left/right walk; straight-up neutral jump; diagonal fwd/back jump; crouch; landing.
