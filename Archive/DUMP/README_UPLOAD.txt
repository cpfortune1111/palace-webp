0.23.3 Facing-Relative Vel X M1

Upload/replace:
- index.html

Root fix:
P1 `vx` is now the CNS/MUGEN-facing-relative X velocity.
World displacement is derived only when applying movement:
    worldVX = vx * p1Facing

Therefore:
- facing +1, CNS Vel X +8 => world +8
- facing -1, CNS Vel X +8 => world -8
- facing +1, CNS Vel X -8 => world -8
- facing -1, CNS Vel X -8 => world +8

AIR selection remains source-shaped:
    Vel X = 0 -> 41
    Vel X > 0 -> 42
    Vel X < 0 -> 43
Because `Vel X` is now local, Action 42/43 no longer needs a facing-specific patch.

HUD:
- VX(L) = CNS/local velocity
- WVX = world/screen movement velocity
- TIME / ANIM / ELEM remain visible

Scope:
- P1 velocity semantics only.
- P2 GetHit M1 remains stored as world velocity for now and is intentionally unchanged.
- PlayerPush, AutoTurn, camera, damage and collision unchanged.
