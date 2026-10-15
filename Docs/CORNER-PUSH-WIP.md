# Cornerpush — native calculation groundwork, not certified

Reference: Ikemen GO `cb56d73badb322f3725257c2e8cfd157b2c3989d`, `src/char.go`, `checkCornerPush` at line 10015.

`Engine/corner-push.js` implements target selection in reverse run order, player-type/physical-hit/source eligibility, superpause suppression, the Ikemen target-hitshake gate, target friction for negative multipliers, screen confinement and camera-trackability gates, partial movement subtraction, and NoCornerPush displacement suppression without discarding friction.

`Tools/check-corner-push.mjs` passes executable cases for both corners, partial corner approach, reverse target order and fallback, projectile exclusion, missing valid targets, target friction, NoCornerPush and superpause. Input positions and velocities must already be converted into a shared world coordinate system; the function does not establish native mixed-localcoord float32 intermediate precision.

Helper-to-root contacts now store the resolved source cornerpush velocity/multiplier. Live Helper movement invokes the shared calculation, applies displacement independently of PosFreeze, decays the stored velocity and exposes that changing value through MoveHitVar. Zero velocity skips target construction. Existing root cornerpush remains unchanged; projectile MoveHitVar cornerpush queries still fail explicitly.

The actual browser fixtures pass live Helper query/displacement, NoCornerPush friction and projectile-exclusion assertions. A spawned Helper also advances through two real runtime steps under PosFreeze, producing positions -32/-48 and decaying velocities -16/-8 without applying its ordinary velocity. The complete regression containing these fixtures ended with exit 0 (`outputs/controller-helper-cornerpush-step-browser.log`). This verifies these paths, not the entire native scheduler.

Required next work includes physical Helper-to-Helper contact binding, exact native run-order and trackability inputs, mixed-localcoord precision and stopping thresholds, normal-pause/hitpause scheduling, shared root migration, and complete real-contact/physics regressions. Complete controller certification remains Pending.
