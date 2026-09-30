0.21.0 P2 FighterInstance M1
Upload/replace index.html + venus_runtime_states.json.

Source-first Mars references checked:
SailorMars.def -> stcommon=mars_Common.cns, cns/st=mars.cns, anim=mars.air.
mars_Common.cns State 0:
type=S, physics=S, sprpriority=0; healthy standing resolves to Anim 0;
Time=0 PosSet y=0 and VelSet y=0.

M1:
- Mars is no longer just a hardcoded render/collision coordinate.
- Added P2 FighterInstance state: x/y, vx/vy, facing, state/time, anim/elem,
  ctrl, StateType, Physics, MoveType, life.
- P2 starts from StageTraining source p2startx=280, p2facing=-1.
- Mars Action 0 animation now advances on deterministic battle sim ticks.
- Pause freezes Mars; each Step advances Mars exactly one battle tick.
- Mars renderer and Mars Clsn2 collision both consume the P2 instance.
- HUD shows P2 S/T/E.

Deliberately deferred:
- Mars CMD/input/AI
- full Mars CNS controller lowering
- P1+P2 battle camera
- damage/GetHit states/hitpause/guard/sparks/sound

Regression:
- Existing Venus CONTACT at E4 must still work.
- Pause without Step: Mars idle frame and P2 time do not advance.
- Step: P2 T increments by exactly 1.
