Prototype 0.15 — joystick calibration only

Changes:
- Existing horizontal +/-30 degree walk zone is unchanged.
- Added a vertical-center +/-15 degree neutral cone.
- Up within +/-15 degrees = neutral jump (vx=0 / AIR 41).
- Up outside that cone = forward/back jump according to horizontal direction.
- Down uses the same centered directional geometry for crouch input.
- Jump Y visual fix from the previous build is retained.
- Camera follow is NOT implemented yet.

Stage/camera calibration remains unchanged:
zoom 1.860, stage Y -60, ground 660, character scale 1:1.
