0.19.6b CMD Tick-Order Fix
Upload/replace ONLY index.html. Keep the 0.19.6 JSON files.

Two runtime ordering bugs found:
1. Input history was sampled AFTER command/controller dispatch, so CMD queries saw the previous frame.
   It is now sampled at the start of every simulation tick.
2. stateTicks was incremented even when ChangeState entered a new state during that tick.
   This made the new state start effectively at Time=1, so State 50 skipped its real
   Time=0 ChangeAnim and stayed on AIR 40 (the frozen/repeating jump-start look).
   A newly entered state now remains Time=0 until its next simulation tick.

No CNS IR, CMD definitions, camera, EDGE, zoom, or joystick geometry changed.

Retest:
- left/right walk
- straight-up neutral jump (AIR 41 after State 50 entry)
- diagonal forward/back jump (AIR 42/43 after State 50 entry)
- crouch chain
- landing / held-up re-jump behavior
