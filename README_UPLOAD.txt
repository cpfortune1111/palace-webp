0.20.0 HitDef Activation M1
Upload/replace index.html + venus_runtime_states.json. Keep existing atlases/assets.

Source-first exact Venus State 200 HitDef is now in IR.
Generic runtime: AnimElem query + HitDef controller activation + HUD HITDEF marker.
HitDef clears on ChangeState.

Pause/Step test: State200 must show HITDEF only at AIR element 4.
Element 4 lasts 5 ticks, so the controller can evaluate repeatedly while AnimElem=4.
Collision/P2 damage/guard/hitpause/sparks/sounds are NOT implemented yet.
