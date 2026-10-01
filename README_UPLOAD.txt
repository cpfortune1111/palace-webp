0.23.1 Facing-Relative Jump Anim Fix

Upload/replace:
- index.html

Source-first basis:
IKEMEN common1.cns.zss State 50 selects:
  ChangeAnim value = cond(vel x = 0, 41, ifElse(vel x > 0, 42, 43))

Our runtime stores horizontal vx in world-space, while CNS Vel X is facing-relative.
0.23.0 incorrectly selected 42/43 directly from world vx.

Fix:
  localVx = worldVx * p1Facing
  localVx > 0 -> Action 42
  localVx < 0 -> Action 43
  localVx = 0 -> Action 41

Expected:
- facing +1: forward jump -> 42, back jump -> 43
- facing -1: forward jump -> 42, back jump -> 43
  even though their world X directions are reversed.

No changes to PlayerPush, AutoTurn, camera, HitDef, damage or GetHit.
