# Neptune SNES update — 0.24.08-r13

- Synced current Neptune SNES command/cancel rules, AI choices and Common-state changes.
- Restored sprite 5150,10 at its original animation element and timing, encoded as an additional WebP page. Existing approved 11,0–2 to 10,0–2 mapping and intentional empty sprites remain.
- Kept Helper 9999 and its spawn path; no character's Helper 9999 was removed.
- Applied Width to body pushing and screen-edge offsets. Neptune guard states now execute their source controllers, including AI posture and guard exit conditions.
- Added hit-interrupted sound handling with native channel-zero defaults and explicit stopongethit handling. Channel one is not globally silenced.
- DisplayToClipboard is intentionally excluded by author request.
- Browser haptics are optional and device-dependent; exact waveform/envelope and hardware behaviour have not been verified.
- Reused the unchanged presentation pack cache rather than forcing another download of identical presentation media.

This release received syntax and asset/reference consistency checks. No per-character gameplay BUG TEST suite was run, as requested. It is not a claim that every matchup is bug-free.

## Future character bug checks (not run in this update)

Compare observed behaviour to source conditions and author-approved changes. A short-lived projectile or invisible frame is not inherently wrong. It becomes a bug candidate when the source expects a visible sprite or continued lifetime, but a reproducible run shows otherwise.

Record actor/state/animation/element, position/velocity, control flags and hitpause each tick. For Helpers, Projectiles and Explods, also record spawn, state changes, first visible frame, hit/cancel/remove events and the removal cause. Compare light/heavy versions, P1/P2, hit/miss/guard, ground/air, screen/stage edges and KO/time-over as separate cases.

A projectile lasting one tick should be flagged for review when its original removal or collision conditions have not occurred. It may be correct after immediate contact/cancellation or when the author explicitly specifies a one-tick effect. Missing sprites, unexplained NaN values and runtime exceptions can be identified automatically; ambiguous intended behaviour should be reported with the trace for author review rather than automatically rewritten.
