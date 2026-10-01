0.23.2 Jump Anim + HUD Debug Fix

Upload/replace:
- index.html

Fixes:
1. Restores live debug HUD fields:
   State / TIME / ANIM / ELEM / Facing / X / Y / VX / Camera / P2 state-time-elem-HP.
   Pause/Step uses the authoritative logicFrame snapshot.

2. Corrects the 0.23.1 regression ONLY in jump animation selection.
   Movement/velocity/facing code is unchanged.
   The verified P1 forward/back jump movement from 0.23.0 is preserved.

Important:
- This patch does NOT alter jump velocity.
- It does NOT alter PlayerPush, AutoTurn, Camera, HitDef, Damage or GetHit.
- For the current runtime representation, State 50's JumpByVelocity display mapping
  returns to world vx: vx>0 => AIR 42, vx<0 => AIR 43, vx=0 => AIR 41.
  Sprite rendering already mirrors with p1Facing, so this swaps the displayed
  forward/back animation when facing=-1 without changing physical motion.

Test:
- Facing +1: confirm forward/back movement and ANIM in HUD.
- Facing -1: confirm movement is unchanged from 0.23.0, while the visible
  forward/back jump animation is now the opposite of 0.23.1.
- Pause/Step: TIME, ANIM and ELEM must remain visible and advance deterministically.
