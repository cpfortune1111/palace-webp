0.20.1 Logic Frame Debugger
Upload/replace index.html. venus_runtime_states.json included unchanged for convenience.

Fixes / debug UI:
- Play + Pause/Step moved OUTSIDE HUD to fixed top-right.
- HUD now shows TIME (State Time) and ELEM (current AIR element).
- Pause/Step displays the exact logical frame that CNS controllers evaluated.
  This removes the misleading one-tick visual gap where AIR had already advanced
  to E4 but the HUD HitDef marker still represented the previous evaluated frame.
- HitDef source logic is unchanged: Venus State200 trigger1 = AnimElem = 4.
- Normal battle simulation ordering is NOT changed by this debugger fix.

Future collision debug UI is reserved:
- toggle button when collision layer lands
- Clsn1 / attack hitbox = red
- Clsn2 / body collision = blue
