0.19.7e CMD Expiry / No Deferred X Fix
Upload/replace ONLY index.html. Keep all 0.19.7d attack atlas/JSON files.

Observed:
- rapid second X during State 200 caused another attack after returning to State 0
- X while holding down caused State 200 after standing
- X in air caused State 200 after landing

Root cause:
commandActive() incorrectly searched the entire CMD 'time' history for the FINAL step,
so an old X press could become active later. Its buffer also used stateTicks, which resets
on ChangeState, instead of a monotonic input clock.

Fix:
- final command step must complete on the CURRENT simulation tick
- older input history is used only for earlier steps of multi-step commands
- buffer.time uses monotonic inputTick, never State Time
- held /$F /$B /$U /$D remain continuous and unbuffered

Expected:
- X in State 0 -> one State 200
- second X while first attack is busy -> discarded, no queued second attack
- hold down + X -> no attack now and no attack after standing
- jump + X -> no attack now and no attack after landing
