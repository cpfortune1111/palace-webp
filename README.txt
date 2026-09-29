Prototype 0.14 — 30-degree joystick + visual jump fix

Joystick:
- A +/-30 degree band around the horizontal axis is reserved for walking.
- Up/down only trigger after the stick passes 30 degrees away from horizontal.
- Up-left/up-right beyond 30 degrees still produce directional jumps.
- Down-left/down-right beyond 30 degrees crouch.
- Release returns to idle.

Jump fix:
- Previous build updated posY numerically but draw() did not use posY.
- Venus draw Y now adds posY * scale.
- MUGEN negative posY therefore visibly moves Venus upward.
- Physics values are otherwise unchanged.

Stage calibration unchanged:
zoom 1.860, stage Y -60, ground 660, character scale 1:1.
