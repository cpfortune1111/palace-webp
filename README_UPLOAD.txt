0.22.2 Dual Fighter Camera M1

Upload/replace:
- index.html
Other 0.22.1 files remain unchanged.

Source-first camera basis:
IKEMEN-GO src/camera.go Fighting_View tracks camera.leftest/rightest and moves
targetLeft/targetRight when fighters exceed the stage tension zones.
StageTraining values retained:
- tension=200
- camera bounds ±2850
- player bounds ±3750
- screenleft/right=60 (kept as stage/player-bound data; full screen-bound
  enforcement is a later camera slice)
- verticalfollow=.5 / floortension=200

M1 changes:
- both P1 x and P2 x now participate in horizontal camera tracking
- highest of P1/P2 participates in the existing vertical-follow slice
- fixed zoom 1.860 remains LOCKED
- GLB posMul 0.00066987 remains unchanged
- 25% sprite edge allowance remains unchanged
- 0.22.1 damage/GetHit pipeline unchanged

Deliberately deferred:
- IKEMEN camera tension smoothing
- dynamic zoom / zoomout=.75
- complete screenleft/right enforcement
- full vertical camera parity

Test:
1. Walk P1 right/left: existing follow should remain.
2. Hit P2 repeatedly so knockback moves P2 toward the right: camera must now
   follow P2 when P2 reaches the right tension zone.
3. P1 movement on the opposite side must also affect framing.
4. Damage remains exactly 20 per punch and GetHit visuals remain normal.
