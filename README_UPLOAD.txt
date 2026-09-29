0.19.7c X One-Shot Fix
Upload/replace ONLY index.html. Keep 0.19.7a JSON files.

Observed: after one X press, State 200 and State 0 repeatedly alternated, blocking walk/jump.
Cause: the M1 State -1 consumer could consume the same physical X press again after the temporary State 200 -> 0 animation return.

Fix:
- X press is consumed once by the State -1 M1 route.
- It cannot trigger State 200 again until X is physically released.
- release resets the one-shot latch.
- no CNS/CMD/camera/joystick changes.

Expected:
tap X -> State 200 once -> AIR 200 -> State 0 once.
After return, walk/jump/crouch work normally.
A new X attack requires release then press again.
