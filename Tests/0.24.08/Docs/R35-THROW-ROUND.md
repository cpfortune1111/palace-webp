# r35 — Giant Swing AIR, release and round presentation

## Throw corrections

* Root sprites now honor AIR H/V around sprite axis. AIR ox follows logical facing; AIR H changes the sprite flip, not the ox direction. Both player canvases share the primitive. Native comparison screenshots captured for initial grab and spin. HitDef p2facing=1 retains native opposite logical facing; apparent wrong facing was caused by ignored AIR H.
* Initial throw transfer applies TargetBind and ChangeAnim2 before first render. Default bind time1 is active on its creation tick, not the next tick; released velocities are not zeroed by stale binding. Bind copies owner velocity as native code does. Launching airborne fighters are not ground-pushed before their first movement tick.
* StateDef without anim preserves AIR progress while State Time resets. Both P1/P2 S806 continue the final14ticks rather than restarting the full throw animation.
* r34 extraction produced string velset values that baseline applyStateVelocity ignores. S800/S805/S806 now carry numeric component arrays; S806 uses -25,-21 with source VelAdd Y1.76. Source files unchanged.
* PosAdd X now follows native addX=facing*x, including S806 final reposition.

## Round presentation

New lossless WebP atlas uses user Round PNG exports at their authored1280×720 coordinates. Top frame bounds420,225–860,261; bottom420,339–860,375. Closed pieces touch atY300 (+39/-39 offsets), then separate linearly over10ticks. Words appear at tick10. ROUND N uses existing original foker90 GROUP0 purple/white. START retains an already-open ROUND frame. New START/KO/DOUBLE KO/DRAW/TIME OVER sprites hold until the message changes; there is no expired-animation white-text fallback. Winner-name bitmap messages retain their group/position.

All assets preload in roundView.ready before battle. round-review.html provides visual replay and ROUND→START sequence.

## Validation

20 throw combinations check capture-frame binding, exact bound positions, no mid-throw logical facing changes, negative launch VY, correct VX,14tick tail animation, no below-ground custom state and return to own ground states. Four KO cases, real HitDef contact/AI and original Moon throw/KO cleanup regression. Frame opening tests check seam,5tick midpoint,10tick endpoint/text reveal, START reuse and persistent sprite-only result messages. Visual screenshots compare actual player rendering with provided IKEMEN poses.

The r34 finite-position/no-error checks did not detect these visual/trajectory differences; r35 adds the explicit assertions above.
